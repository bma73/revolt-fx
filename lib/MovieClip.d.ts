import { FX } from "./FX";
import * as PIXI from 'pixi.js';
export declare class MovieClip extends PIXI.AnimatedSprite {
    componentId: string;
    __sequenceEndTime: number;
    __fx: FX;
    constructor(componentId: string, textures: string[], anchorX?: number, anchorY?: number);
    recycle(): void;
    dispose(): void;
}
