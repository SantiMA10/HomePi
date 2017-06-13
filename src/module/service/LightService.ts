import { SwitchButton } from "../actuator/switch";
import * as admin from "firebase-admin";

export class LightService {

    name : string;
    place : string;
    switchButton : SwitchButton;
    status : boolean;
    ref : admin.database.Reference;

    constructor(name : string, place : string, switchButton : SwitchButton, status : boolean, db: admin.database.Database){
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
                    "type" : 3,
                    "status" : this.status,
                    "date" : new Date(),
                    "place" : this.place,
                });
            }
            else{
                if(val.working && val.user !== "homePi-server") {
                    this.work(val.status);
                }
            }

        });
    }

    public work(status : boolean) : any {

        let query = {
            "date" : new Date,
            "status" : false,
            "working" : false,
            "user": "homePi-server",
        };

        if(JSON.parse(status+"")){
            this.switchButton.off();
            query.status = false;
        }
        else{
            this.switchButton.on();
            query.status = true;
        }

        this.ref.update(query);
    }


}