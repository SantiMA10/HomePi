import { expect } from 'chai';
import * as dotenv from "dotenv";
import {LightAccessory} from "../../src/module/accesory/LightAccessory";
import {AccessoryFactory, AccessoryType} from "../../src/factory/AccessoryFactory";
import {ThermostatService} from "../../src/module/accesory/ThermostatAccessory";

before((done) => {

    dotenv.config();
    done();

});

let config = {
    "actuatorConfig" : {
    },
    "actuatorType" : 1,
    "name" : "test",
    "refresh" : 30,
    "refreshTime" : 3,
    "room" : "test",
    "sensors" : [ {
        "sensorConfig" : {
        },
        "sensorType" : 1
    }, {
        "sensorConfig" : {
        },
        "sensorType" : 1
    } ],
    "key" : "test",
    "status" : 21
};

describe('ThermostatService', () => {
    it('init', () => {
        expect(AccessoryFactory.build(AccessoryType.THERMOSTAT, config, null)).to.be.an.instanceof(ThermostatService);
    });

    describe('hasToWork', () => {

        let service = AccessoryFactory.build(AccessoryType.THERMOSTAT, config, null);

        it('working:true, user:pepe, status:false, timeOut: null', () => {
            expect(service.hasToWork({"working" : true, "user" : "pepe", "status" : false, "config" : ""}, null)).to.equal(true);
        });

        it('working:true, user:pepe, status:true, timeOut: null', () => {
            expect(service.hasToWork({"working" : true, "user" : "pepe", "status" : true, "config" : ""}, null)).to.equal(true);
        });

        it('working:true, user:pepe, status:false, timeOut: {}', () => {
            expect(service.hasToWork({"working" : true, "user" : "pepe", "status" : false, "config" : ""}, {})).to.equal(false);
        });

        it('working:true, user:pepe, status:true, timeOut: {}', () => {
            expect(service.hasToWork({"working" : true, "user" : "pepe", "status" : true, "config" : ""}, {})).to.equal(false);
        });

        it('working:true, user:Server, status:false', () => {
            expect(service.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : false, "config" : ""})).to.equal(false);
        });

        it('working:true, user:Server, status:true', () => {
            expect(service.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : true, "config" : ""})).to.equal(false);
        });

        it('working:false, user:pepe, status:false', () => {
            expect(service.hasToWork({"working" : false, "user" : "pepe", "status" : false, "config" : ""})).to.equal(false);
        });

        it('working:false, user:pepe, status:true', () => {
            expect(service.hasToWork({"working" : false, "user" : "pepe", "status" : true, "config" : ""})).to.equal(false);
        });

    });

    describe('hasToStopWork', () => {

        let service = AccessoryFactory.build(AccessoryType.THERMOSTAT, config, null);

        it('working:true, user:pepe, status:21, timeOut: null', () => {
            expect(service.hasToStopWork({"working" : true, "user" : "pepe", "status" : 21, "config" : ""}, null)).to.equal(false);
        });

        it('working:true, user:pepe, status:21, timeOut: {}', () => {
            expect(service.hasToStopWork({"working" : true, "user" : "pepe", "status" : 21, "config" : ""}, {})).to.equal(false);
        });

        //

        it('working:false, user:pepe, status:21, timeOut: null', () => {
            expect(service.hasToStopWork({"working" : false, "user" : "pepe", "status" : 21, "config" : ""}, null)).to.equal(false);
        });

        it('working:false, user:pepe, status:21, timeOut: {}', () => {
            expect(service.hasToStopWork({"working" : false, "user" : "pepe", "status" : 21, "config" : ""}, {})).to.equal(true);
        });

        // SERVER_USER

        it('working:true, user:SERVER_USER, status:21, timeOut: null', () => {
            expect(service.hasToStopWork({"working" : true, "user" : process.env.SERVER_USER, "status" : 21, "config" : ""}, null)).to.equal(false);
        });

        it('working:true, user:SERVER_USER, status:21, timeOut: {}', () => {
            expect(service.hasToStopWork({"working" : true, "user" : process.env.SERVER_USER, "status" : 21, "config" : ""}, {})).to.equal(false);
        });

        //

        it('working:false, user:SERVER_USER, status:21, timeOut: null', () => {
            expect(service.hasToStopWork({"working" : false, "user" : process.env.SERVER_USER, "status" : 21, "config" : ""}, null)).to.equal(false);
        });

        it('working:false, user:SERVER_USER, status:21, timeOut: {}', () => {
            expect(service.hasToStopWork({"working" : false, "user" : process.env.SERVER_USER, "status" : 21, "config" : ""}, {})).to.equal(false);
        });



    });


});

after((done) => {
    done();
});