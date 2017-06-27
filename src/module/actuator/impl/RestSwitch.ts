import { SwitchButton } from "../switch";
import * as requestPromise from "request-promise";
import {Configuration} from "../../../util/RestUtil";

interface RestSwitchConfig {
    url : string,
    blinkTime : number,
    paths : {
        on : string,
        off : string
    }
}

export class RestSwitch implements SwitchButton{

    offOptions : Configuration;
    onOptions : Configuration;
    blinkTime : number;

    constructor(config : RestSwitchConfig){
        this.onOptions = {
            "url" : [config.url, config.paths.on].join(""),
            "transform" :  (body) => {
                return JSON.parse(body);
            }
        };
        this.offOptions = {
            "url" : [config.url, config.paths.off].join(""),
            "transform" :  (body) => {
                return JSON.parse(body);
            }
        };
        this.blinkTime = config.blinkTime;
    }

    blink(): any {
        this.on();
        setTimeout(() => { this.off() }, this.blinkTime);
    }

    on(): any {
        return requestPromise(this.onOptions)
            .then(() => { })
            .error(() => { });
    }

    off(): any {
        return requestPromise(this.offOptions)
            .then(() => { })
            .error(() => { });
    }

}