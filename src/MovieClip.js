import { RevoltEffects } from "./RevoltEffects";
import * as PIXI from 'pixi.js';

export class MovieClip extends PIXI.extras.AnimatedSprite {
    constructor(componentId, textures, anchorX, anchorY) {
        let t = [];
        let l = textures.length;
        for (let i = 0; i < l; i++) {
            t.push(PIXI.Texture.fromFrame(textures[i]));
        }
        super(t);
        this.componentId = componentId;
        this.anchor.set(0.5, 0.5);
        this.loop = false;
        this.__sequenceEndTime = 0;
        // this.play();
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    recycle() {
        // console.log('recycle MovieClip');
        if (this.parent)
            this.parent.removeChild(this);
        this.gotoAndStop(0);
        RevoltEffects.instance.__recycleObject(this.componentId, this);
    }
    dispose() {
        this.recycle();
        this.destroy();
    }
}