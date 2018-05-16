import { BaseEmitterCore } from "./BaseEmitterCore";
import { Rnd } from "../util/Rnd";
export class CircleEmitterCore extends BaseEmitterCore {
    constructor(emitter) {
        super(emitter);
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    emit(particle) {
        let settings = this._settings;
        let emitter = this.emitter;
        let angle;
        if (!settings.angle) {
            angle = Rnd.float(0, 6.28319) + emitter.rotation;
        }
        else {
            angle = Rnd.float(-settings.angle * 0.5, settings.angle * 0.5) + emitter.rotation;
        }
        if (settings.radius > 0) {
            let r = Rnd.float(0, settings.radius);
            particle.component.x = this.x + Math.cos(angle) * r;
            particle.component.y = this.y + Math.sin(angle) * r;
        }
        else {
            particle.component.x = this.x;
            particle.component.y = this.y;
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
    }
}