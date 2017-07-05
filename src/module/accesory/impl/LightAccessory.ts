import { SwitchButton } from "../../actuator/switch";
import * as admin from "firebase-admin";
import {ActuatorFactory, ActuatorType} from "../../../factory/ActuatorFactory";
import {NotificationSender} from "../../../util/NotificationSender";
import {Accessory} from "../Accessory";
import {ReadData} from "../../sensor/read";
import {isNullOrUndefined} from "util";
import {SensorFactory, SensorTypes} from "../../../factory/SensorFactory";

/**
 * Interfaz con los valores de la configuracion de la luz
 */
export interface LightAccessoryConfig{
    name : string,
    room : string,
    actuatorType : ActuatorType,
    actuatorConfig : any,
    sensorType : SensorTypes,
    sensorConfig : any,
    photoresistorOnValue : number,
    status : boolean,
    key : string
}

/**
 * Interfaz los datos ensenciales del estado de la luz
 */
interface LightAccessoryInstance{
    working : boolean,
    user : string,
    status : boolean,
    config : any
}

/**
 * Clase que implementa la logica necesaria para controlar la una luz
 */
export class LightAccessory implements Accessory{

    config : LightAccessoryConfig;
    switchButton : SwitchButton;
    ref : admin.database.Reference;
    sensor : ReadData;
    callback : any;

    constructor(config : LightAccessoryConfig, db: admin.database.Database){
        this.config = config;
        this.switchButton = ActuatorFactory.build(config.actuatorType, config.actuatorConfig);
        if(!isNullOrUndefined(config.sensorType) && !isNullOrUndefined(config.sensorConfig)){
            if(isNullOrUndefined(config.photoresistorOnValue)){
                config.photoresistorOnValue = 80;
            }
            this.sensor = SensorFactory.build(config.sensorType, config.sensorConfig);
        }
        this.callback = (snap) => {
            let instance = snap.val();
            if(this.hasToWork(instance)){
                this.ref.update(this.work(instance));
            }
        };

        if(db != null){
            this.ref = db.ref("service/" + this.config.key);
            this.ref.update({
                "name" : this.config.name,
                "key" : this.config.key,
                "status" : this.config.status,
                "date" : new Date(),
                "room" : this.config.room,
            });
            this.ref.on("value", this.callback);
        }


    }

    public hasToWork(instance : LightAccessoryInstance){
        return instance.working && instance.user !== process.env.SERVER_USER;
    }

    public work(instance : LightAccessoryInstance) : any {

        if(JSON.parse(instance.status+"")){
            this.switchButton.off();
            instance.status = false;
        }
        else{
            this.switchButton.on();
            instance.status = true;
        }

        if(!this.sensor) {

            if (instance.config && instance.config.notification) {
                new NotificationSender().sendNotification({
                    title: this.config.name + " - " + this.config.room,
                    icon: "",
                    body: "Ahora la luz esta " + (instance.status ? "encendida" : "apagada") + "."
                }, instance.config.notification.filter((id) => instance.user != id));
            }

        }
        else{
            this.sensor.get().then((value) => {

                if(instance.status && value > this.config.photoresistorOnValue
                    || !instance.status && value < this.config.photoresistorOnValue){

                    if(instance.config && instance.config.notification) {
                        new NotificationSender().sendNotification({
                            title : this.config.name + " - " + this.config.room,
                            icon : "",
                            body : "Se ha detectado un error en la luz."
                        }, instance.config.notification);
                    }

                }

            });
        }


        return {
            "date" : new Date(),
            "status" : instance.status,
            "working" : false,
            "user" : process.env.SERVER_USER
        };
    }

    public destroy(){
        this.ref.off('value', this.callback);
    }


}