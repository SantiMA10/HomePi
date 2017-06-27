import { expect } from 'chai';
import * as dotenv from "dotenv";
import {LightAccessory} from "../../src/module/accesory/LightAccessory";
import {SensorService, SensorAccessoryType} from "../../src/module/accesory/SensorAccessory";
import {AccessoryFactory, AccessoryType} from "../../src/factory/AccessoryFactory";

before((done) => {

    dotenv.config();
    done();

});

let config = {
    "name" : "test",
    "room" : "test",
    "sensorConfig" : {
        "param" : {
            "error" : "error",
            "ok" : "temperature"
        },
        "url" : "http://10.0.0.139"
    },
    "sensorServiceType" : SensorAccessoryType.TEMPERATURE,
    "sensorType" : 1,
    "key" : "test"
};

describe('SensorService', () => {
    describe('init', () => {

        it('temperature', () => {

            expect(AccessoryFactory.build(AccessoryType.TEMPERATURE, config, null)).to.be.an.instanceof(SensorService);

        });

        it('humidity', () => {

            expect(AccessoryFactory.build(AccessoryType.TEMPERATURE, {
                "name" : "test",
                "room" : "test",
                "sensorConfig" : {
                    "param" : {
                        "error" : "error",
                        "ok" : "humidity"
                    },
                    "url" : "http://10.0.0.139"
                },
                "sensorServiceType" : SensorAccessoryType.HUMIDITY,
                "sensorType" : 1,
                "key" : "test"
            }, null)).to.be.an.instanceof(SensorService);

        });

    });

    describe('hasToWork', () => {

        let service = AccessoryFactory.build(AccessoryType.TEMPERATURE, config, null);

        it('working:true, user:pepe, status:false', () => {
            expect(service.hasToWork({"working" : true, "user" : "pepe", "status" : 0})).to.equal(true);
        });

        it('working:true, user:pepe, status:true', () => {
            expect(service.hasToWork({"working" : true, "user" : "pepe", "status" : 0})).to.equal(true);
        });

        it('working:true, user:SERVER_USER, status:false', () => {
            expect(service.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : 0})).to.equal(false);
        });

        it('working:true, user:SERVER_USER, status:true', () => {
            expect(service.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : 0})).to.equal(false);
        });

        it('working:false, user:pepe, status:false', () => {
            expect(service.hasToWork({"working" : false, "user" : "pepe", "status" : 0})).to.equal(false);
        });

        it('working:false, user:pepe, status:true', () => {
            expect(service.hasToWork({"working" : false, "user" : "pepe", "status" : 0})).to.equal(false);
        });

    });

    describe('work', () => {

        let service = AccessoryFactory.build(AccessoryType.TEMPERATURE, config, null);

        it('working:true, user:pepe, status:false', () => {
            service.readSensor().catch((value) => {
                expect(value).to.be.throw();
            });
        });

    });

});

after((done) => {
    done();
});