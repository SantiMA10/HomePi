import { expect } from 'chai';
import * as dotenv from "dotenv";
import {LightService} from "../../src/module/service/LightService";
import {ServiceFactory, ServiceType} from "../../src/module/factory/ServiceFactory";

before((done) => {

    dotenv.config();
    done();

});

let config = {
    "name" : "test",
    "room" : "test",
    "status" : true,
    "actuatorConfig" : {
        "blinkTime" : 1000,
        "paths" : {
            "on" : "on",
            "off" : "off"
        },
        "url" : "http://10.0.0.139"
    },
    "actuatorType" : 1,
    "key" : "test"
};

describe('LightService', () => {
    it('init', () => {
        expect(ServiceFactory.build(ServiceType.LIGHT, config, null)).to.be.an.instanceof(LightService);
    });

    describe('hasToWork', () => {

        let service = ServiceFactory.build(ServiceType.LIGHT, config, null);

        it('working:true, user:pepe, status:false', () => {
            expect(service.hasToWork({"working" : true, "user" : "pepe", "status" : false, "config" : ""})).to.equal(true);
        });

        it('working:true, user:pepe, status:true', () => {
            expect(service.hasToWork({"working" : true, "user" : "pepe", "status" : true, "config" : ""})).to.equal(true);
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

    describe('work', () => {

        let service = ServiceFactory.build(ServiceType.LIGHT, config, null);

        it('working:true, user:pepe, status:false', () => {
            expect(service.work({"working" : true, "user" : "pepe", "status" : false, "config" : ""})).to.deep.include({"working" : false, "user" : process.env.SERVER_USER, "status" : true});
        });

        it('working:true, user:pepe, status:true', () => {
            expect(service.work({"working" : true, "user" : "pepe", "status" : true, "config" : ""})).to.deep.include({"working" : false, "user" : process.env.SERVER_USER, "status" : false});
        });

    });

});

after((done) => {
    done();
});