/**
 * Created by Santiago M.A. on 12/04/2017.
 */

const firebase = require("firebase-admin");
const requireDir = require("require-dir");
const config = require(__dirname + "/config/config.json");

const modules = {
	"Actuator" : requireDir(__dirname + "/modules/actuator"),
	"Sensor" : requireDir(__dirname + "/modules/sensor"),
	"Service" : requireDir(__dirname + "/modules/service")
};

const serviceAccount = require(__dirname+config.firebase.configuration_file);

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: config.firebase.url
});
//firebase.database.enableLogging(true);
new modules.Service.Sensor("Temperatura", modules.Service.Sensor.types.HUMEDITY, new modules.Sensor.Rest("http://10.0.0.138/", {"ok" : "temperature"}), firebase.database());
