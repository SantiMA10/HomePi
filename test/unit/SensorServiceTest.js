"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dotenv = require("dotenv");
var SensorService_1 = require("../../src/module/service/SensorService");
before(function (done) {
    dotenv.config();
    done();
});
describe('SensorService', function () {
    describe('init', function () {
        it('temperature', function () {
            chai_1.expect(new SensorService_1.SensorService({
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
                "sensorType": 0,
                "key": "test"
            }, null)).to.not.equal(null);
        });
        it('humidity', function () {
            chai_1.expect(new SensorService_1.SensorService({
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
                "sensorType": 0,
                "key": "test"
            }, null)).to.not.equal(null);
        });
    });
    describe('hasToWork', function () {
        var service = new SensorService_1.SensorService({
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
            "sensorType": 0,
            "key": "test"
        }, null);
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
        var service = new SensorService_1.SensorService({
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
            "sensorType": 0,
            "key": "test"
        }, null);
        it('working:true, user:pepe, status:false', function () {
            service.readSensor().catch(function (value) {
                chai_1.expect(value).to.be.throw();
            });
        });
    });
});
after(function (done) {
    done();
});
