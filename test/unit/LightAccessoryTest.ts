import { expect } from 'chai';
import * as dotenv from "dotenv";
import {LightAccessory} from "../../src/module/accesory/LightAccessory";
import {AccessoryFactory, AccessoryType} from "../../src/factory/AccessoryFactory";

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

describe('LightAccessory', () => {
    it('init', () => {
        expect(AccessoryFactory.build(AccessoryType.LIGHT, config, null)).to.be.an.instanceof(LightAccessory);
    });

    describe('hasToWork', () => {

        let service = AccessoryFactory.build(AccessoryType.LIGHT, config, null);

        it('working:true, user:pepe, status:false', () => {
            expect(service.hasToWork({"working" : true, "user" : "pepe", "status" : false, "config" : ""})).to.equal(true);
        });

        it('working:true, user:pepe, status:true', () => {
            expect(service.hasToWork({"working" : true, "user" : "pepe", "status" : true, "config" : ""})).to.equal(true);
        });

        it('working:true, user:SERVER_USER, status:false', () => {
            expect(service.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : false, "config" : ""})).to.equal(false);
        });

        it('working:true, user:SERVER_USER, status:true', () => {
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

        let service = AccessoryFactory.build(AccessoryType.LIGHT, config, null);

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