/// <reference types="pixi.js" />
import * as PIXI from "pixi.js";
import { SpawnType } from "../FX";
import deepClone from "../util/DeepClone";
export class ABaseEmitter extends PIXI.Container {
    get emitter() { return this._emitter; }
    ;
    get settings() { return this._settings; }
    ;
    get x() {
        return super.x;
    }
    set x(value) {
        this._emitter.x = super.x = value;
    }
    get y() {
        return super.y;
    }
    set y(value) {
        this._emitter.y = super.y = value;
    }
    get rotation() {
        return super.rotation;
    }
    set rotation(value) {
        this._emitter.rotation = super.rotation = value;
    }
    set scale(value) {
        this._scale = value;
        this._emitter.scale.x = value.x;
        this._emitter.scale.y = value.y;
    }
    get scale() {
        return this._scale;
    }
    get childEmitters() { return this._childEmitters; }
    addChildEmitter(child, scale = 1, adoptRotation = true, containerId = '') {
        this._childEmitters.push(child);
        this._emitter.__addChildEmitter({
            id: '',
            type: SpawnType.ParticleEmitter,
            scale: scale,
            name: '',
            adoptRotation: adoptRotation,
            containerId: containerId,
            settings: child.settings,
        });
    }
    removeChildEmitter(child) {
        const index = this._childEmitters.indexOf(child);
        if (index > -1) {
            this._childEmitters.splice(index, 1);
        }
    }
    constructor(_fx) {
        super();
        this._fx = _fx;
        this._scale = new PIXI.ObservablePoint(this, 1, 1);
        this._initialized = false;
        this._childEmitters = [];
        this.addEventListener('added', () => {
            if (!this._initialized) {
                this._initialized = true;
                this._emitter.init(this.parent, true, 1);
            }
            this._emitter.paused = false;
        });
        this.addEventListener('removed', () => {
            this._emitter.paused = true;
        });
    }
    dispose() {
        this.removeAllListeners();
        this._emitter.recycle();
    }
    _onUpdate() {
        this.scale = this._scale;
    }
    init(textureComponentId, settings) {
        const s = deepClone(settings || _$settings);
        s.__isClone = true;
        this._settings = new Proxy(s, _traps);
        s.particleSettings.component.componentId = textureComponentId;
        this._emitter = this._fx.createParticleEmitterFrom(s);
    }
}
const _traps = {
    get(target, key) {
        if (typeof target[key] === 'object' && target[key] !== null) {
            return new Proxy(target[key], _traps);
        }
        return target[key];
    },
    set(target, prop, receiver) {
        target[prop] = receiver;
        return true;
    }
};
const _$settings = {
    "id": 0,
    "name": "$topsmoke",
    "core": {
        "type": "circle",
        "params": {
            "radius": 30,
            "radial": false,
            "angle": 6.28318530718,
            "uniform": false,
            "width": 100,
            "height": 100
        }
    },
    "spawnFrequencyMin": 0.04,
    "spawnFrequencyMax": 0.1,
    "maxParticles": 1000,
    "spawnCountMin": 5,
    "spawnCountMax": 7,
    "duration": 0,
    "infinite": true,
    "useGravity": false,
    "gravity": 0,
    "useFloor": false,
    "floorY": 0,
    "rotation": 0,
    "autoRotation": 0,
    "particleSettings": {
        "component": {
            "componentType": 0,
            "componentId": "",
            "componentParams": {
                "animationSpeedMin": 0.5,
                "animationSpeedMax": 0.8,
                "anchorX": 0.5,
                "anchorY": 0.5,
                "loop": false
            },
        },
        "scale": {
            "useScale": true,
            "scaleIn": false,
            "scaleInDurationFac": 0.2,
            "scaleInEase": "linear",
            "uniformScale": true,
            "scaleXStartMin": 1,
            "scaleXStartMax": 1,
            "scaleXEndMin": 1,
            "scaleXEndMax": 1,
            "scaleXEase": "linear",
            "scaleYStartMin": 1,
            "scaleYStartMax": 1,
            "scaleYEndMin": 1,
            "scaleYEndMax": 1,
            "scaleYEase": "linear",
            "scaleStartMin": 0.6,
            "scaleStartMax": 0.8,
            "scaleEndMin": 1,
            "scaleEndMax": 1,
            "scaleEase": "linear",
        },
        "alpha": {
            "useAlpha": true,
            "alphaStartMin": 0.6,
            "alphaStartMax": 0.9,
            "alphaEndMin": 0,
            "alphaEndMax": 0,
            "alphaEase": "linear",
        },
        "tint": {
            "useTint": true,
            "tintStart": 0xffffff,
            "tintEnd": 0x0,
            "tintEase": "easeOutSine",
        },
        "motion": {
            "useMotion": true,
            "distanceMin": 0,
            "distanceMax": 0,
            "distanceEase": "linear",
            "moveSpeedMin": 0,
            "moveSpeedMax": 0,
            "bounceFacMin": 0,
            "bounceFacMax": 0,
            "frictionMin": 0,
            "frictionMax": 0,
            "align": false,
        },
        "fade": {
            "fadeIn": true,
            "fadeInDurationFac": 0.2,
            "fadeInEase": "linear",
        },
        "rotation": {
            "useRotation": true,
            "rotationSpeedMin": 0.008726646259971648,
            "rotationSpeedMax": 0.03490658503988659,
            "randomRotationDirection": true,
            "randomStartRotation": true,
        },
        "durationMin": 1,
        "durationMax": 2,
        "useChilds": false,
        "useSpawns": false,
        "stopOnBounce": false,
        "blendMode": 0,
        "addOnTop": true,
        "childs": [],
        "spawn": {
            "onComplete": [],
            "onBounce": [],
            "onStart": [],
            "onHalfway": []
        }
    },
    "childs": [],
    "containerId": ""
};
//# sourceMappingURL=ABaseEmitter.js.map