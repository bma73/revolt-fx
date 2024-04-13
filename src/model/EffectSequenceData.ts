import { EffectSequenceComponentType } from "../EffectSequenceComponentType";
import { IBaseComponentParams, IEffectSequenceSettings, IEffectSettings, IMovieClipComponentParams } from "../FX";

export class EffectSettingsData implements IEffectSettings {
    componentId: string;
    componentType: EffectSequenceComponentType.Emitter;
    componentParams: IMovieClipComponentParams | IBaseComponentParams = {
        anchorX: 0.5,
        anchorY: 0.5,
        animationSpeedMin: 1,
        animationSpeedMax: 1,
        loop: false,
    };
    alphaMin: number = 1;
    alphaMax: number = 1;
    rotationMin: number = 0;
    rotationMax: number = 0;
    blendMode: number = 1;
    tint: number = 0xffffff;
    duration: number = 1;
    triggerValue: string = '';
    delay: number = 0;
    scaleMin: number = 1;
    scaleMax: number = 1;
    containerId: string = '';

    constructor(public name: string) {
        this.componentId = name;
    }
}

export class EffectSequenceData implements IEffectSequenceSettings {

    effects: IEffectSettings[];
    delay: number = 0;
    scaleMin: number = 1;
    scaleMax: number = 1;
    id: any;
    containerId: string = '';

    constructor(public name: string) {
        this.id = name;
    }
}



