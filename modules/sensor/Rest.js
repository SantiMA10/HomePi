/**
 * Created by Santiago M.A. on 17/04/2017.
 */

const rp = require("request-promise");

var Rest = function (url, param) {
	this.url = url;
	this.param = param;
};

Rest.prototype.get = function () {

	const ctx = this;
	const options = {
		"uri" : ctx.url,
		"transform" : function (body) {
			return JSON.parse(body);
		}
	};


	return rp(options)
		.then(function (body) {
			const value = body[ctx.param.ok];
			return value;
		})
		.catch(function (body) {
			const value = body[ctx.param.error];
			return value;
		});
};

module.exports = Rest;