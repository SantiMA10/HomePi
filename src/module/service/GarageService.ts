import { SwitchButton } from "../actuator/switch";
import * as admin from "firebase-admin";

export enum GarageStatus{
    OPEN,
    CLOSE,
    OPENNING,
    CLOSSING
}

export class GarageService {

    name : string;
    place : string;
    switchButton : SwitchButton;
    status : GarageStatus;
    ref : admin.database.Reference;

    constructor(name : string, place : string, switchButton : SwitchButton, status : GarageStatus, db: admin.database.Database){
        this.name = name;
        this.place = place;
        this.switchButton = switchButton;
        this.status = status;
        this.ref = db.ref("service/" + this.name);

        this.ref.on("value", (snap) => {
            let val = snap.val();

            if(!val){
                this.ref.update({
                    "working" : false,
                    "user": "homePi-server",
                    "type" : "garage",
                    "status" : this.status,
                    "date" : new Date(),
                    "place" : this.place,
                });
            }
            else{
                if(val.working && val.user !== "homePi-server"
                        && val.status != GarageStatus.OPENNING && val.status != GarageStatus.CLOSSING) {
                    this.work(val.status);
                }
            }

        });
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
            this.ref.update({
                "date" : new Date,
                "status" : target,
                "working" : false,
                "user": "homePi-server",
            });
        }, 20000)


    }


}