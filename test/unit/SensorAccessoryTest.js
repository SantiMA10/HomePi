"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dotenv = require("dotenv");
var SensorService_1 = require("../../src/module/service/SensorService");
var ServiceFactory_1 = require("../../src/module/factory/ServiceFactory");
before(function (done) {
    dotenv.config();
    done();
});
var config = {
    "name": "test",
    "room": "test",
    "sensorConfig": {
        "param": {
            "error": "error",
            "ok": "temperature"
        },
        "url": "http://10.0.0.139"
    },
    "sensorServiceType": SensorService_1.SensorServiceType.TEMPERATURE,
    "sensorType": 1,
    "key": "test"
};
describe('SensorService', function () {
    describe('init', function () {
        it('temperature', function () {
            chai_1.expect(ServiceFactory_1.ServiceFactory.build(ServiceFactory_1.ServiceType.TEMPERATURE, config, null)).to.be.an.instanceof(SensorService_1.SensorService);
        });
        it('humidity', function () {
            chai_1.expect(ServiceFactory_1.ServiceFactory.build(ServiceFactory_1.ServiceType.TEMPERATURE, {
                "name": "test",
                "room": "test",
                "sensorConfig": {
                    "param": {
                        "error": "error",
                        "ok": "humidity"
                    },
                    "url": "http://10.0.0.139"
                },
                "sensorServiceType": SensorService_1.SensorServiceType.HUMIDITY,
                "sensorType": 1,
                "key": "test"
            }, null)).to.be.an.instanceof(SensorService_1.SensorService);
        });
    });
    describe('hasToWork', function () {
        var service = ServiceFactory_1.ServiceFactory.build(ServiceFactory_1.ServiceType.TEMPERATURE, config, null);
        it('working:true, user:pepe, status:false', function () {
            chai_1.expect(service.hasToWork({ "working": true, "user": "pepe", "status": 0 })).to.equal(true);
        });
        it('working:true, user:pepe, status:true', function () {
            chai_1.expect(service.hasToWork({ "working": true, "user": "pepe", "status": 0 })).to.equal(true);
        });
        it('working:true, user:Server, status:false', function () {
            chai_1.expect(service.hasToWork({ "working": true, "user": process.env.SERVER_USER, "status": 0 })).to.equal(false);
        });
        it('working:true, user:Server, status:true', function () {
            chai_1.expect(service.hasToWork({ "working": true, "user": process.env.SERVER_USER, "status": 0 })).to.equal(false);
        });
        it('working:false, user:pepe, status:false', function () {
            chai_1.expect(service.hasToWork({ "working": false, "user": "pepe", "status": 0 })).to.equal(false);
        });
        it('working:false, user:pepe, status:true', function () {
            chai_1.expect(service.hasToWork({ "working": false, "user": "pepe", "status": 0 })).to.equal(false);
        });
    });
    describe('work', function () {
        var service = ServiceFactory_1.ServiceFactory.build(ServiceFactory_1.ServiceType.TEMPERATURE, config, null);
        it('working:true, user:pepe, status:false', function () {
            service.work().catch(function (value) {
                chai_1.expect(value).to.be.throw();
            });
        });
    });
});
after(function (done) {
    done();
});
