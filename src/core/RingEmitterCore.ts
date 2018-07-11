/// <reference types="pixi.js" />

import {BaseEmitterCore} from "./BaseEmitterCore";
import {ParticleEmitter} from "../ParticleEmitter";
import {Particle} from "../Particle";
import {IRingCoreParams} from "../FX";
import {Rnd} from "../util/Rnd";

export class RingEmitterCore extends BaseEmitterCore {

    private _uniformStep: number;
    private _angle: number;

    constructor() {
        super(BaseEmitterCore.__TYPE_RING);
    }

    // *********************************************************************************************
    // * Public																		                                         			   *
    // *********************************************************************************************


    public prepare(spawnCount: number) {
        super.prepare(spawnCount);

        const angle = (<IRingCoreParams>this._settings).angle;
        if (2 * Math.PI - angle < 0.1 ) {
            this._uniformStep = angle / (spawnCount);
            this._angle = angle;
        } else {
            this._uniformStep = angle / (spawnCount - 1);
            this._angle = -angle * 0.5;
        }
    }

    public emit(particle: Particle) {

        const settings = <IRingCoreParams>this._settings;
        const emitter = this.emitter;

        let angle;

        if (settings.uniform) {
            angle = this._angle + emitter.rotation;
            this._angle += this._uniformStep;
        } else {
            angle = Rnd.float(-settings.angle * 0.5, settings.angle * 0.5) + emitter.rotation;
        }

        const r = settings.radius * this.__scaleMod;
        (<PIXI.Transform> particle.component.transform).position.x = (this.__x + this._t * (this.x - this.__x)) + Math.cos(angle) * r;
        (<PIXI.Transform> particle.component.transform).position.y = (this.__y + this._t * (this.y - this.__y)) + Math.sin(angle) * r;

        if (settings.radial) {
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
            (<PIXI.Transform> particle.component.transform).rotation = angle;
        } else {
            particle.dx = this._dx;
            particle.dy = this._dy;
            (<PIXI.Transform> particle.component.transform).rotation = emitter.rotation;
        }

        this._t += this._posInterpolationStep;

    }

    // *********************************************************************************************
    // * Private																	                                        			   *
    // *********************************************************************************************

    // *********************************************************************************************
    // * Events															                                        						   *
    // *********************************************************************************************

}
