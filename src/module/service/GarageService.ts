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
    status : GarageStatus
}

export class GarageService {

    name : string;
    room : string;
    switchButton : SwitchButton;
    status : GarageStatus;
    ref : admin.database.Reference;
    callback : any;
    val : any;

    constructor(config : GarageServiceConfig, db: admin.database.Database){
        this.name = config.name;
        this.room = config.room;
        this.switchButton = ActuatorFactory.build(config.actuatorType, config.actuatorConfig);
        this.status = config.status;
        this.ref = db.ref("service/" + this.name);
        this.callback = (snap) => {
            let val = snap.val();
            this.val = val;

            if(!val){
                this.ref.update({
                    "working" : false,
                    "user": "homePi-server",
                    "type" : 0,
                    "status" : this.status,
                    "date" : new Date(),
                    "room" : this.room,
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
                    title : this.name + " - " + this.room,
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

    public detroy(){
        this.ref.off('value', this.callback);
    }


}