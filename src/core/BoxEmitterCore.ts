import {BaseEmitterCore} from "./BaseEmitterCore";
import {ParticleEmitter} from "../ParticleEmitter";
import {Particle} from "../Particle";
import {IBoxCoreParams} from "../RevoltEffects";
import {Rnd} from "../util/Rnd";

export class BoxEmitterCore extends BaseEmitterCore {

    constructor(emitter: ParticleEmitter) {
        super(emitter);
    }

    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************

    public emit(particle: Particle) {

        let settings = <IBoxCoreParams>this._settings;
        let emitter = this.emitter;

        let w2 = settings.width * 0.5;
        let h2 = settings.height * 0.5;

        let angle = emitter.rotation;

        var x = Rnd.float(-w2, w2);
        var y = Rnd.float(-h2, h2);

        if (angle != 0) {
            particle.component.x = this.x + x * Math.cos(angle) - y * Math.sin(angle);
            particle.component.y = this.y + x * Math.sin(angle) + y * Math.cos(angle);
        } else {
            particle.component.x = this.x + x;
            particle.component.y = this.y + y;
        }

        if (settings.radial) {
            angle += Math.atan2(y, x);
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
        } else {
            particle.dx = this._dx;
            particle.dy = this._dy;
        }

        particle.component.rotation = angle;

    }

    // *********************************************************************************************
    // * Private																				   *
    // *********************************************************************************************

    // *********************************************************************************************
    // * Events																					   *
    // *********************************************************************************************

}