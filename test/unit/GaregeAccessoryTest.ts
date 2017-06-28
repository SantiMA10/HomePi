import { expect } from 'chai';
import * as dotenv from "dotenv";
import {GarageAccessory, GarageStatus} from "../../src/module/accesory/impl/GarageAccesory";
import {AccessoryFactory, AccessoryType} from "../../src/factory/AccessoryFactory";

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


describe('GarageAccessory', () => {
    it('init', () => {
        expect(AccessoryFactory.build(AccessoryType.GARAGE, config, null)).to.be.an.instanceof(GarageAccessory);
    });

    describe('hasToWork', () => {

        let garageService = AccessoryFactory.build(AccessoryType.GARAGE, config, null);

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

        it('working:true, user:SERVER_USER, status:OPENNING', () => {
            expect(garageService.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : GarageStatus.OPENNING, "config" : ""})).to.equal(false);
        });

        it('working:true, user:SERVER_USER, status:CLOSSING', () => {
            expect(garageService.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : GarageStatus.CLOSSING, "config" : ""})).to.equal(false);
        });

        it('working:true, user:SERVER_USER, status:OPEN', () => {
            expect(garageService.hasToWork({"working" : true, "user" : process.env.SERVER_USER, "status" : GarageStatus.OPEN, "config" : ""})).to.equal(false);
        });

        it('working:true, user:SERVER_USER, status:CLOSE', () => {
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

        let garageService = AccessoryFactory.build(AccessoryType.GARAGE, config, null);

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