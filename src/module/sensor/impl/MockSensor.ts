import { ReadData } from "../read"
import * as requestPromise from "request-promise";
import {Configuration, RestOptions} from "../../util/RestUtil";
import Bluebird = require("bluebird");

export interface MockSensorConfig{
}

export class MockSensor implements ReadData{


    constructor(config : MockSensorConfig){
    }

    get() : any {
        return new Bluebird(() => "");
    }

}