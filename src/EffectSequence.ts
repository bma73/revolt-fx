import {BaseEffect} from "./BaseEffect";
import {IEffectSequenceSettings, IEffectSettings, ComponentType, RevoltEffects} from "./RevoltEffects";
import {LinkedList, Node} from "./util/LinkedList";
import {ParticleEmitter} from "./ParticleEmitter";
import {MovieClip} from "./MovieClip";
import {Sprite} from "./Sprite";
import {Rnd} from "./util/Rnd";

export class EffectSequence extends BaseEffect {

    public settings: IEffectSequenceSettings;

    private _startTime: number;

    private _effectStartTime: number;
    private _nextEffectSettings: IEffectSettings;

    private _list: IEffectSettings[];
    private _index: number;

    private _elements: LinkedList = new LinkedList();

    constructor(componentId: string) {
        super(componentId);
    }

    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    public init(container: PIXI.Container, autoStart: boolean = true): EffectSequence {
        this.container = container;
        if (autoStart) this.start();
        return this;
    }

    public start(): EffectSequence {
        if (this._active) return;

        this._startTime = Date.now() + (this.settings.delay ? this.settings.delay * 1000 : 0);
        this._index = 0;

        if (this._list.length == 0) {
            this._active = false;
            if (this.onExhaust) this.onExhaust(this);
            if (this.onComplete) this.onComplete(this);
            this.recycle();
        }

        this.exhausted = this.completed = false;

        this.setNextEffect();

        RevoltEffects.instance.__addActiveEffect(this);

        if (this.onStart) this.onStart(this);
        return this;
    }

    public update(dt: number) {
        let t = Date.now();
        if (t < this._startTime) return;
        this._time += dt;

        // console.log(t, this._effectStartTime, this._effectStartTime - t);
        if (!this.exhausted && t >= this._effectStartTime) {
            let RE = RevoltEffects.instance;
            let effect: Sprite | MovieClip | ParticleEmitter;
            let def = this._nextEffectSettings;
            let node;
            switch (def.componentType) {
                case ComponentType.Sprite:
                    effect = RE.getSprite(def.componentId);
                    this.container.addChildAt(<Sprite>effect, 0);
                    (<Sprite>effect).blendMode = def.blendMode;
                    (<Sprite>effect).tint = def.tint;
                    (<Sprite>effect).scale.set(Rnd.float(def.scaleMin, def.scaleMax));
                    (<Sprite>effect).alpha = Rnd.float(def.alphaMin, def.alphaMax);
                    node = new Node({component: effect, endTime: t + (def.duration) * 1000});
                    break;

                case ComponentType.MovieClip:
                    effect = RE.getMovieClip(def.componentId);
                    if (def.componentParams) {
                        (<MovieClip>effect).animationSpeed = Rnd.float(def.componentParams.animationSpeedMin || 1, def.componentParams.animationSpeedMax || 1);
                        (<MovieClip>effect).loop = def.componentParams.loop || false;
                    }
                    (<MovieClip>effect).gotoAndPlay(0);
                    this.container.addChildAt(<MovieClip>effect, 0);
                    (<MovieClip>effect).blendMode = def.blendMode;
                    (<MovieClip>effect).tint = def.tint;
                    (<MovieClip>effect).scale.set(Rnd.float(def.scaleMin, def.scaleMax));
                    (<MovieClip>effect).alpha = Rnd.float(def.alphaMin, def.alphaMax);

                    node = new Node({component: effect, endTime: t + (def.duration) * 1000});
                    break;

                case ComponentType.Emitter:
                    effect = RE.getParticleEmitter(def.componentId);
                    (<ParticleEmitter>effect).init(this.container, true);
                    node = new Node({component: effect, endTime: (<ParticleEmitter>effect).endTime});
                    break;
            }
            effect.x = this._x;
            effect.y = this._y;
            effect.rotation = this._rotation;
            this._elements.add(node);

            if (this._index == this._list.length) {
                this.exhausted = true;
                if (this.onExhaust) this.onExhaust(this);
            } else {
                this.setNextEffect();
            }
        }

        let list = this._elements;
        let node = list.first;
        let next;
        while (node) {
            node.update(dt);
            if (t > node.data.endTime) {
                let component = node.data.component;
                if (component instanceof ParticleEmitter) {
                    if (component.completed) {
                        list.remove(node);
                    }
                } else {
                    list.remove(node);
                    component.recycle();
                }
            }
            node = node.next;
        }
        if (this.exhausted && list.length == 0) {
            this._active = false;
            this.completed = true;
            if (this.onComplete) this.onComplete(this);
            this.recycle();
        }
    }

    public recycle() {
        let list = this._elements;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.data.recycle();
            node = next;
        }
        list.clear();
        RevoltEffects.instance.__recycleEffect(this);
        console.log('recycle', this);
    }

    public dispose() {
        this._elements.clear();
    }

    public set rotation(value: number) {
        this._rotation = value;
        let list = this._elements;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.data.rotation = value;
            node = next;
        }
    }

    public get rotation(): number {
        return this._rotation;
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
        let list = this._elements;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.data.y = value;
            node = next;
        }
    }
    public get x(): number {
        return this._x;
    }

    public set x(value: number) {
        this._x = value;
        let list = this._elements;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.data.x = value;
            node = next;
        }
    }

    // *********************************************************************************************
    // * Internal																				   *
    // *********************************************************************************************
    public __applySettings(value: IEffectSequenceSettings) {
        this.settings = value;
        this._list = value.effects.slice();


        /* let effects = value.effects;
         let l = effects.length;
         let effect:BaseEffect;

         let RE = RevoltEffects.instance;

         for (let i = 0; i < l; i++) {
         let effectDef = effects[i];
         switch (effectDef.componentType) {
         case ComponentType.Sprite:
         effect = <BaseEffect>RE.__getSprite(effectDef.componentId);
         break;
         case ComponentType.MovieClip:
         eff
         break;
         case ComponentType.Emitter:
         break;

         }
         }*/
    }

    private setNextEffect() {
        if (this.exhausted) return;
        let def = this._nextEffectSettings = this._list[this._index++];
        this._effectStartTime = this._startTime + def.delay * 1000;

        console.log(def, this._effectStartTime);

    }

    // *********************************************************************************************
    // * Events																					   *
    // *********************************************************************************************

}

