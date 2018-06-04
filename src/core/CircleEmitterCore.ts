import {BaseEmitterCore} from "./BaseEmitterCore";
import {ParticleEmitter} from "../ParticleEmitter";
import {ICircleCoreParams} from "../RevoltEffects";
import {Rnd} from "../util/Rnd";
import {Particle} from "../Particle";

export class CircleEmitterCore extends BaseEmitterCore {

    constructor(emitter: ParticleEmitter) {
        super(emitter);
    }

    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************

    public emit(particle: Particle) {

        let settings = <ICircleCoreParams>this._settings;
        let emitter = this.emitter;

        let angle;
        if (!settings.angle) {
            angle = Rnd.float(0, 6.28319) + emitter.rotation;
        } else {
            angle = Rnd.float(-settings.angle * 0.5, settings.angle * 0.5) + emitter.rotation;
        }

        if (settings.radius > 0) {
            let r = Rnd.float(0, settings.radius);
            particle.component.x = this.x + Math.cos(angle) * r;
            particle.component.y = this.y + Math.sin(angle) * r;
        } else {
            particle.component.x = this.x;
            particle.component.y = this.y;
        }

        if (settings.radial) {
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
            particle.component.rotation = angle;
        } else {
            particle.dx = this._dx;
            particle.dy = this._dy;
            particle.component.rotation = emitter.rotation;
        }
    }

    // *********************************************************************************************
    // * Private																				   *
    // *********************************************************************************************

    // *********************************************************************************************
    // * Events																					   *
    // *********************************************************************************************

}