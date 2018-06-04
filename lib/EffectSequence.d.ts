/// <reference types="pixi.js" />
import { BaseEffect } from "./BaseEffect";
import { IEffectSequenceSettings } from "./RevoltEffects";
export declare class EffectSequence extends BaseEffect {
    settings: IEffectSequenceSettings;
    private _startTime;
    private _effectStartTime;
    private _nextEffectSettings;
    private _list;
    private _index;
    private _elements;
    constructor(componentId: string);
    init(container: PIXI.Container, autoStart?: boolean): EffectSequence;
    start(): EffectSequence;
    update(dt: number): void;
    recycle(): void;
    dispose(): void;
    rotation: number;
    y: number;
    x: number;
    __applySettings(value: IEffectSequenceSettings): void;
    private setNextEffect();
}
