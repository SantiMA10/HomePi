import { ReadData } from "../../sensor/read";
import * as admin from "firebase-admin";
import {SensorFactory, SensorTypes} from "../../../factory/SensorFactory";
import {Accessory} from "../Accessory";

export enum SensorAccessoryType{
    TEMPERATURE,
    HUMIDITY,
}

export interface SensorAccessoryConfig{
    name : string,
    room : string,
    sensorType : SensorTypes,
    sensorConfig : any,
    sensorServiceType : SensorAccessoryType,
    key : string
}

interface SensorAccessoryInstance{
    working : boolean,
    user : string,
    status : number,
}

export class SensorService implements Accessory{

    config : SensorAccessoryConfig;
    sensor : ReadData;
    ref : admin.database.Reference;
    callback : any;

    constructor(config : SensorAccessoryConfig, db: admin.database.Database){
        this.config = config;
        this.sensor = SensorFactory.build(config.sensorType, config.sensorConfig);
        this.callback = (snap) => {
            let instance = snap.val();
            if(this.hasToWork(instance)){
                this.work().then((value) => {
                    this.ref.update(value);
                })
            }
        };

        if(db){
            this.ref = db.ref("service/" + this.config.key);
            this.ref.update({
                "name" : this.config.name,
                "type" : this.config.sensorServiceType,
                "date" : new Date(),
                "room" : this.config.room,
                "key" : this.config.key
            });
            this.ref.on("value", this.callback);
        }


    }

    public hasToWork(instance : SensorAccessoryInstance){
        return instance.working && instance.user != process.env.SERVER_USER;
    }

    public work() : any {
        return this.sensor.get()
            .then((value) => {
                return {
                    "working" : false,
                    "user": process.env.SERVER_USER,
                    "status" : value,
                    "date" : new Date()
                };
            })
            .catch((error) => {

                return {
                    "working": false,
                    "user": process.env.SERVER_USER,
                    "status" : "error " + error,
                    "date" : new Date()
                };
            });

    }

    public destroy(){
       this.ref.off('value', this.callback);
    }

}