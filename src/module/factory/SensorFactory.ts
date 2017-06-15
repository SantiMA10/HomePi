import {RestSensor} from "../sensor/impl/RestSensor";
export enum SensorTypes{
    REST_SENSOR
}

export class SensorFactory{

    public static build(sensorType : SensorTypes, config : any) : any{
        switch (sensorType){
            case SensorTypes.REST_SENSOR:
                return new RestSensor(config);
        }
    }

}