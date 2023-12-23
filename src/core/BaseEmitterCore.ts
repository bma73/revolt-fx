import { Particle } from "../Particle";
import { IBoxCoreParams, ICircleCoreParams, IRingCoreParams } from "../FX";
import { ParticleEmitter } from "../ParticleEmitter";

export class BaseEmitterCore {

    public x: number;
    public y: number;
    public emitter: ParticleEmitter;

    protected _settings: ICircleCoreParams | IBoxCoreParams | IRingCoreParams;
    protected _posInterpolationStep: number;
    protected _dx: number = 0;
    protected _dy: number = 0;
    protected _rotation: number = 0;
    protected _t: number;

    public __x: number;
    public __y: number;
    public __scaleMod: number;

    public static __TYPE_BOX: string = 'box';
    public static __TYPE_CIRCLE: string = 'circle';
    public static __TYPE_RING: string = 'ring';


    constructor(public type: string) {

    }

    // *********************************************************************************************
    // * Public			                                        								   *
    // *********************************************************************************************
    public init(emitter: ParticleEmitter) {
        this.emitter = emitter;
        this._settings = emitter.settings.core.params;
        this.x = this.__x = emitter.x;
        this.y = this.__y = emitter.y;
        this.rotation = emitter.rotation;
    }

    public emit(particle: Particle) {

    }

    public prepare(spawnCount: number) {
        this._posInterpolationStep = 1 / spawnCount;
        this._t = this._posInterpolationStep * 0.5;
    }

    public step() {
        this.__x = this.x;
        this.__y = this.y;
    }

    public recycle() {
        this.emitter = null;
        this._settings = null;

    }

    public dispose() {
        this.recycle();
        this.emitter = null;
        this._settings = null;
    }

    public get rotation(): number {
        return this._rotation;
    }

    public set rotation(value: number) {
        this._rotation = value;
        this._dx = Math.cos(value);
        this._dy = Math.sin(value);
    }

    // *********************************************************************************************
    // * Private								                                        												   *
    // *********************************************************************************************

    // *********************************************************************************************
    // * Events								                                        													   *
    // *********************************************************************************************

}
