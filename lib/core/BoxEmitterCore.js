/// <reference types="pixi.js" />
import { BaseEmitterCore } from "./BaseEmitterCore";
import { Rnd } from "../util/Rnd";
export class BoxEmitterCore extends BaseEmitterCore {
    constructor() {
        super(BaseEmitterCore.__TYPE_BOX);
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    emit(particle) {
        const settings = this._settings;
        const emitter = this.emitter;
        const w2 = settings.width * 0.5 * this.__scaleMod;
        const h2 = settings.height * 0.5 * this.__scaleMod;
        let angle = emitter.rotation;
        const x = Rnd.float(-w2, w2);
        const y = Rnd.float(-h2, h2);
        if (angle != 0) {
            particle.component.transform.position.x = (this.__x + this._t * (this.x - this.__x)) + x * Math.cos(angle) - y * Math.sin(angle);
            particle.component.transform.position.y = (this.__y + this._t * (this.y - this.__y)) + x * Math.sin(angle) + y * Math.cos(angle);
        }
        else {
            particle.component.transform.position.x = this.__x + this._t * (this.x - this.__x) + x;
            particle.component.transform.position.y = this.__y + this._t * (this.y - this.__y) + y;
        }
        if (settings.radial) {
            angle += Math.atan2(y, x);
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
        }
        else {
            particle.dx = this._dx;
            particle.dy = this._dy;
        }
        particle.component.transform.rotation = angle;
        this._t += this._posInterpolationStep;
    }
}
//# sourceMappingURL=BoxEmitterCore.js.map