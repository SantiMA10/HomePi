import * as admin from "firebase-admin";
import {ServiceFactory} from "./module/factory/ServiceFactory";
import * as dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
    "credential" : admin.credential.cert(__dirname + "/.." + process.env.CONFIGURATION_FILE),
    "databaseURL" : process.env.DATABASE_URL
});

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
        createdServices.push(ServiceFactory.build(service.type, service.config, admin.database()));
    });

});
