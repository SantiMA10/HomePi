/**
 * Created by Santiago M.A. on 17/04/2017.
 */

const rp = require("request-promise");

var rest = function (name ,url, param, database) {
	this.name = name;
	this.url = url;
	this.param = param;
	this.database = database;
};

rest.prototype.get = function () {

	const ctx = this;
	const options = {
		"uri" : ctx.url,
		"transform" : function (body) {
			return JSON.parse(body);
		}
	};

	var ref = ctx.database.ref("sensor/" + ctx.name);

	return rp(options)
		.then(function (body) {
			ref.update({
				"status" : "ok",
				"value" : body.response[ctx.param.ok]
			});
		})
		.catch(function (body) {
			ref.update({
				"status" : "error",
				"value" : body.response[ctx.param.error]
			});
		});
};

module.exports = rest;