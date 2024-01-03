/// <reference types="pixi.js" />
import * as PIXI from 'pixi.js';
export class MovieClip extends PIXI.AnimatedSprite {
    constructor(componentId, textures, anchorX, anchorY) {
        let t = [];
        let l = textures.length;
        for (let i = 0; i < l; i++) {
            t.push(PIXI.Texture.from(textures[i]));
        }
        super(t);
        this.componentId = componentId;
        this.anchor.set(0.5, 0.5);
        this.loop = false;
        this.__sequenceEndTime = 0;
    }
    // *********************************************************************************************
    // * Public																		                                        			   *
    // *********************************************************************************************
    recycle() {
        this.alpha = 1;
        this.tint = 0xffffff;
        this.rotation = 0;
        this.scale.set(1);
        if (this.parent)
            this.parent.removeChild(this);
        this.gotoAndStop(0);
        this.__fx.__recycleMovieClip(this.componentId, this);
    }
    dispose() {
        if (this.parent)
            this.parent.removeChild(this);
        this.gotoAndStop(0);
        this.destroy();
    }
}
//# sourceMappingURL=MovieClip.js.map