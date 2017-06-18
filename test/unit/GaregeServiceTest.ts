import { expect } from 'chai';
import * as dotenv from "dotenv";
import {GarageService, GarageStatus} from "../../src/module/service/GarageService";
import {ServiceFactory, ServiceType} from "../../src/module/factory/ServiceFactory";

before((done) => {

    dotenv.config();
    done();

});

let config = {
    "name" : "test",
    "room" : "test",
    "status" : 1,
    "actuatorConfig" : {
    },
    "actuatorType" : 1,
    "key" : "test"
};


describe('GarageService', () => {
    it('init', () => {
        expect(ServiceFactory.build(ServiceType.GARAGE, config, null)).to.be.an.instanceof(GarageService);
    });

    describe('hasToWork', () => {

        let garageService = ServiceFactory.build(ServiceType.GARAGE, config, null);

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

    describe('work', () => {

        let garageService = ServiceFactory.build(ServiceType.GARAGE, config, null);

        it('working:true, user:pepe, status:OPEN', () => {
            garageService.work({"working" : true, "user" : "pepe", "status" : GarageStatus.OPEN, "config" : ""}).then((instance) => {
                expect(instance.update).to.include({ "status" : GarageStatus.CLOSSING});
                instance.promise.then((instance) => {
                    expect(instance).to.include({ "status" : GarageStatus.CLOSE});
                });
            });
        });

        it('working:true, user:pepe, status:OPEN', () => {
            garageService.work({"working" : true, "user" : "pepe", "status" : GarageStatus.CLOSE, "config" : ""}).then((instance) => {
                expect(instance.update).to.include({ "status" : GarageStatus.OPENNING});
                instance.promise.then((instance) => {
                    expect(instance).to.include({ "status" : GarageStatus.OPEN});
                });
            });
        });


    });

});

after((done) => {
    done();
});