/**
 * Created by Santiago M.A. on 17/04/2017.
 */

var Sensor = function (name, sensor, db) {
	if(!sensor || !sensor.get){
		throw new Error("Sensor must have a get method");
	}

	this.name = name;
	this.sensor = sensor;
	this.db = db.ref("service/"+this.name);

	var ctx = this;
	this.db.on("value", function (snapshot) {

		var val = snapshot.val();

		if(!val){
			ctx.db.update({
				"working" : false,
				"user" : "homePi"
			});
			return;
		}
		ctx.status = val.status;

		if(val.working && val.user !== "homePi"){

			ctx.sensor.get()
				.then(function (value) {
					ctx.db.update({
						"working" : false,
						"user" : "homePi",
						"status" : value,
						"date" : new Date()
					});
				})
				.catch(function (value) {
					ctx.db.update({
						"working" : false,
						"user" : "homePi",
						"status" : value,
						"date" : new Date()
					});
				});

		}

	});

};



module.exports = Sensor;
