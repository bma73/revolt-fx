/// <reference types="pixi.js" />
import { BaseEmitterCore } from "./BaseEmitterCore";
import { Rnd } from "../util/Rnd";
export class RingEmitterCore extends BaseEmitterCore {
    constructor() {
        super(BaseEmitterCore.__TYPE_RING);
    }
    // *********************************************************************************************
    // * Public																		               *
    // *********************************************************************************************
    prepare(spawnCount) {
        super.prepare(spawnCount);
        const angle = this._settings.angle;
        if (2 * Math.PI - angle < 0.1) {
            this._uniformStep = angle / (spawnCount);
            this._angle = angle;
        }
        else {
            this._uniformStep = angle / (spawnCount - 1);
            this._angle = -angle * 0.5;
        }
    }
    emit(particle) {
        const settings = this._settings;
        const emitter = this.emitter;
        let angle;
        if (settings.uniform) {
            angle = this._angle + emitter.rotation;
            this._angle += this._uniformStep;
        }
        else {
            angle = Rnd.float(-settings.angle * 0.5, settings.angle * 0.5) + emitter.rotation;
        }
        const r = settings.radius * this.__scaleMod;
        particle.component.transform.position.x = (this.__x + this._t * (this.x - this.__x)) + Math.cos(angle) * r;
        particle.component.transform.position.y = (this.__y + this._t * (this.y - this.__y)) + Math.sin(angle) * r;
        if (settings.radial) {
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
            particle.component.transform.rotation = angle;
        }
        else {
            particle.dx = this._dx;
            particle.dy = this._dy;
            particle.component.transform.rotation = emitter.rotation;
        }
        this._t += this._posInterpolationStep;
    }
}
//# sourceMappingURL=RingEmitterCore.js.map