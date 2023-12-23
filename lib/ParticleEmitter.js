/// <reference types="pixi.js" />
import { BaseEffect } from "./BaseEffect";
import { LinkedList } from "./util/LinkedList";
import { Rnd } from "./util/Rnd";
import { FXSignal } from "./util/FXSignal";
export class ParticleEmitter extends BaseEffect {
    constructor(componentId) {
        super(componentId);
        this.targetOffset = 0;
        this.autoRecycleOnComplete = true;
        this._particles = new LinkedList();
        this._particleCount = 0;
        this._childEmitters = [];
        this._hasChildEmitters = false;
        this._paused = false;
        this.__adoptRotation = false;
        this.__on = {
            started: new FXSignal(),
            completed: new FXSignal(),
            exhausted: new FXSignal(),
            particleUpdated: new FXSignal(),
            particleSpawned: new FXSignal(),
            particleBounced: new FXSignal(),
            particleDied: new FXSignal()
        };
    }
    // *********************************************************************************************
    // * Public																                                        					   *
    // *********************************************************************************************
    init(container, autoStart = true, scaleMod = 1) {
        this.container = container;
        this.core.__scaleMod = this._scaleMod = scaleMod;
        if (autoStart)
            this.start();
        return this;
    }
    start() {
        if (this._active)
            return;
        const t = Date.now();
        const s = this.settings;
        const RX = this.__fx;
        RX.emitterCount++;
        this.infinite = s.infinite;
        this._time = Number.MAX_VALUE;
        if (s.duration > 0) {
            this.endTime = t + s.duration * 1000;
        }
        else {
            this.endTime = s.duration;
        }
        this._nextSpawnTime = 0;
        this._particleCount = 0;
        this._active = true;
        this.exhausted = this.completed = false;
        RX.__addActiveEffect(this);
        let l = s.childs.length;
        this._hasChildEmitters = l > 0;
        if (this._hasChildEmitters) {
            while (--l > -1) {
                const def = s.childs[l];
                const em = RX.getParticleEmitterById(def.id);
                const container = RX.__containers[em.settings.containerId] || this.container;
                em.init(container, true, (def.scale || 1) * (this._scaleMod || 1));
                if (def.adoptRotation) {
                    em.rotation = this._rotation;
                    em.__adoptRotation = true;
                }
                em.__parent = this;
                this._childEmitters.push(em);
            }
        }
        this.rotation = this._rotation;
        if (this.__on.started.__hasCallback) {
            this.__on.started.dispatch(this);
        }
        return this;
    }
    stop(waitForParticles = true) {
        if (waitForParticles) {
            this.exhausted = true;
            if (this._hasChildEmitters) {
                this.stopChildEmitters(true);
            }
        }
        else {
            if (this.__on.completed.__hasCallback) {
                this.__on.completed.dispatch(this);
            }
            if (this.autoRecycleOnComplete) {
                this.recycle();
            }
            else {
                this.recycleParticles();
                this.completed = true;
                this._active = false;
                this.__fx.__removeActiveEffect(this);
            }
        }
    }
    update(dt) {
        if (!this._active)
            return;
        const t = Date.now();
        if (!this.exhausted) {
            if (this.settings.autoRotation !== 0) {
                this.rotation += this.settings.autoRotation * (dt / 0.016666);
            }
            if (this.target) {
                this.rotation = this.target.rotation;
                if (this.targetOffset == 0) {
                    this.x = this.target.x;
                    this.y = this.target.y;
                }
                else {
                    this.x = this.target.x + Math.cos(this._rotation) * this.targetOffset;
                    this.y = this.target.y + Math.sin(this._rotation) * this.targetOffset;
                }
            }
            if (this.endTime == 0 && !this.infinite) {
                this.spawn();
                this.exhausted = true;
            }
            else if (this.infinite || t < this.endTime) {
                this._time += dt;
                if (this._time >= this._nextSpawnTime) {
                    this._time = 0;
                    this.spawn();
                    this._nextSpawnTime = this._time + Rnd.float(this.settings.spawnFrequencyMin, this.settings.spawnFrequencyMax);
                }
            }
            else {
                this.exhausted = true;
                if (this.__on.exhausted.__hasCallback) {
                    this.__on.exhausted.dispatch(this);
                }
            }
        }
        else {
            if (this._particleCount == 0) {
                this._active = false;
                this.completed = true;
                if (this.__on.completed.__hasCallback) {
                    this.__on.completed.dispatch(this);
                }
                this.__fx.__removeActiveEffect(this);
                if (this.autoRecycleOnComplete)
                    this.recycle();
            }
        }
        const list = this._particles;
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
        if (this._paused)
            return;
        const s = this.settings;
        const fx = this.__fx;
        let n = Rnd.integer(s.spawnCountMin, s.spawnCountMax) * fx.particleFac;
        this.core.prepare(n);
        while (--n > -1) {
            if (this._particleCount >= s.maxParticles || fx.particleCount >= fx.maxParticles)
                return;
            const ps = s.particleSettings;
            const p = fx.__getParticle();
            let component;
            switch (ps.componentType) {
                case 0:
                    p.componentId = ps.componentId;
                    component = fx.__getSprite(p.componentId);
                    break;
                case 1:
                    p.componentId = ps.componentId;
                    component = fx.__getMovieClip(p.componentId);
                    if (ps.componentParams) {
                        component.loop = ps.componentParams.loop == null || !ps.componentParams.loop ? false : true;
                        component.animationSpeed = Rnd.float(ps.componentParams.animationSpeedMin || 1, ps.componentParams.animationSpeedMax || 1);
                    }
                    component.gotoAndPlay(0);
                    break;
            }
            component.anchor.set(ps.componentParams.anchorX, ps.componentParams.anchorY);
            p.component = component;
            this.core.emit(p);
            p.init(this, ps, this._scaleMod);
            this._particles.add(p);
            this._particleCount++;
            fx.particleCount++;
        }
        this.core.step();
        this._nextSpawnTime = Rnd.float(s.spawnFrequencyMin, s.spawnFrequencyMax);
        return this;
    }
    recycle() {
        if (this.__recycled)
            return;
        if (this.__parent) {
            this.__parent.__removeChildEmitter(this);
            this.__parent = null;
        }
        this.recycleParticles();
        this.settings = null;
        this._active = false;
        this._paused = false;
        this.completed = true;
        this._x = this._y = this._rotation = 0;
        if (this._hasChildEmitters) {
            this.stopChildEmitters(true);
            this._childEmitters.length = 0;
            this._hasChildEmitters = false;
        }
        this.__fx.emitterCount--;
        this.__fx.__recycleEmitter(this);
        this.__recycled = true;
        this.__adoptRotation = false;
        this.core = null;
        this.target = null;
        this.name = null;
        const on = this.__on;
        if (on.completed.__hasCallback)
            on.completed.removeAll();
        if (on.started.__hasCallback)
            on.started.removeAll();
        if (on.exhausted.__hasCallback)
            on.exhausted.removeAll();
        if (on.particleBounced.__hasCallback)
            on.particleBounced.removeAll();
        if (on.particleDied.__hasCallback)
            on.particleDied.removeAll();
        if (on.particleSpawned.__hasCallback)
            on.particleSpawned.removeAll();
        if (on.particleUpdated.__hasCallback)
            on.particleUpdated.removeAll();
    }
    dispose() {
        const list = this._particles;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.recycle();
            node = next;
        }
        list.clear();
        this.__recycled = true;
        if (this._hasChildEmitters) {
            this.stopChildEmitters(false);
        }
        this.__fx.particleCount -= this._particleCount;
        this._particles = null;
        this.componentId = null;
        this.settings = null;
        this._active = false;
        this.completed = true;
        this._childEmitters = null;
        if (this.core) {
            this.core.dispose();
        }
        this.core = null;
        this.target = null;
        this.name = null;
        const on = this.__on;
        on.completed.removeAll();
        on.started.removeAll();
        on.exhausted.removeAll();
        on.particleBounced.removeAll();
        on.particleDied.removeAll();
        on.particleSpawned.removeAll();
        on.particleUpdated.removeAll();
        this.__parent = null;
        this.__fx.__removeActiveEffect(this);
        this.__fx = null;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = this.core.x = value;
        if (!this._xPosIntialized) {
            this.core.__x = value;
            this._xPosIntialized = true;
        }
        if (this._hasChildEmitters) {
            const childs = this._childEmitters;
            let l = childs.length;
            while (--l > -1) {
                childs[l].x = value;
            }
        }
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = this.core.y = value;
        if (!this._yPosIntialized) {
            this.core.__y = value;
            this._yPosIntialized = true;
        }
        if (this._hasChildEmitters) {
            const childs = this._childEmitters;
            let l = childs.length;
            while (--l > -1) {
                childs[l].y = value;
            }
        }
    }
    set rotation(value) {
        this._rotation = this.core.rotation = value;
        if (this._hasChildEmitters) {
            const childs = this._childEmitters;
            let l = childs.length;
            while (--l > -1) {
                const child = childs[l];
                if (child.__adoptRotation) {
                    child.rotation = child.settings.rotation + value;
                }
            }
        }
    }
    get rotation() {
        return this._rotation;
    }
    get paused() {
        return this._paused;
    }
    set paused(value) {
        this._paused = value;
        if (this._hasChildEmitters) {
            const childs = this._childEmitters;
            let l = childs.length;
            while (--l > -1) {
                childs[l].paused = value;
            }
        }
    }
    get on() {
        return this.__on;
    }
    // *********************************************************************************************
    // * Private																				                                           *
    // *********************************************************************************************
    recycleParticles() {
        let node = this._particles.first;
        let next;
        while (node) {
            next = node.next;
            node.recycle();
            node = next;
        }
        this._particles.clear();
        this.__fx.particleCount -= this._particleCount;
    }
    stopChildEmitters(waitForParticles) {
        const childs = this._childEmitters;
        let l = childs.length;
        while (--l > -1) {
            childs[l].stop(waitForParticles);
        }
    }
    // *********************************************************************************************
    // * Internal																				                                           *
    // *********************************************************************************************
    __removeParticle(particle) {
        if (particle.useSpawns && this._spawnOnComplete) {
            this.__subSpawn(particle, this.settings.particleSettings.spawn.onComplete);
        }
        this._particles.remove(particle);
        this._particleCount--;
        this.__fx.particleCount--;
        particle.recycle();
    }
    __removeChildEmitter(emitter) {
        const index = this._childEmitters.indexOf(emitter);
        if (index > -1) {
            this._childEmitters.splice(index, 1);
            if (this._childEmitters.length == 0)
                this._hasChildEmitters = false;
        }
    }
    __subSpawn(particle, list) {
        const fx = this.__fx;
        if (list) {
            let l = list.length;
            while (--l > -1) {
                const def = list[l];
                let component;
                let container;
                switch (def.type) {
                    case 0:
                        component = fx.getParticleEmitterById(def.id);
                        container = fx.__containers[component.settings.containerId] || this.container;
                        component.init(container, true, (def.scale || 1) * this._scaleMod);
                        if (def.adoptRotation) {
                            component.rotation = particle.component.rotation + component.settings.rotation;
                            component.__adoptRotation = true;
                        }
                        else {
                            component.rotation = component.settings.rotation;
                        }
                        break;
                    case 1:
                        component = fx.getEffectSequenceById(def.id);
                        container = fx.__containers[component.settings.containerId] || this.container;
                        component.init(container, 0, true, (def.scale || 1) * this._scaleMod);
                        if (def.adoptRotation) {
                            component.rotation = particle.component.rotation;
                        }
                        break;
                }
                component.x = particle.component.x;
                component.y = particle.component.y;
            }
        }
    }
    __applySettings(value) {
        const fx = this.__fx;
        this.__recycled = this._xPosIntialized = this._yPosIntialized = false;
        this.settings = value;
        this.core = fx.__getEmitterCore(value.core.type, this);
        this.core.init(this);
        this.rotation = value.rotation;
        this.name = value.name;
        this._spawnOnComplete = value.particleSettings.spawn.onComplete.length > 0;
        this._childEmitters.length = 0;
    }
    __setCore(type) {
        this.core = this.__fx.__getEmitterCore(type, this);
        this.core.init(this);
        this.core.__scaleMod = this._scaleMod;
        this._xPosIntialized = this._yPosIntialized = false;
    }
}
//# sourceMappingURL=ParticleEmitter.js.map