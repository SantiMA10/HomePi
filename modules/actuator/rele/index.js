/**
 * Created by Santiago M.A. on 17/04/2017.
 */

const rpio = require("rpio");

var rele = function (pin) {
	this.pin = pin;
	rpio.open(12, rpio.OUTPUT, rpio.LOW);
};

rele.prototype.blink = function () {
	this.on();
	setTimeout(this.off, 2000);
};

rele.prototype.on = function () {
	rpio.write(12, rpio.HIGH);
};

rele.prototype.off = function () {
	rpio.write(12, rpio.LOW);
};

module.exports = rele;
