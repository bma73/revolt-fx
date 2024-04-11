import { ComponentType } from "../ComponentType";
import { EmitterType } from "../core/EmitterType";
import { SpawnType } from "../FX";
import { EasingType } from "../util/Easing";
export class EmitterSettingsData {
    constructor(name) {
        this.name = name;
        this.__isClone = false;
        this.core = {
            type: EmitterType.Circle,
            params: {
                radius: 100,
                radial: true,
                angle: 6.28318530718,
                uniform: false,
                width: 100,
                height: 100
            }
        };
        this.spawnFrequencyMin = 0.1;
        this.spawnFrequencyMax = 0.1;
        this.maxParticles = 1000;
        this.spawnCountMin = 1;
        this.spawnCountMax = 1;
        this.duration = 0;
        this.infinite = true;
        this.useGravity = false;
        this.gravity = 0;
        this.useFloor = false;
        this.floorY = 0;
        this.rotation = 0;
        this.autoRotation = 0;
        this.containerId = '';
        this.id = name;
    }
}
export class EmitterSpawnData {
    constructor(name) {
        this.name = name;
        this.type = SpawnType.ParticleEmitter;
        this.scale = 1;
        this.adoptRotation = false;
        this.id = name;
    }
}
export class EmitterSpawnsData {
    constructor() {
        this.onStart = [];
        this.onHalfway = [];
        this.onBounce = [];
        this.onComplete = [];
    }
    [Symbol.iterator]() {
        return this[Symbol.iterator]();
    }
}
export class SpriteSettingsData {
    constructor(texture) {
        this.texture = texture;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }
}
export class MovieClipSettingsData {
    constructor(textures) {
        this.textures = textures;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }
}
export class CircleCoreData {
    constructor() {
        this.type = EmitterType.Circle;
        this.params = new CircleCoreParamsData();
    }
}
export class CircleCoreParamsData {
    constructor() {
        this.radius = 100;
        this.radial = true;
        this.angle = 0;
    }
}
export class RingCoreData {
    constructor() {
        this.type = EmitterType.Ring;
        this.params = new RingCoreParamsData();
    }
}
export class RingCoreParamsData {
    constructor() {
        this.radius = 100;
        this.radial = true;
        this.angle = 0;
        this.uniform = true;
    }
}
export class BoxCoreData {
    constructor() {
        this.type = EmitterType.Box;
        this.params = new BoxCoreParamsData();
    }
}
export class BoxCoreParamsData {
    constructor() {
        this.width = 100;
        this.height = 100;
        this.radial = true;
    }
}
export class ComponentParamsData {
    constructor() {
        this.animationSpeedMin = 1;
        this.animationSpeedMax = 1;
        this.loop = true;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }
}
export class ParticleSettingsData {
    constructor(componentId) {
        this.componentId = componentId;
        this.componentType = ComponentType.Sprite;
        this.componentParams = new ComponentParamsData();
        this.durationMin = 1;
        this.durationMax = 1;
        this.useMotion = false;
        this.useRotation = false;
        this.useAlpha = false;
        this.useScale = false;
        this.useTint = false;
        this.useChilds = false;
        this.useSpawns = false;
        this.distanceMin = 0;
        this.distanceMax = 0;
        this.distanceEase = EasingType.Linear;
        this.moveSpeedMin = 0;
        this.moveSpeedMax = 0;
        this.bounceFacMin = 1;
        this.bounceFacMax = 1;
        this.frictionMin = 0;
        this.frictionMax = 0;
        this.align = false;
        this.blendMode = 0;
        this.addOnTop = false;
        this.rotationSpeedMin = 0;
        this.rotationSpeedMax = 0;
        this.randomRotationDirection = false;
        this.randomStartRotation = false;
        this.fadeIn = false;
        this.fadeInDurationFac = 0;
        this.fadeInEase = EasingType.Linear;
        this.alphaStartMin = 1;
        this.alphaStartMax = 1;
        this.alphaEndMin = 1;
        this.alphaEndMax = 1;
        this.alphaEase = EasingType.Linear;
        this.tintStart = 0xffffff;
        this.tintEnd = 0xffffff;
        this.tintEase = EasingType.Linear;
        this.scaleIn = false;
        this.scaleInDurationFac = 1;
        this.scaleInEase = EasingType.Linear;
        this.uniformScale = true;
        this.scaleXStartMin = 1;
        this.scaleXStartMax = 1;
        this.scaleXEndMin = 1;
        this.scaleXEndMax = 1;
        this.scaleXEase = EasingType.Linear;
        this.scaleYStartMin = 1;
        this.scaleYStartMax = 1;
        this.scaleYEndMin = 1;
        this.scaleYEndMax = 1;
        this.scaleYEase = EasingType.Linear;
        this.scaleStartMin = 1;
        this.scaleStartMax = 1;
        this.scaleEndMin = 1;
        this.scaleEndMax = 1;
        this.scaleEase = EasingType.Linear;
        this.stopOnBounce = false;
        this.spawn = new EmitterSpawnsData();
    }
}
//# sourceMappingURL=EmitterSettingsData.js.map