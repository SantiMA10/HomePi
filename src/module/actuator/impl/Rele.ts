import { SwitchButton } from "../switch";

class Rele implements SwitchButton{

    pin : number;

    constructor(pin : number){
        this.pin = pin;
    }

    blink(): void {
        throw new Error("Method not implemented.");
    }

    on(): void {
        throw new Error("Method not implemented.");
    }

    off(): void {
        throw new Error("Method not implemented.");
    }

}