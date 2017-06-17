import { SwitchButton } from "../actuator/switch";
import * as admin from "firebase-admin";
import {ActuatorFactory, ActuatorType} from "../factory/ActuatorFactory";
import {NotificationSender} from "../util/NotificationSender";

export interface LightServiceConfig{
    name : string,
    room : string,
    actuatorType : ActuatorType,
    actuatorConfig : any,
    status : boolean,
    key : string
}

export class LightService {

    config : LightServiceConfig;
    switchButton : SwitchButton;
    ref : admin.database.Reference;
    callback : any;
    val : any;

    constructor(config : LightServiceConfig, db: admin.database.Database, key : string){
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
                    "user": "homePi-server",
                    "type" : 3,
                    "key" : this.config.key,
                    "status" : this.config.status,
                    "date" : new Date(),
                    "room" : this.config.room,
                });
            }
            else{
                if(val.working && val.user !== "homePi-server") {
                    this.work(val.status);
                }
            }

        };

        this.ref.on("value", this.callback);
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

        if(this.val.config && this.val.config.notification){
            new NotificationSender().sendNotification({
                title : this.config.name + " - " + this.config.room,
                icon : "",
                body : "Ahora la luz esta " + (query.status ? "encendida" : "apagada") + "."
            }, this.val.config.notification.filter((id) => this.val.user != id ));
        }


        this.ref.update(query);
    }

    public destroy(){
        this.ref.off('value', this.callback);
    }


}