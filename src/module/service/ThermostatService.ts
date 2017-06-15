import { SwitchButton } from "../actuator/switch";
import { ReadData } from "../sensor/read";
import * as admin from "firebase-admin";
import * as Promise from 'bluebird';
import {ActuatorFactory, ActuatorType} from "../factory/ActuatorFactory";
import {SensorFactory, SensorTypes} from "../factory/SensorFactory";
import {NotificationSender} from "../util/NotificationSender";

export interface ThermostatServiceConfig{
    name : string,
    room : string,
    actuatorType : ActuatorType,
    actuatorConfig : any,
    status : number,
    refreshTime : number,
    sensorTypes : SensorTypes[],
    sensorConfigs : any[]
}

export class ThermostatService {

    name : string;
    room : string;
    switchButton : SwitchButton;
    sensors : ReadData[];
    status : number;
    ref : admin.database.Reference;
    timeOut : any;
    val : any;
    refreshTime : number;
    callback : any;

    constructor(config : ThermostatServiceConfig, db: admin.database.Database){
        this.name = config.name;
        this.room = config.room;
        this.switchButton = ActuatorFactory.build(config.actuatorType, config.actuatorConfig);
        this.sensors = [];
        for(let i = 0; i < config.sensorTypes.length; i++){
            this.sensors.push(SensorFactory.build(config.sensorTypes[i], config.sensorConfigs[i]));
        }
        this.status = config.status;
        this.refreshTime = config.refreshTime * 60 * 1000; //Pasamos minutos a milisegundos
        this.ref = db.ref("service/" + this.name);

        let ctx = this;

        this.callback = (snap) => {
            ctx.val = snap.val();

            if(!ctx.val){
                this.ref.update({
                    "working" : false,
                    "user": "homePi-server",
                    "type" : 4,
                    "status" : this.status,
                    "date" : new Date(),
                    "room" : this.room,
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
                        this.switchButton.off();
                    }
                }
            }

        };

        this.ref.on("value", this.callback);
    }

    public work(status : number, working : boolean) : any {

        let promises = this.sensors.map((value) => { return value.get(); });
        let current = -1;

        let ctx = this;

        Promise.all(promises)
            .then((temperatures) => {
                current = temperatures.reduce((temp, total) => (total + temp)/2);
                if(working){
                    ctx.timeOut = setTimeout(() => { ctx.work(ctx.val.status, ctx.val.working); }, ctx.refreshTime);
                }
                if(current < status){
                    ctx.switchButton.on();
                    ctx.ref.update({
                        "date" : new Date(),
                    });
                }
                else{
                    if(this.val.config && this.val.config.notification) {
                        new NotificationSender().sendNotification({
                            title: this.name + " - " + this.room,
                            icon: "",
                            body: "Temperatura alcanzada. (" + current + "º)"
                        }, this.val.config.notification);
                    }
                    ctx.switchButton.off();
                    ctx.ref.update({
                        "date" : new Date(),
                    });
                }
            });

    }

    public detroy(){
        this.ref.off('value', this.callback);
    }


}