import { SwitchButton } from "../switch";
import * as requestPromise from "request-promise";
import {Configuration} from "../../util/RestUtil";

interface RestSwitchConfig {
    on : string,
    off : string
}

export class RestSwitch implements SwitchButton{

    offOptions : Configuration;
    onOptions : Configuration;
    blinkTime : number;

    constructor(url : string, config : RestSwitchConfig, blinkTime : number){
        this.onOptions = {
            "url" : [url, config.on].join(""),
            "transform" :  (body) => {
                return JSON.parse(body);
            }
        };
        this.offOptions = {
            "url" : [url, config.off].join(""),
            "transform" :  (body) => {
                return JSON.parse(body);
            }
        };
        this.blinkTime = blinkTime;
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