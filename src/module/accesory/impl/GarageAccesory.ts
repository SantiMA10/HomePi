import { SwitchButton } from "../../actuator/switch";
import * as admin from "firebase-admin";
import {ActuatorFactory, ActuatorType} from "../../../factory/ActuatorFactory";
import {NotificationSender} from "../../../util/NotificationSender";
import * as Bluebird from 'bluebird';
import {Accessory} from "../Accessory";
import {SensorFactory, SensorTypes} from "../../../factory/SensorFactory";
import {ReadData} from "../../sensor/read";
import {isNullOrUndefined} from "util";

/**
 * Enumerado con los estados de la puerta del garaje
 */
export enum GarageStatus{
    OPEN,
    CLOSE,
    OPENNING,
    CLOSSING
}

/**
 * Interfaz con los valores de la configuracion del garaje
 */
export interface GarageAccessoryConfig {
    name : string,
    room : string,
    actuatorType : ActuatorType,
    actuatorConfig : any,
    sensorType : SensorTypes,
    sensorConfig : any,
    status : GarageStatus,
    key : string
}

/**
 * Interfaz los datos ensenciales del estado del garaje
 */
interface GarageAccessoryInstance{
    working : boolean,
    user : string,
    status : GarageStatus,
    config : any
}

/**
 * Clase que implementa la logica necesaria para controlar la puerta del garaje
 */
export class GarageAccessory implements Accessory{

    config : GarageAccessoryConfig;
    switchButton : SwitchButton;
    sensor : ReadData;
    ref : admin.database.Reference;
    callback : any;

    constructor(config : GarageAccessoryConfig, db: admin.database.Database){

        this.config = config;
        this.switchButton = ActuatorFactory.build(config.actuatorType, config.actuatorConfig);
        if(!isNullOrUndefined(config.sensorType) && !isNullOrUndefined(config.sensorConfig)){
            this.sensor = SensorFactory.build(config.sensorType, config.sensorConfig);
        }
        this.callback = (snap) => {
            let instance = snap.val();
            if(this.hasToWork(instance)){
                this.work(instance)
                    .then((instance) => {
                        this.ref.update(instance.update);
                        instance.promise.then((instance) => {
                            this.ref.update(instance);
                        })
                    });
            }
        };

        if(db){
            this.ref = db.ref("service/" + this.config.key);

            this.ref.update({
                "name" : this.config.name || "",
                "key" : this.config.key,
                "status" : this.config.status || GarageStatus.CLOSE,
                "date" : new Date(),
                "room" : this.config.room ,
            });
            this.ref.on("value", this.callback);
        }


    }

    public hasToWork(instance : GarageAccessoryInstance) : boolean{
        return instance.working && instance.user != process.env.SERVER_USER && instance.status != GarageStatus.CLOSSING
            && instance.status != GarageStatus.OPENNING;
    }

    public work(instance : GarageAccessoryInstance) : Bluebird<any> {

        let target;
        let step;

        if(instance.status == GarageStatus.OPEN){
            step = GarageStatus.CLOSSING;
            target = GarageStatus.CLOSE;
        }
        else if(instance.status == GarageStatus.CLOSE){
            step = GarageStatus.OPENNING;
            target = GarageStatus.OPEN;
        }

        this.switchButton.blink();

        return new Bluebird((resolve) => {

            return resolve({
                "update" : {
                    "date" : new Date,
                    "status" : step,
                },
                "promise" : new Bluebird((resolve) => {

                    setTimeout(() => {

                        if(!this.sensor){

                            if(instance.config && instance.config.notification) {
                                new NotificationSender().sendNotification({
                                    title : this.config.name + " - " + this.config.room,
                                    icon : "",
                                    body : "Ahora la puerta esta " + (target == GarageStatus.OPEN ? "abierta" : "cerrada") + "."
                                }, instance.config.notification.filter((id) => instance.user != id));
                            }

                            resolve({
                                "date" : new Date,
                                "status" : target,
                                "working" : false,
                                "user": process.env.SERVER_USER,
                            });

                        }
                        else {
                            this.sensor.get().then((value) => {

                                if (target == GarageStatus.CLOSE && value == 1
                                    || target == GarageStatus.OPEN && value == 0) {

                                    if (instance.config && instance.config.notification) {
                                        new NotificationSender().sendNotification({
                                            title: this.config.name + " - " + this.config.room,
                                            icon: "",
                                            body: "Se ha detectado un error en la puerta."
                                        }, instance.config.notification);
                                    }

                                    resolve({
                                        "date": new Date,
                                        "working": false,
                                        "user": process.env.SERVER_USER,
                                    });

                                }
                                else {
                                    if (instance.config && instance.config.notification) {
                                        new NotificationSender().sendNotification({
                                            title: this.config.name + " - " + this.config.room,
                                            icon: "",
                                            body: "Ahora la puerta esta " + (target == GarageStatus.OPEN ? "abierta" : "cerrada") + "."
                                        }, instance.config.notification.filter((id) => instance.user != id));
                                    }

                                    resolve({
                                        "date": new Date,
                                        "status": target,
                                        "working": false,
                                        "user": process.env.SERVER_USER,
                                    });
                                }


                            });
                        }

                    }, 20000);

                })
            });

        });

    }

    public destroy(){
        this.ref.off('value', this.callback);
    }


}