/// <reference types="pixi.js" />
export declare class MovieClip extends PIXI.extras.AnimatedSprite {
    __sequenceEndTime: number;
    componentId: string;
    constructor(componentId: string, textures: string[], anchorX?: number, anchorY?: number);
    recycle(): void;
    dispose(): void;
}
