"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dotenv = require("dotenv");
var LightService_1 = require("../../src/module/service/LightService");
var ServiceFactory_1 = require("../../src/module/factory/ServiceFactory");
before(function (done) {
    dotenv.config();
    done();
});
var config = {
    "name": "test",
    "room": "test",
    "status": true,
    "actuatorConfig": {
        "blinkTime": 1000,
        "paths": {
            "on": "on",
            "off": "off"
        },
        "url": "http://10.0.0.139"
    },
    "actuatorType": 1,
    "key": "test"
};
describe('LightService', function () {
    it('init', function () {
        chai_1.expect(ServiceFactory_1.ServiceFactory.build(ServiceFactory_1.ServiceType.LIGHT, config, null)).to.be.an.instanceof(LightService_1.LightService);
    });
    describe('hasToWork', function () {
        var service = ServiceFactory_1.ServiceFactory.build(ServiceFactory_1.ServiceType.LIGHT, config, null);
        it('working:true, user:pepe, status:false', function () {
            chai_1.expect(service.hasToWork({ "working": true, "user": "pepe", "status": false, "config": "" })).to.equal(true);
        });
        it('working:true, user:pepe, status:true', function () {
            chai_1.expect(service.hasToWork({ "working": true, "user": "pepe", "status": true, "config": "" })).to.equal(true);
        });
        it('working:true, user:Server, status:false', function () {
            chai_1.expect(service.hasToWork({ "working": true, "user": process.env.SERVER_USER, "status": false, "config": "" })).to.equal(false);
        });
        it('working:true, user:Server, status:true', function () {
            chai_1.expect(service.hasToWork({ "working": true, "user": process.env.SERVER_USER, "status": true, "config": "" })).to.equal(false);
        });
        it('working:false, user:pepe, status:false', function () {
            chai_1.expect(service.hasToWork({ "working": false, "user": "pepe", "status": false, "config": "" })).to.equal(false);
        });
        it('working:false, user:pepe, status:true', function () {
            chai_1.expect(service.hasToWork({ "working": false, "user": "pepe", "status": true, "config": "" })).to.equal(false);
        });
    });
    describe('work', function () {
        var service = ServiceFactory_1.ServiceFactory.build(ServiceFactory_1.ServiceType.LIGHT, config, null);
        it('working:true, user:pepe, status:false', function () {
            chai_1.expect(service.work({ "working": true, "user": "pepe", "status": false, "config": "" })).to.deep.include({ "working": false, "user": process.env.SERVER_USER, "status": true });
        });
        it('working:true, user:pepe, status:true', function () {
            chai_1.expect(service.work({ "working": true, "user": "pepe", "status": true, "config": "" })).to.deep.include({ "working": false, "user": process.env.SERVER_USER, "status": false });
        });
    });
});
after(function (done) {
    done();
});
