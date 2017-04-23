/**
 * Created by Santiago M.A. on 17/04/2017.
 */

var Sensor = function (name, type, sensor, db) {
	if(!sensor || !sensor.get){
		throw new Error("Sensor must have a get method");
	}

	this.name = name;
	this.sensor = sensor;
	this.type = type;
	this.db = db.ref("service/"+this.name);

	var ctx = this;
	ctx.value = 0;
	this.db.on("value", function (snapshot) {

		var val = snapshot.val();

		if(!val){
			ctx.db.update({
				"working" : false,
				"user" : "homePi",
				"type" : ctx.type
			});
			return;
		}
		ctx.status = val.status;

		if(val.working && val.user !== "homePi"){

			readSensor(ctx);

		}

	});
	
	this.homebridge = function (Service, Characteristic, Accessory) {

		return Accessory
			.addService(getHomeKitServiceByType(), ctx.name)
			.getCharacteristic(getHomeKitCharacteristicByType())
			.on("get", function (callback) {

				readSensor(ctx).then(function (value) {
					callback(null, value);
				});

			});
		
	};

};

Sensor.types = {
	"TEMPERATURE" : 1,
	"HUMEDITY" : 2
};

const readSensor = function(ctx) {

	return ctx.sensor.get()
		.then(function (value) {
			ctx.db.update({
				"working" : false,
				"user" : "homePi",
				"status" : value,
				"date" : new Date()
			});
			return value;
		})
		.catch(function (value) {
			ctx.db.update({
				"working" : false,
				"user" : "homePi",
				"status" : "error " + value,
				"date" : new Date()
			});
			return value;
		});

};

const getHomeKitServiceByType = function (ctx, Service) {
	switch (ctx.type){
		case Sensor.types.TEMPERATURE:
			return Service.TemperatureSensor;
		case Sensor.types.HUMEDITY:
			return Service.HumiditySensor;
	}
};

const getHomeKitCharacteristicByType = function (ctx, Characteristic) {
	switch (ctx.type){
		case Sensor.types.TEMPERATURE:
			return Characteristic.CurrentTemperature;
		case Sensor.types.HUMEDITY:
			return Characteristic.CurrentRelativeHumidity;
	}
};

module.exports = Sensor;
