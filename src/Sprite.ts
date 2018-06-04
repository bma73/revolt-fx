import {RevoltEffects} from "./RevoltEffects";
import * as PIXI from 'pixi.js';

export class Sprite extends PIXI.Sprite {

    public __sequenceEndTime: number;

    constructor(public componentId:string, texture: string, anchorX?: number, anchorY?: number) {
        super(PIXI.Texture.fromFrame(texture));
        this.anchor.set(anchorX || 0.5, anchorY || 0.5);
        this.__sequenceEndTime = null;
    }

    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    public recycle() {
        // console.log('recycle Sprite');
        if (this.parent) this.parent.removeChild(this);
        RevoltEffects.instance.__recycleObject(this.componentId, this);
        // this.x = this.y = 0;
        // console.log(this, 'recycle');
    }

    public dispose() {
        this.recycle();
        this.destroy(false);
    }

    // *********************************************************************************************
    // * Private																				   *
    // *********************************************************************************************

    // *********************************************************************************************
    // * Events																					   *
    // *********************************************************************************************

}