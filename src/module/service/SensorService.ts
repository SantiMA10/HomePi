import { ReadData } from "../sensor/read";
import * as admin from "firebase-admin";
import {SensorFactory, SensorTypes} from "../factory/SensorFactory";

export enum SensorServiceType{
    TEMPERATURE,
    HUMIDITY,
}

export interface SensorServiceConfig{
    name : string,
    room : string,
    sensorType : SensorTypes,
    sensorConfig : any,
    sensorServiceType : SensorServiceType,
    key : string
}

interface SensorServiceInstance{
    working : boolean,
    user : string,
    status : number,
}

export class SensorService {

    config : SensorServiceConfig;
    sensor : ReadData;
    ref : admin.database.Reference;
    callback : any;

    constructor(config : SensorServiceConfig, db: admin.database.Database){
        this.config = config;
        this.sensor = SensorFactory.build(config.sensorType, config.sensorConfig);
        this.callback = (snap) => {
            let instance = snap.val();
            if(this.hasToWork(instance)){
                this.ref.update(this.readSensor());
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

    public hasToWork(instance : SensorServiceInstance){
        return instance.working && instance.user != process.env.SERVER_USER;
    }

    public readSensor() : any {
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