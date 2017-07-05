
import {GarageAccessory} from "../module/accesory/impl/GarageAccesory";
import {SensorService} from "../module/accesory/impl/SensorAccessory";
import {ThermostatAccessory} from "../module/accesory/impl/ThermostatAccessory";
import {LightAccessory} from "../module/accesory/impl/LightAccessory";
import {Accessory} from "../module/accesory/Accessory";

export enum AccessoryType{
    GARAGE,
    TEMPERATURE,
    HUMIDITY,
    LIGHT,
    THERMOSTAT
}

export class AccessoryFactory{

    /**
     * Método para crear accesorios
     * @param accessoryType tipo del accesorio a crear
     * @param config configuración del accesorio
     * @param db referencia a firebase
     * @returns {Accessory}
     */
    public static build(accessoryType : AccessoryType, config : any, db: admin.database.Database) : Accessory {

        switch (accessoryType){
            case AccessoryType.GARAGE:
                return new GarageAccessory(config, db);
            case AccessoryType.TEMPERATURE:
                return new SensorService(config, db);
            case AccessoryType.HUMIDITY:
                return new SensorService(config, db);
            case AccessoryType.LIGHT:
                return new LightAccessory(config, db);
            case AccessoryType.THERMOSTAT:
                return new ThermostatAccessory(config, db);
        }

    }

}