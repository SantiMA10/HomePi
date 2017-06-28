"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dotenv = require("dotenv");
var GarageService_1 = require("../../src/module/service/GarageService");
var ServiceFactory_1 = require("../../src/module/factory/ServiceFactory");
before(function (done) {
    dotenv.config();
    done();
});
var config = {
    "name": "test",
    "room": "test",
    "status": 1,
    "actuatorConfig": {},
    "actuatorType": 1,
    "key": "test"
};
describe('GarageService', function () {
    it('init', function () {
        chai_1.expect(ServiceFactory_1.ServiceFactory.build(ServiceFactory_1.ServiceType.GARAGE, config, null)).to.be.an.instanceof(GarageService_1.GarageService);
    });
    describe('hasToWork', function () {
        var garageService = ServiceFactory_1.ServiceFactory.build(ServiceFactory_1.ServiceType.GARAGE, config, null);
        it('working:true, user:pepe, status:OPENNING', function () {
            chai_1.expect(garageService.hasToWork({ "working": true, "user": "pepe", "status": GarageService_1.GarageStatus.OPENNING, "config": "" })).to.equal(false);
        });
        it('working:true, user:pepe, status:CLOSSING', function () {
            chai_1.expect(garageService.hasToWork({ "working": true, "user": "pepe", "status": GarageService_1.GarageStatus.CLOSSING, "config": "" })).to.equal(false);
        });
        it('working:true, user:pepe, status:OPEN', function () {
            chai_1.expect(garageService.hasToWork({ "working": true, "user": "pepe", "status": GarageService_1.GarageStatus.OPEN, "config": "" })).to.equal(true);
        });
        it('working:true, user:pepe, status:CLOSE', function () {
            chai_1.expect(garageService.hasToWork({ "working": true, "user": "pepe", "status": GarageService_1.GarageStatus.CLOSE, "config": "" })).to.equal(true);
        });
        it('working:true, user:Server, status:OPENNING', function () {
            chai_1.expect(garageService.hasToWork({ "working": true, "user": process.env.SERVER_USER, "status": GarageService_1.GarageStatus.OPENNING, "config": "" })).to.equal(false);
        });
        it('working:true, user:Server, status:CLOSSING', function () {
            chai_1.expect(garageService.hasToWork({ "working": true, "user": process.env.SERVER_USER, "status": GarageService_1.GarageStatus.CLOSSING, "config": "" })).to.equal(false);
        });
        it('working:true, user:Server, status:OPEN', function () {
            chai_1.expect(garageService.hasToWork({ "working": true, "user": process.env.SERVER_USER, "status": GarageService_1.GarageStatus.OPEN, "config": "" })).to.equal(false);
        });
        it('working:true, user:Server, status:CLOSE', function () {
            chai_1.expect(garageService.hasToWork({ "working": true, "user": process.env.SERVER_USER, "status": GarageService_1.GarageStatus.CLOSE, "config": "" })).to.equal(false);
        });
        it('working:false, user:pepe, status:OPENNING', function () {
            chai_1.expect(garageService.hasToWork({ "working": false, "user": "pepe", "status": GarageService_1.GarageStatus.OPENNING, "config": "" })).to.equal(false);
        });
        it('working:false, user:pepe, status:CLOSSING', function () {
            chai_1.expect(garageService.hasToWork({ "working": false, "user": "pepe", "status": GarageService_1.GarageStatus.CLOSSING, "config": "" })).to.equal(false);
        });
        it('working:false, user:pepe, status:OPEN', function () {
            chai_1.expect(garageService.hasToWork({ "working": false, "user": "pepe", "status": GarageService_1.GarageStatus.OPEN, "config": "" })).to.equal(false);
        });
        it('working:false, user:pepe, status:CLOSE', function () {
            chai_1.expect(garageService.hasToWork({ "working": false, "user": "pepe", "status": GarageService_1.GarageStatus.CLOSE, "config": "" })).to.equal(false);
        });
    });
    describe('work', function () {
        var garageService = ServiceFactory_1.ServiceFactory.build(ServiceFactory_1.ServiceType.GARAGE, config, null);
        it('working:true, user:pepe, status:OPEN', function () {
            garageService.work({ "working": true, "user": "pepe", "status": GarageService_1.GarageStatus.OPEN, "config": "" }).then(function (instance) {
                chai_1.expect(instance.update).to.include({ "status": GarageService_1.GarageStatus.CLOSSING });
                instance.promise.then(function (instance) {
                    chai_1.expect(instance).to.include({ "status": GarageService_1.GarageStatus.CLOSE });
                });
            });
        });
        it('working:true, user:pepe, status:OPEN', function () {
            garageService.work({ "working": true, "user": "pepe", "status": GarageService_1.GarageStatus.CLOSE, "config": "" }).then(function (instance) {
                chai_1.expect(instance.update).to.include({ "status": GarageService_1.GarageStatus.OPENNING });
                instance.promise.then(function (instance) {
                    chai_1.expect(instance).to.include({ "status": GarageService_1.GarageStatus.OPEN });
                });
            });
        });
    });
});
after(function (done) {
    done();
});
