import * as PIXI from "pixi.js";
import { IEffectSequenceSettings } from "./FX";
import { BaseEffect } from "./BaseEffect";
import { FXSignal } from "./util/FXSignal";
export interface IEffectSequenceSignals {
    started: FXSignal;
    completed: FXSignal;
    exhausted: FXSignal;
    effectSpawned: FXSignal;
    triggerActivated: FXSignal;
}
export declare class EffectSequence extends BaseEffect {
    settings: IEffectSequenceSettings;
    private _startTime;
    private _effectStartTime;
    private _nextEffectSettings;
    private _list;
    private _index;
    private _scaleMod;
    private _delay;
    private _elements;
    __on: IEffectSequenceSignals;
    constructor(componentId: string);
    init(container: PIXI.Container, delay?: number, autoStart?: boolean, scaleMod?: number): EffectSequence;
    start(): EffectSequence | undefined;
    update(dt: number): void;
    stop(): void;
    recycle(): void;
    dispose(): void;
    set rotation(value: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get rotation(): number;
    get on(): IEffectSequenceSignals;
    private setNextEffect;
    __applySettings(value: IEffectSequenceSettings): void;
}
