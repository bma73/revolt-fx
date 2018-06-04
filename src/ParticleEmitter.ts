

import {BaseEmitterCore} from "./core/BaseEmitterCore";
import {IEmitterSettings, RevoltEffects, ComponentType} from "./RevoltEffects";
import {Particle} from "./Particle";
import {LinkedList, Node} from "./util/LinkedList";
import {Rnd} from "./util/Rnd";
import {BaseEffect} from "./BaseEffect";

export class ParticleEmitter extends BaseEffect {

    public parent: any;

    public settings: IEmitterSettings;

    private _particles: LinkedList = new LinkedList();

    private _particleCount: number = 0;
    private _maxParticles: number;

    private _core: BaseEmitterCore;


    constructor(componentId: string) {
        super(componentId);
    }

    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    public init(container: PIXI.Container, autoStart: boolean = true): ParticleEmitter {
        this.container = container;
        if (autoStart) this.start();
        return this;
    }

    public start(): ParticleEmitter {
        if (this._active) return;
        let t = Date.now();
        let s = this.settings;

        this._time = Number.MAX_VALUE;
        if (s.duration > 0) {
            this.endTime = t + s.duration * 1000;
        } else {
            this.endTime = s.duration;
        }
        this._maxParticles = s.maxParticles;

        this._active = true;
        this.exhausted = this.completed = false;
        RevoltEffects.instance.__addActiveEffect(this);

        if (this.onStart) this.onStart(this);


        return this;
    }

    public stop(waitForParticles: boolean = true) {
        if (waitForParticles) {
            this.exhausted = true;
        } else {
            this.recycle();
        }
    }

    public update(dt: number): ParticleEmitter {
        // if (this.componentId == 'blast') console.log('update', this);
        if (!this._active) return;
        let t = Date.now();

        if (!this.exhausted) {
            if (this.endTime == 0) {
                this.spawn();
                this.exhausted = true;
            } else if (this.endTime == -1 || t < this.endTime) {
                this._time += dt;
                if (this._time >= this.settings.spawnFrequency) {
                    this._time = 0;
                    this.spawn();
                }
            } else {
                this.exhausted = true;
                if (this.onExhaust) this.onExhaust(this);
            }
        }

        let list = this._particles;
        let node = <Particle>list.first;
        let next;
        while (node) {
            next = <Particle>node.next;
            node.update(dt);
            node = next;
        }
        return this;
    }

    public spawn(): ParticleEmitter {
        let s = this.settings;

        let n = s.spawnCount;

        this._core.prepare();

        let RE = RevoltEffects.instance;

        while (--n > -1) {
            if (this._particleCount == this._maxParticles) return;

            let ps = s.particleSettings,
                p = <Particle>RE.__getParticle(),
                component: any;

            switch (s.particleSettings.componentType) {
                case ComponentType.Sprite:
                    p.componentId = <string>s.particleSettings.componentId;
                    component = RE.getSprite(p.componentId);
                    break;

                case ComponentType.MovieClip:
                    p.componentId = <string>s.particleSettings.componentId;
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

    public recycle() {
        let list = this._particles;
        let node = <Particle>list.first;
        let next;
        while (node) {
            next = <Particle>node.next;
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

    public dispose() {
        let list = this._particles;
        let node = <Particle>list.first;
        let next;
        while (node) {
            next = <Particle>node.next;
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

    public get maxParticles(): number {
        return this._maxParticles;
    }

    public set maxParticles(value: number) {
        this._maxParticles = value;
    }

    public get core(): BaseEmitterCore {
        return this._core;
    }

    public set core(value: BaseEmitterCore) {
        this._core = value;
        this.core.x = this._x;
        this.core.y = this._x;
        this.core.rotation = this._rotation;
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: number) {
        this._y = this._core.y = value;
    }

    public get x(): number {
        return this._x;
    }

    public set x(value: number) {
        this._x = this._core.x = value;
    }

    public set rotation(value: number) {
        this._rotation = this._core.rotation = value;
    }

    public get rotation(): number {
        return this._rotation;
    }

    // *********************************************************************************************
    // * Internal																				   *
    // *********************************************************************************************
    public __removeParticle(particle: Particle) {

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
            if (this.onComplete) this.onComplete(this);
            this.recycle();
        }
    }

    public __applySettings(value: IEmitterSettings) {
        this.settings = value;
        this.core = new value.core.clazz(...[this, value.core.params]);
    }

    // *********************************************************************************************
    // * Private																				   *
    // *********************************************************************************************

    // *********************************************************************************************
    // * Events																					   *
    // *********************************************************************************************
}
