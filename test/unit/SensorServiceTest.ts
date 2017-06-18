import { expect } from 'chai';
import * as dotenv from "dotenv";
import {LightService} from "../../src/module/service/LightService";
import {SensorService, SensorServiceType} from "../../src/module/service/SensorService";
import {ServiceFactory, ServiceType} from "../../src/module/factory/ServiceFactory";

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
    "sensorServiceType" : SensorServiceType.TEMPERATURE,
    "sensorType" : 1,
    "key" : "test"
};

describe('SensorService', () => {
    describe('init', () => {

        it('temperature', () => {

            expect(ServiceFactory.build(ServiceType.TEMPERATURE, config, null)).to.be.an.instanceof(SensorService);

        });

        it('humidity', () => {

            expect(ServiceFactory.build(ServiceType.TEMPERATURE, {
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
                "sensorType" : 1,
                "key" : "test"
            }, null)).to.be.an.instanceof(SensorService);

        });

    });

    describe('hasToWork', () => {

        let service = ServiceFactory.build(ServiceType.TEMPERATURE, config, null);

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

        let service = ServiceFactory.build(ServiceType.TEMPERATURE, config, null);

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