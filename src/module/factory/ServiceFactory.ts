
import {GarageService} from "../service/GarageService";
import {SensorService} from "../service/SensorService";
import {ThermostatService} from "../service/ThermostatService";
import {LightService} from "../service/LightService";

export enum ServiceType{
    GARAGE,
    TEMPERATURE,
    HUMIDITY,
    LIGHT,
    THERMOSTAT
}

export class ServiceFactory{

    public static build(serviceType : ServiceType, config : any, db: admin.database.Database, key : string) : any {

        switch (serviceType){
            case ServiceType.GARAGE:
                return new GarageService(config, db);
            case ServiceType.TEMPERATURE:
                return new SensorService(config, db, key);
            case ServiceType.HUMIDITY:
                return new SensorService(config, db, key);
            case ServiceType.LIGHT:
                return new LightService(config, db, key);
            case ServiceType.THERMOSTAT:
                return new ThermostatService(config, db, key);
        }

    }

}