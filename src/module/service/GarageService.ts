import { SwitchButton } from "../actuator/switch";
import * as admin from "firebase-admin";
import {ActuatorFactory, ActuatorType} from "../factory/ActuatorFactory";
import {NotificationSender} from "../util/NotificationSender";

export enum GarageStatus{
    OPEN,
    CLOSE,
    OPENNING,
    CLOSSING
}

export interface GarageServiceConfig{
    name : string,
    room : string,
    actuatorType : ActuatorType,
    actuatorConfig : any,
    status : GarageStatus,
    key : string
}

export class GarageService {

    config : GarageServiceConfig;
    switchButton : SwitchButton;
    ref : admin.database.Reference;
    callback : any;
    val : any;

    constructor(config : GarageServiceConfig, db: admin.database.Database, key : string){

        this.config = config;

        this.switchButton = ActuatorFactory.build(config.actuatorType, config.actuatorConfig);
        this.ref = db.ref("service/" + key);

        this.ref.update({
            "name" : this.config.name,
            "key" : this.config.key,
            "status" : this.config.status,
            "date" : new Date(),
            "room" : this.config.room,
        });

        this.callback = (snap) => {
            let val = snap.val();
            this.val = val;

            if(!val.user){
                this.ref.update({
                    "working" : false,
                    "key" : this.config.key,
                    "user": "homePi-server",
                    "type" : 0,
                    "status" : this.config.status,
                    "date" : new Date(),
                    "room" : this.config.room,
                });
            }
            else{
                if(val.working && val.user !== "homePi-server"
                    && val.status != GarageStatus.OPENNING && val.status != GarageStatus.CLOSSING) {
                    this.work(val.status);
                }
            }

        };

        this.ref.on("value", this.callback);
    }

    public work(status : GarageStatus) : any {

        let target;
        let step;

        if(status == GarageStatus.OPEN){
            step = GarageStatus.CLOSSING;
            target = GarageStatus.CLOSE;
        }
        else if(status == GarageStatus.CLOSE){
            step = GarageStatus.OPENNING;
            target = GarageStatus.OPEN;
        }

        this.switchButton.blink();

        this.ref.update({
            "date" : new Date,
            "status" : step,
        });

        setTimeout(() => {
            if(this.val.config && this.val.config.notification) {
                new NotificationSender().sendNotification({
                    title : this.config.name + " - " + this.config.room,
                    icon : "",
                    body : "Ahora la puerta esta " + (target == GarageStatus.OPEN ? "abierta" : "cerrada") + "."
                }, this.val.config.notification.filter((id) => this.val.user != id));
            }

            this.ref.update({
                "date" : new Date,
                "status" : target,
                "working" : false,
                "user": "homePi-server",
            });
        }, 20000)


    }

    public destroy(){
        this.ref.off('value', this.callback);
    }


}