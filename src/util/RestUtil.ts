import {RequestPromiseOptions} from "request-promise";
import {UrlOptions} from "request";

export interface RestOptions{
    ok : string,
    error : string
}

export interface Configuration extends UrlOptions, RequestPromiseOptions{

}