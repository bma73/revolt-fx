import { ABaseEmitter } from "./ABaseEmitter";
export class SmokeEmitter extends ABaseEmitter {
    get distance() {
        const m = this._settings.particleSettings.motion;
        return {
            min: m.distanceMin,
            max: m.distanceMax,
            ease: m.distanceEase
        };
    }
    setDistance(value) {
        const m = this._settings.particleSettings.motion;
        m.distanceMin = value.min || m.distanceMin;
        m.distanceMax = value.max || m.distanceMax;
        m.distanceEase = value.ease || m.distanceEase;
    }
    constructor(fx, textureComponentId) {
        super(fx);
        super.init(textureComponentId);
    }
}
//# sourceMappingURL=SmokeEmitter.js.map