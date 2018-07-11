/// <reference types="pixi.js" />

import {Node} from "./util/LinkedList";
import {IParticle, IParticleSettings, FX, IParticleEmitterParent} from "./FX";
import {Sprite} from "./Sprite";
import {IParticleEmitterSignals, ParticleEmitter} from "./ParticleEmitter";
import {Color} from "./util/Color";
import {Easing} from "./util/Easing";
import {Rnd} from "./util/Rnd";
import {MovieClip} from "./MovieClip";
import {FXSignal} from "./util/FXSignal";

export interface IParticleSignals {
    died: FXSignal;
    bounced: FXSignal;
    updated: FXSignal;
}


export class Particle extends Node implements IParticle, IParticleEmitterParent {

    public component: Sprite | MovieClip;
    public duration: number;

    public distance: number;
    public startX: number;
    public startY: number;
    public deltaX: number;
    public deltaY: number;
    public distanceEase: Function;

    public useFadeIn: boolean;
    public fadeInEase: Function;
    public fadeInDuration: number;

    public alphaStart: number;
    public alphaDelta: number;
    public alphaEase: Function;
    public alphaDuration: number;

    public useTint: boolean;
    public tintStart: number;
    public tintEnd: number;
    public tintEase: Function;

    public useMotion: boolean;
    public useScale: boolean;
    public useAlpha: boolean;
    public useSpawns: boolean;
    public useChilds: boolean;

    public uniformScale: boolean;

    public useScaleIn: boolean;
    public scaleInEase: Function;
    public scaleInDuration: number;

    public scaleStart: number;
    public scaleDelta: number;
    public scaleEase: Function;
    public scaleDuration: number;

    public scaleXStart: number;
    public scaleXDelta: number;
    public scaleXEase: Function;
    public scaleXDuration: number;

    public scaleYStart: number;
    public scaleYDelta: number;
    public scaleYEase: Function;
    public scaleYDuration: number;

    public useRotation: boolean;
    public rotationSpeed: number;
    public rotationEnd: number;

    public useGravity: boolean;
    public gravity: number;
    public moveSpeedX: number;
    public moveSpeedY: number;
    public useFloor: boolean;
    public floorY: number;
    public bounceFac: number;
    public friction: number;
    public useAlign: boolean;

    public dx: number = 0;
    public dy: number = 0;

    public emitter: ParticleEmitter;

    public settings: IParticleSettings;

    public componentId: string;

    public time: number;

    private _color: Color;
    private _dt: number;

    private _spawnOnBounce: Boolean;

    private _childEmitters: ParticleEmitter[] = [];
    private _hasChildEmitters: boolean = false;
    private _spawnOnHalfway: boolean = false;

    public __recycled: boolean = true;
    public __fx: FX;
    public __parent: IParticleEmitterParent;
    public __on: IParticleSignals = {
        died: new FXSignal(),
        bounced: new FXSignal(),
        updated: new FXSignal()
    };

    constructor() {
        super();
        this._color = new Color();
    }

    // *********************************************************************************************
    // * Public																	                                        				   *
    // *********************************************************************************************

