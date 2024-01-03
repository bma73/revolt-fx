/// <reference types="pixi.js" />
import { BaseEmitterCore } from "./BaseEmitterCore";
import { Rnd } from "../util/Rnd";
export class CircleEmitterCore extends BaseEmitterCore {
    constructor() {
        super(BaseEmitterCore.__TYPE_CIRCLE);
    }
    // *********************************************************************************************
    // * Public																	                   *
    // *********************************************************************************************
    emit(particle) {
        const settings = this._settings;
        const emitter = this.emitter;
        let angle;
        if (!settings.angle) {
            angle = Rnd.float(0, 6.28319) + emitter.rotation;
        }
        else {
            angle = Rnd.float(-settings.angle * 0.5, settings.angle * 0.5) + emitter.rotation;
        }
        if (settings.radius > 0) {
            let r = Rnd.float(0, settings.radius) * this.__scaleMod;
            particle.component.x = (this.__x + this._t * (this.x - this.__x)) + Math.cos(angle) * r;
            particle.component.y = (this.__y + this._t * (this.y - this.__y)) + Math.sin(angle) * r;
        }
        else {
            particle.component.x = this.__x + this._t * (this.x - this.__x);
            particle.component.y = this.__y + this._t * (this.y - this.__y);
        }
        if (settings.radial) {
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
            particle.component.rotation = angle;
        }
        else {
            particle.dx = this._dx;
            particle.dy = this._dy;
            particle.component.rotation = emitter.rotation;
        }
        this._t += this._posInterpolationStep;
    }
}
//# sourceMappingURL=CircleEmitterCore.js.map