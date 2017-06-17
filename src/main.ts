import * as admin from "firebase-admin";
import * as config from "../config/config.json";
import {ServiceFactory} from "./module/factory/ServiceFactory";

admin.initializeApp({
    "credential" : admin.credential.cert(__dirname + "/.." + (<any>config).firebase.configuration_file),
    "databaseURL" : (<any>config).firebase.url
});

let createdServices = [];

admin.database().ref("/services").on('value', (snap) => {

    createdServices.forEach((service) => {
        service.destroy();
    });

    createdServices = [];
    let services = snap.val();
    Object.keys(services).forEach((key) => {
        let service = services[key];
        service.config["key"] = key;
        createdServices.push(ServiceFactory.build(service.type, service.config, admin.database()));
    });
});
