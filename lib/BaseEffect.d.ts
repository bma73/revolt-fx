/// <reference types="pixi.js" />
import { IEffectSequenceSettings, IEmitterSettings, FX } from "./FX";
import { Node } from "./util/LinkedList";
export declare class BaseEffect extends Node {
    componentId: string;
    container: PIXI.Container;
    exhausted: boolean;
    completed: boolean;
    name: string;
    endTime: number;
    protected _x: number;
    protected _y: number;
    protected _rotation: number;
    protected _alpha: number;
    protected _scale: PIXI.Point;
    protected _time: number;
    protected _active: boolean;
    __fx: FX;
    __recycled: boolean;
    constructor(componentId: string);
    update(dt: number): void;
    recycle(): void;
    get active(): boolean;
    get scale(): PIXI.Point;
    set scale(value: PIXI.Point);
    get alpha(): number;
    set alpha(value: number);
    set rotation(value: number);
    get rotation(): number;
    get y(): number;
    set y(value: number);
    get x(): number;
    set x(value: number);
    __applySettings(value: IEffectSequenceSettings | IEmitterSettings): void;
}