    public init(emitter: ParticleEmitter, settings: IParticleSettings, scaleMod?: number): IParticle {

        const component = this.component;
        const transform = <PIXI.Transform>component.transform;
        const fx = this.__fx;

        this.emitter = emitter;
        this.settings = settings;
        const duration = this.duration = Rnd.float(settings.durationMin, settings.durationMax) * scaleMod;

        this._dt = 1 / this.duration;
        this.time = 0;
        this.__recycled = false;

        settings.addOnTop ? emitter.container.addChild(component) : emitter.container.addChildAt(component, 0);

        component.blendMode = fx.useBlendModes ? (settings.blendMode) : 0;

        this.startX = transform.position.x;
        this.startY = transform.position.y;

        this.useGravity = emitter.settings.useGravity;
        this.useScale = settings.useScale;
        this.useRotation = settings.useRotation;
        this.useAlpha = settings.useAlpha;
        this.useTint = settings.useTint;
        this.useSpawns = settings.useSpawns;
        this.useChilds = settings.useChilds;
        this.useMotion = settings.useMotion;

        if (this.useGravity) {
            this.gravity = emitter.settings.gravity;
            this.useFloor = emitter.settings.useFloor;
            this.floorY = emitter.settings.floorY;
            this.bounceFac = Rnd.float(settings.bounceFacMin, settings.bounceFacMax) * scaleMod;
            this.friction = 1 - Rnd.float(settings.frictionMin, settings.frictionMax) * scaleMod;
            this._spawnOnBounce = settings.spawn.onBounce.length > 0;
            this.useAlign = settings.align;
            if (settings.useMotion) {
                const speed = Rnd.float(settings.moveSpeedMin, settings.moveSpeedMax);
                this.moveSpeedX = speed * this.dx * scaleMod;
                this.moveSpeedY = speed * this.dy * scaleMod;
            } else {
                this.moveSpeedX = this.moveSpeedY = 0;
            }

        } else {
            if (settings.useMotion) {
                const d = this.distance = Rnd.integer(settings.distanceMin, settings.distanceMax) * 0.8 * scaleMod;
                this.deltaX = ((transform.position.x + d * this.dx) - this.startX) * 0.8;
                this.deltaY = ((transform.position.y + d * this.dy) - this.startY) * 0.8;
                this.distanceEase = Easing[settings.distanceEase];
                this.useAlign = false;
            } else {
                transform.position.x = this.startX;
                transform.position.y = this.startY;
            }
        }


        if (settings.useRotation && settings.randomStartRotation && !this.useAlign) {
            transform.rotation = Rnd.float(0, 6.28319);
        }

        if (settings.useAlpha) {
            this.alphaStart = component.alpha = Rnd.float(settings.alphaStartMin, settings.alphaStartMax);
            this.alphaDelta = Rnd.float(settings.alphaEndMin, settings.alphaEndMax) - this.alphaStart;
            this.alphaEase = Easing[settings.alphaEase] || null;

            this.useFadeIn = settings.fadeIn;
            if (settings.fadeIn) {
                this.alphaDuration = duration * (1 - settings.fadeInDurationFac);
                this.fadeInDuration = duration * settings.fadeInDurationFac;
                this.fadeInEase = Easing[settings.fadeInEase || 'easeInSine'];
            }
        }


        if (settings.useScale) {
            this.uniformScale = settings.uniformScale;
            this.useScaleIn = settings.scaleIn;

            if (settings.useScale) {
                this.uniformScale = settings.uniformScale;
                this.scaleEase = Easing[settings.scaleEase];

                if (settings.uniformScale) {
                    this.scaleStart = transform.scale.x = transform.scale.y = Rnd.float(settings.scaleStartMin, settings.scaleStartMax) * scaleMod;
                    this.scaleDelta = (Rnd.float(settings.scaleEndMin, settings.scaleEndMax) - this.scaleStart) * scaleMod;
                } else {
                    this.scaleXStart = transform.scale.x = Rnd.float(settings.scaleXStartMin, settings.scaleXStartMax) * scaleMod;
                    this.scaleXDelta = (Rnd.float(settings.scaleXEndMin, settings.scaleXEndMax) - this.scaleXStart) * scaleMod;
                    this.scaleXEase = Easing[settings.scaleXEase];
                    this.scaleYStart = transform.scale.y = Rnd.float(settings.scaleYStartMin, settings.scaleYStartMax) * scaleMod;
                    this.scaleYDelta = (Rnd.float(settings.scaleYEndMin, settings.scaleYEndMax) - this.scaleYStart) * scaleMod;
                    this.scaleYEase = Easing[settings.scaleYEase];
                }

                if (settings.scaleIn) {
                    this.scaleDuration = duration * (1 - settings.scaleInDurationFac);
                    this.scaleInDuration = duration * settings.scaleInDurationFac;
                    this.scaleInEase = Easing[settings.scaleInEase || 'easeInSine'];
                }

            } else {
                if (settings.uniformScale) {
                    transform.scale.x = settings.scaleStartMin;
                    transform.scale.y = settings.scaleStartMin;
                } else {
                    transform.scale.x = settings.scaleXStartMin;
                    transform.scale.y = settings.scaleYStartMin;
                }
            }
        }


        if (settings.useRotation) {
            this.rotationSpeed = Rnd.float(settings.rotationSpeedMin, settings.rotationSpeedMax) * scaleMod;
            if (settings.randomRotationDirection) this.rotationSpeed *= Rnd.sign();
        }

        if (settings.useTint) {
            this.tintEase = Easing[settings.tintEase];
            this._color.setRgb(settings.tintStart, settings.tintEnd);
        }

        if (settings.useChilds) {
            this._childEmitters.length = 0;
            let l = settings.childs.length;
            this._hasChildEmitters = l > 0;
            if (this._childEmitters) {
                while (--l > -1) {
                    const def = settings.childs[l];
                    const em = fx.getParticleEmitterById(def.id);
                    em.init(emitter.container, true, (def.scale || 1) * (scaleMod || 1));
                    if (def.adoptRotation) {
                        em.rotation = transform.rotation;
                        em.__adoptRotation = true;
                    }
                    em.__parent = this;
                    this._childEmitters.push(em);
                }
            }
        }

        if (settings.useSpawns) {

            if (settings.spawn.onStart.length > 0) {
                emitter.__subSpawn(this, settings.spawn.onStart);
            }
            this._spawnOnHalfway = settings.spawn.onHalfway.length > 0;
        }

        if (emitter.__on.particleSpawned.__hasCallback) {
            emitter.__on.particleSpawned.dispatch(this);
        }

        return this;
    }

