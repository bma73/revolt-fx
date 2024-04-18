import { FX, IMinMaxEasing } from "../FX";
import { ABaseEmitter } from "./ABaseEmitter";

export class SmokeEmitter extends ABaseEmitter {

    get distance(): IMinMaxEasing {
        const m = this._settings.particleSettings.motion;
        return {
            min: m.distanceMin,
            max: m.distanceMax,
            ease: m.distanceEase
        }
    }

    setDistance(value: IMinMaxEasing) {
        const m = this._settings.particleSettings.motion;
        m.distanceMin = value.min || m.distanceMin;
        m.distanceMax = value.max || m.distanceMax;
        m.distanceEase = value.ease || m.distanceEase;
    }

    constructor(fx: FX, textureComponentId: string) {
        super(fx);
        super.init(textureComponentId);
    }
}