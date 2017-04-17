/**
 * Created by Santiago M.A. on 17/04/2017.
 */

const rp = require("request-promise");

var rest = function (url, param) {
	this.url = url;
	this.param = param;
};

rest.prototype.get = function () {

	const ctx = this;
	const options = {
		"uri" : ctx.url,
		"transform" : function (body) {
			return JSON.parse(body);
		}
	};


	return rp(options)
		.then(function (body) {
			const value = 24.5;//body.response[ctx.param.ok];
			return value;
		})
		.catch(function (body) {
			const value =  24.5; // body.response[ctx.param.error];
			return value;
		});
};

module.exports = rest;