/// <reference types="pixi.js" />
import * as PIXI from 'pixi.js';
export declare class Sprite extends PIXI.Sprite {
    componentId: string;
    __sequenceEndTime: number;
    constructor(componentId: string, texture: string, anchorX?: number, anchorY?: number);
    recycle(): void;
    dispose(): void;
}
