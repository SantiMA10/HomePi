
import {GarageAccessory} from "../module/accesory/impl/GarageAccesory";
import {SensorService} from "../module/accesory/impl/SensorAccessory";
import {ThermostatService} from "../module/accesory/impl/ThermostatAccessory";
import {LightAccessory} from "../module/accesory/impl/LightAccessory";

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