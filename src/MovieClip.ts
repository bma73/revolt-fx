import {RevoltEffects} from "./RevoltEffects";

export class MovieClip extends PIXI.extras.AnimatedSprite {

    public __sequenceEndTime:number;
    public componentId:string;

    constructor(componentId:string, textures: string[], anchorX?: number, anchorY?: number) {
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
    public recycle() {
        // console.log('recycle MovieClip');
        if (this.parent) this.parent.removeChild(this);
        this.gotoAndStop(0);
        RevoltEffects.instance.__recycleObject(this.componentId, this);
    }
    public dispose() {
        this.recycle();
        this.destroy();
    }
    // *********************************************************************************************
    // * Private																				   *
    // *********************************************************************************************

    // *********************************************************************************************
    // * Events																					   *
    // *********************************************************************************************

}