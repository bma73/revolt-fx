import { EffectSequenceComponentType } from "../EffectSequenceComponentType";
import { IBaseComponentParams, IEffectSequenceSettings, IEffectSettings, IMovieClipComponentParams } from "../FX";
export declare class EffectSettingsData implements IEffectSettings {
    name: string;
    componentId: string;
    componentType: EffectSequenceComponentType.Emitter;
    componentParams: IMovieClipComponentParams | IBaseComponentParams;
    alphaMin: number;
    alphaMax: number;
    rotationMin: number;
    rotationMax: number;
    blendMode: number;
    tint: number;
    duration: number;
    triggerValue: string;
    delay: number;
    scaleMin: number;
    scaleMax: number;
    containerId: string;
    constructor(name: string);
}
export declare class EffectSequenceData implements IEffectSequenceSettings {
    name: string;
    effects: IEffectSettings[];
    delay: number;
    scaleMin: number;
    scaleMax: number;
    id: any;
    containerId: string;
    constructor(name: string);
}
