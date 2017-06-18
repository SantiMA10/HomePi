import { ReadData } from "../sensor/read";
import * as admin from "firebase-admin";
import {SensorFactory, SensorTypes} from "../factory/SensorFactory";

export interface SensorServiceType{
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

export class SensorService {

    config : SensorServiceConfig;
    sensor : ReadData;
    ref : admin.database.Reference;
    callback : any;

    constructor(config : SensorServiceConfig, db: admin.database.Database, key : string){
        this.config = config;
        this.sensor = SensorFactory.build(config.sensorType, config.sensorConfig);
        this.ref = db.ref("service/" + key);

        this.ref.update({
            "name" : this.config.name,
            "type" : this.config.sensorServiceType,
            "date" : new Date(),
            "room" : this.config.room,
            "key" : this.config.key
        });

        this.callback = (snap) => {
            let val = snap.val();

            if(!val.user){
                this.ref.update({
                    "working" : false,
                    "user": "homePi-server",
                    "type" : this.config.sensorServiceType,
                    "date" : new Date(),
                    "room" : this.config.room,
                    "key" : this.config.key
                });
                this.readSensor();
            }
            else{
                if(val.working && val.user !== "homePi-server") {
                    this.readSensor();
                }
            }
        };

        this.ref.on("value", this.callback);
    }

    public readSensor() : any {
        return this.sensor.get()
            .then((value) => {

                this.ref.update({
                    "working" : false,
                    "user": "homePi-server",
                    "status" : value,
                    "date" : new Date()
                });

                return value;
            })
            .catch((error) => {

                this.ref.update({
                    "working": false,
                    "user": "homePi-server",
                    "status" : "error " + error,
                    "date" : new Date()
                });

                return error;
            });

    }

    public destroy(){
       this.ref.off('value', this.callback);
    }

}