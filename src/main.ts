import * as admin from "firebase-admin";
import * as config from "../config/config.json";
import {SensorService, SensorTypes} from "./module/service/SensorService";
import {GarageService, GarageStatus} from "./module/service/GarageService";
import {LightService} from "./module/service/LightService";
import {RestSensor} from "./module/sensor/impl/RestSensor";
import {RestSwitch} from "./module/actuator/impl/RestSwitch";

admin.initializeApp({
    "credential" : admin.credential.cert(__dirname + "/.." + (<any>config).firebase.configuration_file),
    "databaseURL" : (<any>config).firebase.url
});

let temp = new RestSensor("http://10.0.0.139/", {
    "ok": "temperature",
    "error": "error"
});
let hume = new RestSensor("http://10.0.0.139/", {
    "ok": "humidity",
    "error": "error"
});

let rele = new RestSwitch("http://10.0.0.94/", {
    "on": "on",
    "off": "off"
}, 3000);

new SensorService("Temperatura", "Mi habitación", temp, SensorTypes.TEMPERATURE, admin.database());
new SensorService("Humedad", "Mi habitación", hume, SensorTypes.HUMIDITY, admin.database());
new GarageService("Garaje", "Garaje", rele, GarageStatus.CLOSE, admin.database());
new LightService("Luz techo", "Mi habitación", rele, false, admin.database());
