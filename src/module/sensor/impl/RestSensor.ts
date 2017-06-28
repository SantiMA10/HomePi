import { ReadData } from "../read"
import * as requestPromise from "request-promise";
import {Configuration, RestOptions} from "../../../util/RestUtil";

export interface RestSensorConfig{
    param : RestOptions,
    url : string
}

export class RestSensor implements ReadData{

    param : RestOptions;
    options : Configuration;

    constructor(config : RestSensorConfig){
        this.options = {
            "url" : config.url,
            "transform" :  (body) => {
                return JSON.parse(body);
            }
        };
        this.param = config.param;
    }

    get() : any {
        let ctx = this;
        return requestPromise(ctx.options)
            .then(body => { return body[ctx.param.ok]; })
            .error(body => { return body[ctx.param.error]; });
    }

}