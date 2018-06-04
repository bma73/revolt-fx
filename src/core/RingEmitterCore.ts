    import {BaseEmitterCore} from "./BaseEmitterCore";
import {ParticleEmitter} from "../ParticleEmitter";
import {Particle} from "../Particle";
import {IRingCoreParams} from "../RevoltEffects";
import {Rnd} from "../util/Rnd";
export class RingEmitterCore extends BaseEmitterCore {

        private _uniformStep: number;
        private _angle: number;

        constructor(emitter: ParticleEmitter) {
            super(emitter);

        }

        // *********************************************************************************************
        // * Public																					   *
        // *********************************************************************************************

        public emit(particle: Particle) {

            let settings = <IRingCoreParams>this._settings;
            let emitter = this.emitter;

            let angle;
            if (!settings.angle) {
                if (settings.uniform) {
                    angle = this._angle + emitter.rotation;
                    this._angle += this._uniformStep;
                } else {
                    angle = Rnd.float(0, 6.28319) + emitter.rotation;
                }
            } else {
                angle = Rnd.float(-settings.angle * 0.5, settings.angle * 0.5) + emitter.rotation;
            }

            let r = settings.radius;
            particle.component.x = this.x + Math.cos(angle) * r;
            particle.component.y = this.y + Math.sin(angle) * r;

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

        public prepare() {
            this._uniformStep = 6.28319 / this.emitter.settings.spawnCount;
            this._angle = 0;
        }

        public step() {
        }

        // *********************************************************************************************
        // * Private																				   *
        // *********************************************************************************************

        // *********************************************************************************************
        // * Events																					   *
        // *********************************************************************************************

    }