import * as PIXI from "pixi.js";
import { ComponentType } from "../ComponentType";
import { FX, IBaseComponentParams, IEmitterSettings, IMinMaxEasing, IMovieClipComponentParams } from "../FX";
import { ParticleEmitter } from "../ParticleEmitter";
export interface IParticleComponentSettings {
    type: ComponentType;
    id: string;
    params: IBaseComponentParams | IMovieClipComponentParams;
}
export interface IGravitySettings {
    useGravity: boolean;
    gravity: number;
    useFloor: boolean;
    floorY: number;
}
export declare abstract class BaseEmitter extends PIXI.Container {
    private _fx;
    protected _emitter: ParticleEmitter;
    get emitter(): ParticleEmitter;
    protected _settings: IEmitterSettings;
    get settings(): IEmitterSettings;
    get distance(): IMinMaxEasing;
    setDistance(value: IMinMaxEasing): void;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get rotation(): number;
    set rotation(value: number);
    _scale: PIXI.ObservablePoint;
    set scale(value: PIXI.ObservablePoint);
    get scale(): PIXI.ObservablePoint;
    protected _initialized: boolean;
    constructor(_fx: FX, textureComponentId: string);
    dispose(): void;
    _onUpdate(): void;
    protected _init(settings?: IEmitterSettings): void;
}
