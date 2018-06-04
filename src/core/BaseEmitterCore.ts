import {ICircleCoreParams, IBoxCoreParams, IRingCoreParams} from "../RevoltEffects";
import {ParticleEmitter} from "../ParticleEmitter";
import {Particle} from "../Particle";
export class BaseEmitterCore {

        public x: number;
        public y: number;

        protected _settings: ICircleCoreParams | IBoxCoreParams | IRingCoreParams;

        protected _dx: number = 0;
        protected _dy: number = 0;
        protected _rotation: number = 0;

        constructor(public emitter: ParticleEmitter) {
            this._settings = emitter.settings.core.params;
        }

        // *********************************************************************************************
        // * Public																					   *
        // *********************************************************************************************

        public emit(particle: Particle) {

        }

        public get rotation(): number {
            return this._rotation;
        }

        public set rotation(value: number) {
            this._rotation = value;
            this._dx = Math.cos(value);
            this._dy = Math.sin(value);
        }

        public prepare() {

        }

        public step() {

        }

        public dispose() {
            this.emitter = null;
        }

        // *********************************************************************************************
        // * Private																				   *
        // *********************************************************************************************

        // *********************************************************************************************
        // * Events																					   *
        // *********************************************************************************************

    }