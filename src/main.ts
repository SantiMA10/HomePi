import * as admin from "firebase-admin";
import * as config from "../config/config.json";
import {SensorService, SensorTypes} from "./module/service/SensorService";
import {RestSensor} from "./module/sensor/impl/RestSensor";

admin.initializeApp({
    "credential" : admin.credential.cert(__dirname + "/.." + (<any>config).firebase.configuration_file),
    "databaseURL" : (<any>config).firebase.url
});

let temp = new RestSensor("http://10.0.0.138/", {
    "ok": "temperature",
    "error": "error"
});
let hume = new RestSensor("http://10.0.0.138/", {
    "ok": "humidity",
    "error": "error"
});

new SensorService("Temperatura", "Habitación Hijo", temp, SensorTypes.TEMPERATURE, admin.database());
new SensorService("Humedad", "Habitación Hijo", hume, SensorTypes.HUMIDITY, admin.database());