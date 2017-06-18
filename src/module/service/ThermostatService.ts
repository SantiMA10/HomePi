import { SwitchButton } from "../actuator/switch";
import { ReadData } from "../sensor/read";
import * as admin from "firebase-admin";
import * as Promise from 'bluebird';
import {ActuatorFactory, ActuatorType} from "../factory/ActuatorFactory";
import {SensorFactory, SensorTypes} from "../factory/SensorFactory";
import {NotificationSender} from "../util/NotificationSender";

export interface ThermostatServiceConfig{
    name : string,
    room : string,
    actuatorType : ActuatorType,
    actuatorConfig : any,
    status : number,
    refreshTime : number,
    sensors : SensorConfig[],
    key : string
}

interface SensorConfig{
    sensorType : SensorTypes,
    sensorConfig : any
}

interface ThermostatServiceInstance{

    user : string;
    working: boolean;
    status: number;
    config : any;
}

export class ThermostatService {

    config : ThermostatServiceConfig;
    switchButton : SwitchButton;
    sensors : ReadData[];
    ref : admin.database.Reference;
    timeOut : any;
    callback : any;

    constructor(config : ThermostatServiceConfig, db: admin.database.Database){
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
                this.ref.update(this.work(instance));
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

    public hasToWork(instance : ThermostatServiceInstance, timeOut : any) : boolean{
        return instance.working && instance.user != process.env.SERVER_USER && !timeOut;
    }

    public hasToStopWork(instance: ThermostatServiceInstance, timeOut: any) : boolean {
        return !instance.working && instance.user != process.env.SERVER_USER && timeOut != null;
    }

    public stopWork() : any{
        clearTimeout(this.timeOut);
        this.switchButton.off();

        return null;
    }

    public work(instance : ThermostatServiceInstance) : any {

        let promises = this.sensors.map((value) => { return value.get(); });
        let current = -1;

        let ctx = this;

        Promise.all(promises)
            .then((temperatures) => {
                current = temperatures.reduce((temp, total) => (total + temp)/2);
                if(instance.working){
                    ctx.timeOut = setTimeout(() => { ctx.work(instance); }, ctx.config.refreshTime);
                }
                if(current < instance.status){
                    ctx.switchButton.on();
                    return{
                        "date" : new Date(),
                    };
                }
                else{
                    if(instance.config && instance.config.notification) {
                        new NotificationSender().sendNotification({
                            title: this.config.name + " - " + this.config.room,
                            icon: "",
                            body: "Temperatura alcanzada. (" + current + "º)"
                        }, instance.config.config.notification);
                    }
                    ctx.switchButton.off();
                    return {
                        "date" : new Date(),
                    };
                }
            });

    }

    public destroy(){
        this.ref.off('value', this.callback);
    }



}