    public update(dt: number) {

        const t = this.time += dt;
        const duration = this.duration;

        if (t >= duration) {
            this.emitter.__removeParticle(this);
            return;
        }

        const component = this.component;
        const transform = <PIXI.Transform>component.transform;
        const mod = t * dt;

        //Motion
        if (this.useGravity) {
            const dt2 = dt / 0.0166666;
            transform.position.x += this.moveSpeedX * dt2;
            transform.position.y += this.moveSpeedY * dt2;
            this.moveSpeedY += this.gravity * dt2;

            if (this.useAlign) {
                transform.rotation = Math.atan2(this.moveSpeedY, this.moveSpeedX);
            }

            if (this.useFloor && this.floorY > 0) {
                if (transform.position.y > this.floorY) {
                    transform.position.y = this.floorY;
                    this.moveSpeedY *= -this.bounceFac;
                    this.moveSpeedX *= this.friction;

                    if (this.useSpawns && this._spawnOnBounce) {
                        this.emitter.__subSpawn(this, this.settings.spawn.onBounce);
                    }

                    const emitter = this.emitter;
                    if (emitter.__on.particleBounced.__hasCallback) {
                        emitter.__on.particleBounced.dispatch(this);
                    }
                    if (this.__on.bounced.__hasCallback) {
                        this.__on.bounced.dispatch(this);
                    }

                    if (this.settings.stopOnBounce) {
                        emitter.__removeParticle(this);
                    }
                    return;
                }
            }
        } else if (this.useMotion) {
            if (this.distanceEase) {
                transform.position.x = this.distanceEase(t, this.startX, this.deltaX, duration);
                transform.position.y = this.distanceEase(t, this.startY, this.deltaY, duration);
            } else {
                transform.position.x = this.deltaX * mod + this.startX;
                transform.position.y = this.deltaY * mod + this.startY;
            }
        }

        //Alpha
        if (this.useAlpha) {
            if (this.useFadeIn) {
                if (t < this.fadeInDuration) {
                    component.alpha = this.fadeInEase(t, 0, this.alphaStart, this.fadeInDuration);
                } else {
                    component.alpha = this.alphaEase(t - this.fadeInDuration, this.alphaStart, this.alphaDelta, this.alphaDuration);
                }
            } else {
                if (this.alphaEase) {
                    component.alpha = this.alphaEase(t, this.alphaStart, this.alphaDelta, duration)
                } else {
                    component.alpha = (this.alphaDelta) * mod + this.alphaStart;
                }
            }
        }

        //Rotation
        if (this.useRotation) {
            transform.rotation += this.rotationSpeed;
        }

        //Scale
        if (this.useScale) {
            if (this.uniformScale) {
                if (this.useScaleIn) {
                    if (t < this.scaleInDuration) {
                        transform.scale.x = transform.scale.y = this.scaleInEase(t, 0, this.scaleStart, this.scaleInDuration);
                    } else {
                        transform.scale.x = transform.scale.y = this.scaleEase(t - this.scaleInDuration, this.scaleStart, this.scaleDelta, this.scaleDuration);
                    }
                } else {
                    if (this.scaleEase) {
                        transform.scale.x = this.scaleEase(t, this.scaleStart, this.scaleDelta, duration);
                        transform.scale.y = this.scaleEase(t, this.scaleStart, this.scaleDelta, duration)
                    } else {
                        transform.scale.x = transform.scale.y = this.scaleDelta * mod + this.scaleStart;
                    }
                }
            } else {
                if (this.useScaleIn) {
                    if (t < this.scaleInDuration) {
                        transform.scale.x = this.scaleInEase(t, 0, this.scaleXStart, this.scaleInDuration);
                        transform.scale.y = this.scaleInEase(t, 0, this.scaleYStart, this.scaleInDuration);
                    } else {
                        transform.scale.x = this.scaleEase(t - this.scaleInDuration, this.scaleXStart, this.scaleXDelta, this.scaleDuration);
                        transform.scale.y = this.scaleEase(t - this.scaleInDuration, this.scaleYStart, this.scaleYDelta, this.scaleDuration);
                    }
                } else {
                    if (this.scaleXEase) {
                        transform.scale.x = this.scaleXEase(t, this.scaleXStart, this.scaleXDelta, duration);
                    } else {
                        transform.scale.x = this.scaleXDelta * mod + this.scaleXStart;
                    }
                    if (this.scaleYEase) {
                        transform.scale.y = this.scaleYEase(t, this.scaleYStart, this.scaleYDelta, duration);
                    } else {
                        transform.scale.y = this.scaleYDelta * mod + this.scaleYStart;
                    }
                }
            }


        }

        //Tint
        if (this.useTint) {
            component.tint = this._color.tween(this.tintEase, t, duration);
        }

        //Spawn t = 0.5
        if (this._spawnOnHalfway) {
            if (t >= 0.5) {
                this._spawnOnHalfway = false;
                this.emitter.__subSpawn(this, this.settings.spawn.onHalfway);
            }
        }

        if (this.useChilds && this._hasChildEmitters) {
            const childs = this._childEmitters;
            let l = childs.length;
            while (--l > -1) {
                const child = childs[l];
                if (child.__recycled) continue;
                child.x = component.position.x;
                child.y = transform.position.y;
                if (child.__adoptRotation) {
                    child.rotation = transform.rotation;
                }
            }
        }

        if (this.emitter.__on.particleUpdated.__hasCallback) {
            this.emitter.__on.particleUpdated.dispatch(this);
        }
        if (this.__on.updated.__hasCallback) {
            this.__on.updated.dispatch(this);
        }
    }

