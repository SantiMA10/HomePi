import { SwitchButton } from "../switch";
import * as requestPromise from "request-promise";
import {Configuration} from "../../../util/RestUtil";
import Bluebird = require("bluebird");

interface MockSwitchConfig {

}

export class MockSwitch implements SwitchButton{

    constructor(config : MockSwitch){

    }

    blink(): any {
    }

    on(): any {
        return new Bluebird(() => "");
    }

    off(): any {
        return new Bluebird(() => "");
    }

}