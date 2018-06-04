/// <reference types="pixi.js" />
import { Node } from "./util/LinkedList";
import { IEffectSequenceSettings, IEmitterSettings } from "./RevoltEffects";
export declare class BaseEffect extends Node {
    componentId: string;
    container: PIXI.Container;
    exhausted: boolean;
    completed: boolean;
    onStart: Function;
    onExhaust: Function;
    onComplete: Function;
    endTime: number;
    protected _x: number;
    protected _y: number;
    protected _rotation: number;
    protected _alpha: number;
    protected _scale: PIXI.Point;
    protected _time: number;
    protected _active: boolean;
    constructor(componentId: string);
    update(dt: number): void;
    recycle(): void;
    readonly active: boolean;
    scale: PIXI.Point;
    alpha: number;
    rotation: number;
    y: number;
    x: number;
    __applySettings(value: IEffectSequenceSettings | IEmitterSettings): void;
}
