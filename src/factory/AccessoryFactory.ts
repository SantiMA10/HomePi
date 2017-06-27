
import {GarageAccessory} from "../module/accesory/GarageAccesory";
import {SensorService} from "../module/accesory/SensorAccessory";
import {ThermostatService} from "../module/accesory/ThermostatAccessory";
import {LightAccessory} from "../module/accesory/LightAccessory";

export enum AccessoryType{
    GARAGE,
    TEMPERATURE,
    HUMIDITY,
    LIGHT,
    THERMOSTAT
}

export class AccessoryFactory{

    public static build(serviceType : AccessoryType, config : any, db: admin.database.Database) : any {

        switch (serviceType){
            case AccessoryType.GARAGE:
                return new GarageAccessory(config, db);
            case AccessoryType.TEMPERATURE:
                return new SensorService(config, db);
            case AccessoryType.HUMIDITY:
                return new SensorService(config, db);
            case AccessoryType.LIGHT:
                return new LightAccessory(config, db);
            case AccessoryType.THERMOSTAT:
                return new ThermostatService(config, db);
        }

    }

}