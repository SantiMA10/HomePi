import { ReadData } from "../read"
import * as requestPromise from "request-promise";
import {Configuration, RestOptions} from "../../util/RestUtil";

export class RestSensor implements ReadData{

    param : RestOptions;
    options : Configuration;

    constructor(url : string, param : RestOptions){
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