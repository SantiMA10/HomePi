import { expect } from 'chai';
import * as dotenv from "dotenv";
import {LightService} from "../../src/module/service/LightService";
import {SensorService, SensorServiceType} from "../../src/module/service/SensorService";

before((done) => {

    dotenv.config();
    done();

});

describe('SensorService', () => {
    describe('init', () => {

        it('temperature', () => {

            expect(new SensorService({
                "name" : "test",
                "room" : "test",
                "sensorConfig" : {
                    "param" : {
                        "error" : "error",
                        "ok" : "temperature"
                    },
                    "url" : "http://10.0.0.139"
                },
                "sensorServiceType" : SensorServiceType.TEMPERATURE,
                "sensorType" : 0,
                "key" : "test"
            }, null)).to.not.equal(null);

        });

        it('humidity', () => {

            expect(new SensorService({
                "name" : "test",
                "room" : "test",
                "sensorConfig" : {
                    "param" : {
                        "error" : "error",
                        "ok" : "humidity"
                    },
                    "url" : "http://10.0.0.139"
                },
                "sensorServiceType" : SensorServiceType.HUMIDITY,
                "sensorType" : 0,
                "key" : "test"
            }, null)).to.not.equal(null);

        });

    });

    describe('hasToWork', () => {

        let service = new SensorService({
            "name" : "test",
            "room" : "test",
            "sensorConfig" : {
                "param" : {
                    "error" : "error",
                    "ok" : "humidity"
                },
                "url" : "http://10.0.0.139"
            },
            "sensorServiceType" : SensorServiceType.HUMIDITY,
            "sensorType" : 0,
            "key" : "test"
        }, null);

        it('working:true, user:pepe, status:false', () => {
            expect(service.hasToWork({"working" : true, "user" : "pepe", "status" : 0})).to.equal(true);
        });

        it('working:true, user:pepe, status:true', () => {
            expect(service.hasToWork({"working" : true, "user" : "pepe", "status" : 0})).to.equal(true);
        });

        it('working:true, user:Server, status:false', () => {
            expect(service.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : 0})).to.equal(false);
        });

        it('working:true, user:Server, status:true', () => {
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

        let service = new SensorService({
            "name" : "test",
            "room" : "test",
            "sensorConfig" : {
                "param" : {
                    "error" : "error",
                    "ok" : "humidity"
                },
                "url" : "http://10.0.0.139"
            },
            "sensorServiceType" : SensorServiceType.HUMIDITY,
            "sensorType" : 0,
            "key" : "test"
        }, null);

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