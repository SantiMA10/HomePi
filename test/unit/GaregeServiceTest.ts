import { expect } from 'chai';
import * as dotenv from "dotenv";
import {GarageService, GarageStatus} from "../../src/module/service/GarageService";

before((done) => {

    dotenv.config();
    done();

});


describe('GarageService', () => {
    it('init', () => {
        expect(new GarageService({
            "name" : "Garaje",
            "room" : "Garaje",
            "status" : 1,
            "actuatorConfig" : {
                "blinkTime" : 1000,
                "paths" : {
                    "on" : "on",
                    "off" : "off"
                },
                "url" : "http://10.0.0.139"
            },
            "actuatorType" : 0,
            "key" : "test"
        }, null)).to.not.equal(null);
    });

    describe('hasToWork', () => {

        let garageService = new GarageService({
            "name" : "Garaje",
            "room" : "Garaje",
            "status" : 1,
            "actuatorConfig" : {
                "blinkTime" : 1000,
                "paths" : {
                    "on" : "on",
                    "off" : "off"
                },
                "url" : "http://10.0.0.139"
            },
            "actuatorType" : 0,
            "key" : "test"
        }, null);

        it('working:true, user:pepe, status:OPENNING', () => {
            expect(garageService.hasToWork({"working" : true, "user" : "pepe", "status" : GarageStatus.OPENNING, "config" : ""})).to.equal(false);
        });

        it('working:true, user:pepe, status:CLOSSING', () => {
            expect(garageService.hasToWork({"working" : true, "user" : "pepe", "status" : GarageStatus.CLOSSING, "config" : ""})).to.equal(false);
        });

        it('working:true, user:pepe, status:OPEN', () => {
            expect(garageService.hasToWork({"working" : true, "user" : "pepe", "status" : GarageStatus.OPEN, "config" : ""})).to.equal(true);
        });

        it('working:true, user:pepe, status:CLOSE', () => {
            expect(garageService.hasToWork({"working" : true, "user" : "pepe", "status" : GarageStatus.CLOSE, "config" : ""})).to.equal(true);
        });

        it('working:true, user:Server, status:OPENNING', () => {
            expect(garageService.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : GarageStatus.OPENNING, "config" : ""})).to.equal(false);
        });

        it('working:true, user:Server, status:CLOSSING', () => {
            expect(garageService.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : GarageStatus.CLOSSING, "config" : ""})).to.equal(false);
        });

        it('working:true, user:Server, status:OPEN', () => {
            expect(garageService.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : GarageStatus.OPEN, "config" : ""})).to.equal(false);
        });

        it('working:true, user:Server, status:CLOSE', () => {
            expect(garageService.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : GarageStatus.CLOSE, "config" : ""})).to.equal(false);
        });

        it('working:false, user:pepe, status:OPENNING', () => {
            expect(garageService.hasToWork({"working" : false, "user" : "pepe", "status" : GarageStatus.OPENNING, "config" : ""})).to.equal(false);
        });

        it('working:false, user:pepe, status:CLOSSING', () => {
            expect(garageService.hasToWork({"working" : false, "user" : "pepe", "status" : GarageStatus.CLOSSING, "config" : ""})).to.equal(false);
        });

        it('working:false, user:pepe, status:OPEN', () => {
            expect(garageService.hasToWork({"working" : false, "user" : "pepe", "status" : GarageStatus.OPEN, "config" : ""})).to.equal(false);
        });

        it('working:false, user:pepe, status:CLOSE', () => {
            expect(garageService.hasToWork({"working" : false, "user" : "pepe", "status" : GarageStatus.CLOSE, "config" : ""})).to.equal(false);
        });

    });

});

after((done) => {
    done();
});