import * as PIXI from "pixi.js";
import { ComponentType } from "../ComponentType";
import { FX, IBaseComponentParams, IEmitterSettings, IMovieClipComponentParams } from "../FX";
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
export declare abstract class ABaseEmitter extends PIXI.Container {
    private _fx;
    protected _emitter: ParticleEmitter;
    get emitter(): ParticleEmitter;
    protected _settings: IEmitterSettings;
    get settings(): IEmitterSettings;
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
    protected _childEmitters: ABaseEmitter[];
    get childEmitters(): ABaseEmitter[];
    addChildEmitter(child: ABaseEmitter, scale?: number, adoptRotation?: boolean, containerId?: string): void;
    removeChildEmitter(child: ABaseEmitter): void;
    constructor(_fx: FX);
    dispose(): void;
    _onUpdate(): void;
    protected init(textureComponentId: string, settings?: IEmitterSettings): void;
}
