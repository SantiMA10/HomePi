/**
 * Created by Santiago M.A. on 17/04/2017.
 */

var GarageDoor = function (name, actuator, db) {
	if(!actuator || !actuator.blink){
		throw new Error("Actuator must have a blink method");
	}

	this.name = name;
	this.actuator = actuator;
	this.db = db.ref("service/"+this.name);

	var ctx = this;
	this.db.on("value", function (snapshot) {

		var val = snapshot.val();

		if(!val){
			return;
		}
		ctx.status = val.status;

		if(val.working && val.user !== "homePi"){

			var currentStatus, wantedStatus;
			if(val.status === GarageDoor.status.OPEN || val.status === GarageDoor.status.CLOSING){
				currentStatus = GarageDoor.status.CLOSING;
				wantedStatus = GarageDoor.status.CLOSE;
			}
			else if(val.status === GarageDoor.status.CLOSE || val.status === GarageDoor.status.OPENING){
				currentStatus = GarageDoor.status.OPENING;
				wantedStatus = GarageDoor.status.OPEN;
			}

			ctx.actuator.blink();

			ctx.db.update({
				"user" : "homePi",
				"status" : currentStatus
			});

			setTimeout(function () {
				ctx.db.update({

					"working" : false,
					"status" : wantedStatus
				});
			}, 20000);

		}

	});

};

GarageDoor.status ={
	"OPEN" : 0,
	"CLOSE" : 1,
	"OPENING" : 2,
	"CLOSING" : 3
};

module.exports = GarageDoor;
