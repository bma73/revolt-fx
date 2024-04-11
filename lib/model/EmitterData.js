import { EmitterType } from "../core/EmitterType";
export class EmitterData {
    constructor(name) {
        this.name = name;
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
//# sourceMappingURL=EmitterData.js.map