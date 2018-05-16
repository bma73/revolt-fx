import { BaseEffect } from "./BaseEffect";
import { ComponentType, RevoltEffects } from "./RevoltEffects";
import { LinkedList, Node } from "./util/LinkedList";
import { ParticleEmitter } from "./ParticleEmitter";
import { Rnd } from "./util/Rnd";
export class EffectSequence extends BaseEffect {
    constructor(componentId) {
        super(componentId);
        this._elements = new LinkedList();
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    init(container, autoStart = true) {
        this.container = container;
        if (autoStart)
            this.start();
        return this;
    }
    start() {
        if (this._active)
            return;
        this._startTime = Date.now() + (this.settings.delay ? this.settings.delay * 1000 : 0);
        this._index = 0;
        if (this._list.length == 0) {
            this._active = false;
            if (this.onExhaust)
                this.onExhaust(this);
            if (this.onComplete)
                this.onComplete(this);
            this.recycle();
        }
        this.exhausted = this.completed = false;
        this.setNextEffect();
        RevoltEffects.instance.__addActiveEffect(this);
        if (this.onStart)
            this.onStart(this);
        return this;
    }
    update(dt) {
        let t = Date.now();
        if (t < this._startTime)
            return;
        this._time += dt;
        // console.log(t, this._effectStartTime, this._effectStartTime - t);
        if (!this.exhausted && t >= this._effectStartTime) {
            let RE = RevoltEffects.instance;
            let effect;
            let def = this._nextEffectSettings;
            let node;
            switch (def.componentType) {
                case ComponentType.Sprite:
                    effect = RE.getSprite(def.componentId);
                    this.container.addChildAt(effect, 0);
                    effect.blendMode = def.blendMode;
                    effect.tint = def.tint;
                    effect.scale.set(Rnd.float(def.scaleMin, def.scaleMax));
                    effect.alpha = Rnd.float(def.alphaMin, def.alphaMax);
                    node = new Node({ component: effect, endTime: t + (def.duration) * 1000 });
                    break;
                case ComponentType.MovieClip:
                    effect = RE.getMovieClip(def.componentId);
                    if (def.componentParams) {
                        effect.animationSpeed = Rnd.float(def.componentParams.animationSpeedMin || 1, def.componentParams.animationSpeedMax || 1);
                        effect.loop = def.componentParams.loop || false;
                    }
                    effect.gotoAndPlay(0);
                    this.container.addChildAt(effect, 0);
                    effect.blendMode = def.blendMode;
                    effect.tint = def.tint;
                    effect.scale.set(Rnd.float(def.scaleMin, def.scaleMax));
                    effect.alpha = Rnd.float(def.alphaMin, def.alphaMax);
                    node = new Node({ component: effect, endTime: t + (def.duration) * 1000 });
                    break;
                case ComponentType.Emitter:
                    effect = RE.getParticleEmitter(def.componentId);
                    effect.init(this.container, true);
                    node = new Node({ component: effect, endTime: effect.endTime });
                    break;
            }
            effect.x = this._x;
            effect.y = this._y;
            effect.rotation = this._rotation;
            this._elements.add(node);
            if (this._index == this._list.length) {
                this.exhausted = true;
                if (this.onExhaust)
                    this.onExhaust(this);
            }
            else {
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
                }
                else {
                    list.remove(node);
                    component.recycle();
                }
            }
            node = node.next;
        }
        if (this.exhausted && list.length == 0) {
            this._active = false;
            this.completed = true;
            if (this.onComplete)
                this.onComplete(this);
            this.recycle();
        }
    }
    recycle() {
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
    dispose() {
        this._elements.clear();
    }
    set rotation(value) {
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
    get rotation() {
        return this._rotation;
    }
    get y() {
        return this._y;
    }
    set y(value) {
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
    get x() {
        return this._x;
    }
    set x(value) {
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
    __applySettings(value) {
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
    setNextEffect() {
        if (this.exhausted)
            return;
        let def = this._nextEffectSettings = this._list[this._index++];
        this._effectStartTime = this._startTime + def.delay * 1000;
        console.log(def, this._effectStartTime);
    }
}