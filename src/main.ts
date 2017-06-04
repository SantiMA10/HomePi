import * as admin from "firebase-admin";
import * as config from "../config/config.json";
import {SensorService, SensorTypes} from "./module/service/SensorService";
import {RestSensor} from "./module/sensor/impl/RestSensor";

admin.initializeApp({
    "credential" : admin.credential.cert(__dirname + "/.." + (<any>config).firebase.configuration_file),
    "databaseURL" : (<any>config).firebase.url
});

let rest = new RestSensor("http://10.0.0.138/", {
    "ok": "temperature",
    "error": "error"
});

new SensorService("Temperatura", rest, SensorTypes.TEMPERATURE, admin.database());