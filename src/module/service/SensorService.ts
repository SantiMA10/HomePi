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
    sensorServiceType : SensorServiceType
}

export class SensorService {

    name : string;
    room : string;
    sensor : ReadData;
    type : SensorServiceType;
    ref : admin.database.Reference;
    callback : any;

    constructor(config : SensorServiceConfig, db: admin.database.Database){
        this.name = config.name;
        this.room = config.room;
        this.sensor = SensorFactory.build(config.sensorType, config.sensorConfig);
        this.type = config.sensorServiceType;
        this.ref = db.ref("service/" + this.name);

        this.callback = (snap) => {
            let val = snap.val();

            if(!val){
                this.ref.update({
                    "working" : false,
                    "user": "homePi-server",
                    "type" : this.type,
                    "date" : new Date(),
                    "room" : this.room,
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

    public detroy(){
       this.ref.off('value', this.callback);
    }

}