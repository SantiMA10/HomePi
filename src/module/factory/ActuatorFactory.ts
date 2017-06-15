import {RestSwitch} from "../actuator/impl/RestSwitch";
export enum ActuatorType{
    REST_SWITCH
}

export class ActuatorFactory{

    public static build(actuatorType : ActuatorType, config : any) : any{
        switch (actuatorType){
            case ActuatorType.REST_SWITCH:
                return new RestSwitch(config);
        }
    }

}