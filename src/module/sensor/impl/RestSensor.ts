import { ReadData } from "../read"
import * as requestPromise from "request-promise";
import {RequestPromiseOptions} from "request-promise";
import {UrlOptions} from "request";

interface OptionsRestSensor{
    ok : string,
    error : string
}

interface Configuration extends UrlOptions, RequestPromiseOptions{

}

export class RestSensor implements ReadData{

    param : OptionsRestSensor;
    options : Configuration;

    constructor(url : string, param : OptionsRestSensor){
        this.options = {
            "url" : url,
            "transform" :  (body) => {
                return JSON.parse(body);
            }
        };
        this.param = param;
    }

    get() : any {
        let ctx = this;
        return requestPromise(ctx.options)
            .then(body => { return body[ctx.param.ok]; })
            .error(body => { return body[ctx.param.error]; });
    }

}