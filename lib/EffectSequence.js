/// <reference types="pixi.js" />
import { BaseEffect } from "./BaseEffect";
import { LinkedList, Node } from "./util/LinkedList";
import { ParticleEmitter } from "./ParticleEmitter";
import { Rnd } from "./util/Rnd";
import { FXSignal } from "./util/FXSignal";
import { EffectSequenceComponentType } from "./EffectSequenceComponentType";
export class EffectSequence extends BaseEffect {
    constructor(componentId) {
        super(componentId);
        this._list = [];
        this._elements = new LinkedList();
        this.__on = {
            started: new FXSignal(),
            completed: new FXSignal(),
            exhausted: new FXSignal(),
            effectSpawned: new FXSignal(),
            triggerActivated: new FXSignal()
        };
    }
    // *********************************************************************************************
    // * Public																			                                        		   *
    // *********************************************************************************************
    init(container, delay = 0, autoStart = true, scaleMod = 1) {
        this.container = container;
        this._scaleMod = scaleMod;
        this._delay = delay * 1000;
        if (autoStart)
            this.start();
        return this;
    }
    start() {
        if (this._active)
            return;
        this._startTime = Date.now() + (this.settings.delay ? this.settings.delay * 1000 : 0) + this._delay;
        this._index = 0;
        if (this._list.length == 0) {
            this._active = false;
            if (this.__on.exhausted.__hasCallback) {
                this.__on.exhausted.dispatch(this);
            }
            if (this.__on.completed.__hasCallback) {
                this.__on.completed.dispatch(this);
            }
            this.recycle();
            return this;
        }
        this.exhausted = this.completed = false;
        this.setNextEffect();
        this.__fx.effectSequenceCount++;
        this.__fx.__addActiveEffect(this);
        if (this.__on.started.__hasCallback) {
            this.__on.started.dispatch(this);
        }
        return this;
    }
    update(dt) {
        const t = Date.now();
        if (t < this._startTime)
            return;
        this._time += dt;
        if (!this.exhausted && t >= this._effectStartTime) {
            const fx = this.__fx;
            const def = this._nextEffectSettings;
            let effect;
            let node;
            switch (def.componentType) {
                case EffectSequenceComponentType.Sprite:
                    effect = fx.__getSprite(def.componentId);
                    let container = fx.__containers[def.containerId] || this.container;
                    container.addChild(effect);
                    effect.blendMode = fx.useBlendModes ? def.blendMode : 0;
                    effect.tint = def.tint;
                    effect.scale.set(Rnd.float(def.scaleMin, def.scaleMax) * Rnd.float(this.settings.scaleMin, this.settings.scaleMax) * this._scaleMod);
                    effect.alpha = Rnd.float(def.alphaMin, def.alphaMax);
                    effect.anchor.set(def.componentParams.anchorX, def.componentParams.anchorY);
                    node = new Node({ component: effect, endTime: t + (def.duration) * 1000 });
                    this._elements.add(node);
                    effect.x = this._x;
                    effect.y = this._y;
                    effect.rotation = this._rotation + Rnd.float(def.rotationMin, def.rotationMax);
                    if (this.__on.effectSpawned.__hasCallback) {
                        this.__on.effectSpawned.dispatch(EffectSequenceComponentType.Sprite, effect);
                    }
                    break;
                case EffectSequenceComponentType.MovieClip:
                    effect = fx.__getMovieClip(def.componentId);
                    if (def.componentParams.loop) {
                        effect.animationSpeed = Rnd.float(def.componentParams.animationSpeedMin || 1, def.componentParams.animationSpeedMax || 1);
                        effect.loop = def.componentParams.loop || false;
                    }
                    else {
                        const speed = def.duration;
                    }
                    effect.anchor.set(def.componentParams.anchorX, def.componentParams.anchorY);
                    effect.gotoAndPlay(0);
                    container = fx.__containers[def.containerId] || this.container;
                    container.addChild(effect);
                    effect.blendMode = fx.useBlendModes ? def.blendMode : 0;
                    effect.tint = def.tint;
                    effect.scale.set(Rnd.float(def.scaleMin, def.scaleMax) * Rnd.float(this.settings.scaleMin, this.settings.scaleMax) * this._scaleMod);
                    effect.alpha = Rnd.float(def.alphaMin, def.alphaMax);
                    node = new Node({ component: effect, endTime: t + (def.duration) * 1000 });
                    this._elements.add(node);
                    effect.x = this._x;
                    effect.y = this._y;
                    effect.rotation = this._rotation + Rnd.float(def.rotationMin, def.rotationMax);
                    if (this.__on.effectSpawned.__hasCallback) {
                        this.__on.effectSpawned.dispatch(EffectSequenceComponentType.MovieClip, effect);
                    }
                    break;
                case EffectSequenceComponentType.Emitter:
                    effect = fx.getParticleEmitterById(def.componentId);
                    container = fx.__containers[def.containerId] || this.container;
                    effect.init(container, true, Rnd.float(def.scaleMin, def.scaleMax) * Rnd.float(this.settings.scaleMin, this.settings.scaleMax) * this._scaleMod);
                    node = new Node({ component: effect, endTime: effect.endTime });
                    this._elements.add(node);
                    effect.x = this._x;
                    effect.y = this._y;
                    effect.rotation = this._rotation + effect.settings.rotation;
                    if (this.__on.effectSpawned.__hasCallback) {
                        this.__on.effectSpawned.dispatch(EffectSequenceComponentType.Emitter, effect);
                    }
                    break;
                case EffectSequenceComponentType.Trigger:
                    if (this.__on.triggerActivated.__hasCallback) {
                        this.__on.triggerActivated.dispatch(def.triggerValue);
                    }
                    break;
            }
            if (this._index == this._list.length) {
                this.exhausted = true;
                if (this.__on.exhausted.__hasCallback) {
                    this.__on.exhausted.dispatch(this);
                }
            }
            else {
                this.setNextEffect();
            }
        }
        const list = this._elements;
        let node = list.first;
        while (node) {
            node.update(dt);
            if (t > node.data.endTime) {
                const component = node.data.component;
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
            if (this.__on.completed.__hasCallback) {
                this.__on.completed.dispatch(this);
            }
            this.recycle();
        }
    }
    stop() {
        this.recycle();
    }
    recycle() {
        if (this.__recycled)
            return;
        const list = this._elements;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.data.component.recycle();
            node = next;
        }
        const on = this.__on;
        if (on.completed.__hasCallback)
            on.completed.removeAll();
        if (on.started.__hasCallback)
            on.started.removeAll();
        if (on.exhausted.__hasCallback)
            on.exhausted.removeAll();
        if (on.effectSpawned.__hasCallback)
            on.effectSpawned.removeAll();
        if (on.triggerActivated.__hasCallback)
            on.triggerActivated.removeAll();
        list.clear();
        this.__recycled = true;
        this._x = this._y = this._rotation = 0;
        this.__fx.effectSequenceCount--;
        this.__fx.__recycleEffectSequence(this);
    }
    dispose() {
        this._elements.clear();
        this.__fx = undefined;
        const on = this.__on;
        on.completed = on.started = on.exhausted = on.effectSpawned = on.triggerActivated = undefined;
    }
    set rotation(value) {
        this._rotation = value;
        const list = this._elements;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.data.rotation = value;
            node = next;
        }
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
        const list = this._elements;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.data.x = value;
            node = next;
        }
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
        const list = this._elements;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.data.y = value;
            node = next;
        }
    }
    get rotation() {
        return this._rotation;
    }
    get on() {
        return this.__on;
    }
    // *********************************************************************************************
    // * Private																		           *                              		   
    // *********************************************************************************************
    setNextEffect() {
        if (this.exhausted)
            return;
        const def = this._nextEffectSettings = this._list[this._index++];
        this._effectStartTime = this._startTime + def.delay * 1000;
    }
    // *********************************************************************************************
    // * Internal																		           *                              		   
    // *********************************************************************************************
    __applySettings(value) {
        this.settings = value;
        this.name = value.name;
        this._list = value.effects.slice();
        this.__recycled = false;
    }
}
//# sourceMappingURL=EffectSequence.js.map