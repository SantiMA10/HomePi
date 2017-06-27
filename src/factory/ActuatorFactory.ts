import {RestSwitch} from "../module/actuator/impl/RestSwitch";
import {MockSwitch} from "../module/actuator/impl/MockSwitch";
export enum ActuatorType{
    REST_SWITCH,
    MOCK_SWITCH
}

export class ActuatorFactory{

    public static build(actuatorType : ActuatorType, config : any) : any{
        switch (actuatorType){
            case ActuatorType.REST_SWITCH:
                return new RestSwitch(config);
            case ActuatorType.MOCK_SWITCH:
                return new MockSwitch(config);
        }
    }

}