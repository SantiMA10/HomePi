import {RestSensor} from "../module/sensor/impl/RestSensor";
import {MockSensor} from "../module/sensor/impl/MockSensor";
export enum SensorTypes{
    REST_SENSOR,
    MOCK_SENSOR
}

export class SensorFactory{

    /**
     * Método para crear sensores
     * @param sensorType tipo del sensor
     * @param config configuracion del sensor
     * @returns {any} referencia al sensor creado
     */
    public static build(sensorType : SensorTypes, config : any) : any{
        switch (sensorType){
            case SensorTypes.REST_SENSOR:
                return new RestSensor(config);
            case SensorTypes.MOCK_SENSOR:
                return new MockSensor(config);
        }
    }

}