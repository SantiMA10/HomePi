import { ReadData } from "../sensor/read";
import * as admin from "firebase-admin";

export enum SensorTypes{
    TEMPERATURE,
    HUMIDITY
}

export class SensorService {

    name : string;
    place : string;
    sensor : ReadData;
    type : SensorTypes;
    ref : admin.database.Reference;

    constructor(name:string, place:string, sensor : ReadData, type : SensorTypes, db: admin.database.Database){
        this.name = name;
        this.place = place;
        this.sensor = sensor;
        this.type = type;
        this.ref = db.ref("service/" + this.name);

        this.ref.on("value", (snap) => {
           let val = snap.val();

           if(!val){
               this.ref.update({
                   "working" : false,
                   "user": "homePi-server",
                   "type" : this.enumToString(this.type),
                   "date" : new Date(),
                   "place" : this.place,
               });
               this.readSensor();
           }
           else{
               if(val.working && val.user !== "homePi-server") {
                   this.readSensor();
               }
           }


        });
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

    public enumToString(sensorType : SensorTypes) : number{
        switch (sensorType){
            case SensorTypes.TEMPERATURE:
                return 1;
            case SensorTypes.HUMIDITY:
                return 2;
        }
    }

}