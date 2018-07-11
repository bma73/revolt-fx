import {IEffectSequenceSettings, IEmitterSettings, FX, IParticleEmitterParent} from "./FX";
import {Node} from "./util/LinkedList";

export class BaseEffect extends Node  {

    public container: PIXI.Container;
    public exhausted: boolean = false;
    public completed: boolean = false;

    public name: string;

    public endTime: number;

    protected _x: number = 0;
    protected _y: number = 0;
    protected _rotation: number = 0;
    protected _alpha: number = 0;

    protected _scale: PIXI.Point = new PIXI.Point();
    protected _time: number;

    protected _active: boolean = false;

    public __fx: FX;
    public __recycled: boolean = true;


    constructor(public componentId: string) {
        super();
    }

    // *********************************************************************************************
    // * Public																					                                           *
    // *********************************************************************************************


    public update(dt: number) {

    }

    public recycle() {

    }

    public get active(): boolean {
        return this._active;
    }

    public get scale(): PIXI.Point {
        return this._scale;
    }

    public set scale(value: PIXI.Point) {
        this._scale = value;
    }

    public get alpha(): number {
        return this._alpha;
    }

    public set alpha(value: number) {
        this._alpha = value;
    }

    public set rotation(value: number) {
        this._rotation = value;
    }

    public get rotation(): number {
        return this._rotation;
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
    }

    public get x(): number {
        return this._x;
    }

    public set x(value: number) {
        this._x = value;
    }

    // *********************************************************************************************
    // * internal										                                        										   *
    // *********************************************************************************************
    public __applySettings(value: IEffectSequenceSettings | IEmitterSettings) {
    }

}
