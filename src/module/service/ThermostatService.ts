import { SwitchButton } from "../actuator/switch";
import { ReadData } from "../sensor/read";
import * as admin from "firebase-admin";
import * as Promise from 'bluebird';

export class ThermostatService {

    name : string;
    place : string;
    switchButton : SwitchButton;
    sensors : ReadData[];
    status : number;
    ref : admin.database.Reference;
    timeOut : any;
    val : any;
    refreshTime : number;

    constructor(name : string, place : string, switchButton : SwitchButton, sensors : ReadData[], status : number, refreshTime : number, db: admin.database.Database){
        this.name = name;
        this.place = place;
        this.switchButton = switchButton;
        this.sensors = sensors;
        this.status = status;
        this.ref = db.ref("service/" + this.name);
        this.refreshTime = refreshTime;

        let ctx = this;

        this.ref.on("value", (snap) => {
            ctx.val = snap.val();

            if(!ctx.val){
                this.ref.update({
                    "working" : false,
                    "user": "homePi-server",
                    "type" : 4,
                    "status" : this.status,
                    "date" : new Date(),
                    "place" : this.place,
                });
            }
            else{
                if(ctx.val.working && ctx.val.user !== "homePi-server" && !ctx.timeOut) {
                    this.work(ctx.val.status, ctx.val.working);
                }
                else if(!ctx.val.working && ctx.val.user !== "homePi-server"){
                    if(ctx.timeOut){
                        clearTimeout(ctx.timeOut);
                        ctx.timeOut = null;
                    }
                }
            }

        });
    }

    public work(status : number, working : boolean) : any {

        let promises = this.sensors.map((value) => { return value.get(); });
        let current = -1;

        let ctx = this;

        Promise.all(promises)
            .then((temperatures) => {
                current = temperatures.reduce((temp, total) => (total + temp)/2);
                console.log(current);
                if(working){
                    ctx.timeOut = setTimeout(() => { ctx.work(ctx.val.status, ctx.val.working); }, ctx.refreshTime * 60 * 1000);
                }
                if(current < status){
                    ctx.switchButton.on();
                    ctx.ref.update({
                        "date" : new Date(),
                    });
                }
                else{
                    ctx.switchButton.off();
                    ctx.ref.update({
                        "date" : new Date(),
                    });
                }
            });

    }


}