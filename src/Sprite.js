import { RevoltEffects } from "./RevoltEffects";
import * as PIXI from 'pixi.js';

export class Sprite extends PIXI.Sprite {
    constructor(componentId, texture, anchorX, anchorY) {
        super(PIXI.Texture.fromFrame(texture));
        this.componentId = componentId;
        this.anchor.set(anchorX || 0.5, anchorY || 0.5);
        this.__sequenceEndTime = null;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    recycle() {
        if (this.parent)
            this.parent.removeChild(this);
        RevoltEffects.instance.__recycleObject(this.componentId, this);
        // this.x = this.y = 0;
        // console.log(this, 'recycle');
    }
    dispose() {
        this.recycle();
        this.destroy(false, false);
    }
}