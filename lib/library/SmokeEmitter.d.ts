import { FX, IMinMaxEasing } from "../FX";
import { ABaseEmitter } from "./ABaseEmitter";
export declare class SmokeEmitter extends ABaseEmitter {
    get distance(): IMinMaxEasing;
    setDistance(value: IMinMaxEasing): void;
    constructor(fx: FX, textureComponentId: string);
}