    public stop() {
        this.time = this.duration;
    }

    public recycle() {

        if (this.emitter.__on.particleDied.__hasCallback) {
            this.emitter.__on.particleDied.dispatch(this);
        }

        const on = this.__on;
        if (on.died.__hasCallback) {
            on.died.dispatch(this);
            on.died.removeAll();
        }
        if (on.updated.__hasCallback) {
            on.updated.removeAll();
        }
        if (on.bounced.__hasCallback) {
            on.bounced.removeAll();
        }

        if (this._hasChildEmitters) {
            const childs = this._childEmitters;
            let l = childs.length;
            while (--l > -1) {
                childs[l].stop(true);
            }
            this._childEmitters.length = 0;
            this._hasChildEmitters = false;
        }


        this.component.recycle();
        this.__fx.__recycleParticle(this);
        this.dx = this.dy = this.deltaX = this.deltaY = 0;

        this.component = null;
        this.emitter = null;
        this.settings = null;

        this.__recycled = true;

    }

    public dispose() {
        this.recycle();
        this.__fx = null;
    }

    public get x(): number {
        return this.component.x;
    }

    public get y(): number {
        return this.component.y;
    }

    public get on(): IParticleSignals {
        return this.__on;
    }


    // *********************************************************************************************
    // * Internal																                                        				   *
    // *********************************************************************************************

    public __removeChildEmitter(emitter: ParticleEmitter) {
        const index = this._childEmitters.indexOf(emitter);
        if (index > -1) {
            this._childEmitters.splice(index, 1);
            if (this._childEmitters.length == 0) this._hasChildEmitters = false;
        }
    }

}
