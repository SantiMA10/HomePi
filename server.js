/**
 * Created by Santiago M.A. on 12/04/2017.
 */

const firebase = require("firebase-admin");
const config= require(__dirname + "/config/config.json");

const serviceAccount = require(__dirname+config.firebase.configuration_file);

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: config.firebase.url
});

var ref = firebase.database().ref("/");
ref.update({"hello" : "world"});

