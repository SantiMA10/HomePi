import * as admin from "firebase-admin";
import {AccessoryFactory} from "./factory/AccessoryFactory";
import * as dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
    "credential" : admin.credential.cert(__dirname + "/.." + process.env.CONFIGURATION_FILE),
    "databaseURL" : process.env.DATABASE_URL
});

/**
 * Variable que contiene una referencia a todos los accesorios creados
 */
let createdServices = [];

admin.database().ref("/services").on('value', (snap) => {

    createdServices.forEach((service) => {
        if(service != null){
            service.destroy();
        }
    });

    createdServices = [];
    let services = snap.val();
    Object.keys(services).forEach((key) => {
        let service = services[key];
        service.config["key"] = key;
        createdServices.push(AccessoryFactory.build(service.type, service.config, admin.database()));
    });

});
