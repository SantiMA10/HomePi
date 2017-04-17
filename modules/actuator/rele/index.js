/**
 * Created by Santiago M.A. on 17/04/2017.
 */

const gpio = {};//require("rpi-gpio");

var rele = function (pin) {
	this.pin = pin;
	gpio.setup(pin, gpio.DIR_OUT, function () {
		gpio.write(pin, true);
	});
};

rele.prototype.blink = function () {
	this.on();
	setTimeout(this.off, 2000);
};

rele.prototype.on = function (callback) {
	gpio.write(this.pin, false, callback);
};

rele.prototype.off = function (callback) {
	gpio.write(this.pin, true, callback);
};

module.exports = rele;
