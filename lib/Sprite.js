/// <reference types="pixi.js" />
import * as PIXI from 'pixi.js';
export class Sprite extends PIXI.Sprite {
    constructor(componentId, texture, anchorX, anchorY) {
        super(PIXI.Texture.from(texture));
        this.componentId = componentId;
        this.anchor.set(anchorX || 0.5, anchorY || 0.5);
        this.__sequenceEndTime = null;
    }
    // *********************************************************************************************
    // * Public										                                        											   *
    // *********************************************************************************************
    recycle() {
        this.tint = 0xffffff;
        this.alpha = 1;
        this.transform.rotation = 0;
        this.transform.scale.set(1);
        if (this.parent)
            this.parent.removeChild(this);
        this.__fx.__recycleSprite(this.componentId, this);
    }
    dispose() {
        this.__fx = null;
        this.recycle();
        // @ts-ignore
        this.destroy(false);
    }
}
//# sourceMappingURL=Sprite.js.map