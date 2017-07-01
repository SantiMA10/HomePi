import { SwitchButton } from "../../actuator/switch";
import { ReadData } from "../../sensor/read";
import * as admin from "firebase-admin";
import * as Promise from 'bluebird';
import {ActuatorFactory, ActuatorType} from "../../../factory/ActuatorFactory";
import {SensorFactory, SensorTypes} from "../../../factory/SensorFactory";
import {NotificationSender} from "../../../util/NotificationSender";
import Bluebird = require("bluebird");
import {isNullOrUndefined} from "util";
import {Accessory} from "../Accessory";

/**
 * Interfaz con la configuracion para el accesorio
 */
export interface ThermostatAccessoryConfig{
    name : string,
    room : string,
    actuatorType : ActuatorType,
    actuatorConfig : any,
    status : number,
    refreshTime : number,
    sensors : SensorConfig[],
    key : string
}

/**
 * Interfaz con la configuracion para el sensor
 */
interface SensorConfig{
    sensorType : SensorTypes,
    sensorConfig : any
}

/**
 * Interfaz con los valores necesarios para conocer el estado del accesorio
 */
interface ThermostatAccessoryInstance{

    user : string;
    working: boolean;
    status: number;
    config : any;
}

/**
 * Clase que implementa la logica para controlar un termostato
 */
export class ThermostatService implements Accessory{

    config : ThermostatAccessoryConfig;
    switchButton : SwitchButton;
    sensors : ReadData[];
    ref : admin.database.Reference;
    timeOut : any;
    callback : any;

    constructor(config : ThermostatAccessoryConfig, db: admin.database.Database){
        this.config = config;
        this.switchButton = ActuatorFactory.build(config.actuatorType, config.actuatorConfig);
        this.sensors = [];
        config.sensors.forEach((sensor) => {
            this.sensors.push(SensorFactory.build(sensor.sensorType, sensor.sensorConfig));
        });

        config.refreshTime = config.refreshTime * 60 * 1000; //Pasamos minutos a milisegundos
        this.callback = (snap) => {
            let instance = snap.val();

            if(this.hasToWork(instance, this.timeOut)){
                this.work(instance).then((instance) => { this.ref.update(instance)});
            }
            else if(this.hasToStopWork(instance, this.timeOut)){
                this.timeOut = this.stopWork();
            }

        };

        if(db){
            this.ref = db.ref("service/" +  this.config.key);
            this.ref.update({
                "name" : this.config.name,
                "status" : this.config.status,
                "date" : new Date(),
                "room" : this.config.room,
                "key" : this.config.key
            });
            this.ref.on("value", this.callback);
        }


    }

    public hasToWork(instance : ThermostatAccessoryInstance, timeOut : any) : boolean{
        return instance.working && instance.user != process.env.SERVER_USER && !timeOut;
    }

    /**
     * Método que sirve para detectar si el termostato tiene que dejar de comprobar la temperatura
     * @param instance
     * @param timeOut
     * @returns {boolean}
     */
    public hasToStopWork(instance: ThermostatAccessoryInstance, timeOut: any) : boolean {
        return !instance.working && instance.user != process.env.SERVER_USER && timeOut != null;
    }

    public stopWork() : any{
        clearTimeout(this.timeOut);
        this.switchButton.off();

        return null;
    }

    public work(instance : ThermostatAccessoryInstance) : any {

        let promises = this.sensors.map((value) => { return value.get(); });
        let current = -1;

        let ctx = this;

        return Bluebird.all(promises)
            .then((temperatures) => {
                current = temperatures.reduce((temp, total) => (total + temp)/2);
                if(instance.working){
                    ctx.timeOut = setTimeout(() => { ctx.work(instance); }, ctx.config.refreshTime);
                }
                if(current < instance.status){
                    ctx.switchButton.on();
                    return ({
                        "date" : new Date(),
                    });
                }
                else{

                    if(!isNullOrUndefined(instance.config) && !isNullOrUndefined(instance.config.notification)) {
                        new NotificationSender().sendNotification({
                            title: this.config.name + " - " + this.config.room,
                            icon: "",
                            body: "Temperatura alcanzada. (" + current + "º)"
                        }, instance.config.notification);
                    }
                    ctx.switchButton.off();
                    return ({
                        "date" : new Date(),
                    });
                }
            });

    }

    public destroy(){
        this.ref.off('value', this.callback);
    }



}