import { ICoreSettings, IEmitterSettings, IEmitterSpawn, IParticleSettings } from "../FX";
export declare class EmitterData implements IEmitterSettings {
    name: string;
    constructor(name: string);
    core: ICoreSettings;
    spawnFrequencyMin: number;
    spawnFrequencyMax: number;
    particleSettings: IParticleSettings;
    maxParticles: number;
    spawnCountMin: number;
    spawnCountMax: number;
    duration: number;
    infinite: boolean;
    useGravity: boolean;
    gravity: number;
    useFloor: boolean;
    floorY: number;
    rotation: number;
    autoRotation: number;
    childs: IEmitterSpawn[];
    id: any;
    containerId: string;
}
