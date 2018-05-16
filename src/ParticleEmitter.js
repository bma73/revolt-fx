import { RevoltEffects, ComponentType } from "./RevoltEffects";
import { LinkedList } from "./util/LinkedList";
import { Rnd } from "./util/Rnd";
import { BaseEffect } from "./BaseEffect";
export class ParticleEmitter extends BaseEffect {
    constructor(componentId) {
        super(componentId);
        this._particles = new LinkedList();
        this._particleCount = 0;
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
        let t = Date.now();
        let s = this.settings;
        this._time = Number.MAX_VALUE;
        if (s.duration > 0) {
            this.endTime = t + s.duration * 1000;
        }
        else {
            this.endTime = s.duration;
        }
        this._maxParticles = s.maxParticles;
        this._active = true;
        this.exhausted = this.completed = false;
        RevoltEffects.instance.__addActiveEffect(this);
        if (this.onStart)
            this.onStart(this);
        return this;
    }
    stop(waitForParticles = true) {
        if (waitForParticles) {
            this.exhausted = true;
        }
        else {
            this.recycle();
        }
    }
    update(dt) {
        // if (this.componentId == 'blast') console.log('update', this);
        if (!this._active)
            return;
        let t = Date.now();
        if (!this.exhausted) {
            if (this.endTime == 0) {
                this.spawn();
                this.exhausted = true;
            }
            else if (this.endTime == -1 || t < this.endTime) {
                this._time += dt;
                if (this._time >= this.settings.spawnFrequency) {
                    this._time = 0;
                    this.spawn();
                }
            }
            else {
                this.exhausted = true;
                if (this.onExhaust)
                    this.onExhaust(this);
            }
        }
        let list = this._particles;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.update(dt);
            node = next;
        }
        return this;
    }
    spawn() {
        let s = this.settings;
        let n = s.spawnCount;
        this._core.prepare();
        let RE = RevoltEffects.instance;
        while (--n > -1) {
            if (this._particleCount == this._maxParticles)
                return;
            let ps = s.particleSettings, p = RE.__getParticle(), component;
            switch (s.particleSettings.componentType) {
                case ComponentType.Sprite:
                    p.componentId = s.particleSettings.componentId;
                    component = RE.getSprite(p.componentId);
                    break;
                case ComponentType.MovieClip:
                    p.componentId = s.particleSettings.componentId;
                    component = RE.getMovieClip(p.componentId);
                    if (ps.componentParams) {
                        component.loop = ps.componentParams.loop == null || !ps.componentParams.loop ? false : true;
                        component.animationSpeed = Rnd.float(ps.componentParams.animationSpeedMin || 1, ps.componentParams.animationSpeedMax || 1);
                    }
                    component.gotoAndPlay(0);
                    break;
            }
            p.component = component;
            this._core.emit(p);
            p.init(this, ps);
            this._particles.add(p);
            this._particleCount++;
            RE.particleCount++;
        }
        this._core.step();
        return this;
    }
    recycle() {
        let list = this._particles;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.recycle();
            node = next;
        }
        list.clear();
        this.settings = null;
        this._active = false;
        this.completed = true;
        this._core.dispose();
        this._core = null;
        RevoltEffects.instance.__recycleEffect(this);
    }
    dispose() {
        let list = this._particles;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.recycle();
            node = next;
        }
        list.clear();
        this.componentId = null;
        this.settings = null;
        this._active = false;
        this.completed = true;
        this._core.dispose();
        this._core = null;
        this.onComplete = this.onStart = this.onExhaust = null;
    }
    get maxParticles() {
        return this._maxParticles;
    }
    set maxParticles(value) {
        this._maxParticles = value;
    }
    get core() {
        return this._core;
    }
    set core(value) {
        this._core = value;
        this.core.x = this._x;
        this.core.y = this._x;
        this.core.rotation = this._rotation;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = this._core.y = value;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = this._core.x = value;
    }
    set rotation(value) {
        this._rotation = this._core.rotation = value;
    }
    get rotation() {
        return this._rotation;
    }
    // *********************************************************************************************
    // * Internal																				   *
    // *********************************************************************************************
    __removeParticle(particle) {
        if (particle.settings.spawnOnCompleteEmitterId) {
            let emitter = RevoltEffects.instance.getParticleEmitter(particle.settings.spawnOnCompleteEmitterId);
            emitter.init(this.container);
            emitter.x = particle.component.x;
            emitter.y = particle.component.y;
            emitter.rotation = particle.component.rotation;
        }
        this._particles.remove(particle);
        this._particleCount--;
        RevoltEffects.instance.particleCount--;
        particle.recycle();
        if (this.exhausted && this._particleCount == 0) {
            this._active = false;
            this.completed = true;
            if (this.onComplete)
                this.onComplete(this);
            this.recycle();
        }
    }
    __applySettings(value) {
        this.settings = value;
        this.core = new value.core.clazz(...[this, value.core.params]);
    }
}