export class Sanitizer {
    static sanitizeBundle(bundle) {
        for (let emitter of bundle.emitters) {
            const structure = Sanitizer._presetStructure.emitter;
            this.migrateEmitterSettings(emitter);
            Sanitizer.parse(emitter, structure, Sanitizer._presetStructure.emitterSpawn);
        }
        for (let sequence of bundle.sequences) {
            const structure = Sanitizer._presetStructure.sequence;
            Sanitizer.parse(sequence, structure, Sanitizer._presetStructure.sequenceEffect);
        }
    }
    static migrateEmitterSettings(settings) {
        const ps = settings.particleSettings;
        if (ps.component === undefined) {
            const groups = {
                component: ['componentType', 'componentId', 'componentParams'],
                motion: ['useMotion', 'durationMin', 'durationMax', 'distanceMin', 'distanceMax', 'distanceEase', 'moveSpeedMin', 'moveSpeedMax', 'bounceFacMin', 'bounceFacMax', 'frictionMin', 'frictionMax', 'align'],
                rotation: ['useRotation', 'rotationMin', 'rotationMax', 'randomStartRotation'],
                alpha: ['useAlpha', 'alphaStartMin', 'alphaStartMax', 'alphaEndMin', 'alphaEndMax', 'alphaEase'],
                tint: ['useTint', 'tintStart', 'tintEnd', 'tintEase'],
                fade: ['fadeIn', 'fadeInDurationFac', 'fadeInEase'],
                scale: ['useScale', 'scaleStartMin', 'scaleStartMax', 'scaleEndMin', 'scaleEndMax', 'scaleEase', 'scaleXStartMin', 'scaleXStartMax', 'scaleXEndMin', 'scaleXEndMax', 'scaleXEase', 'scaleYStartMin', 'scaleYStartMax', 'scaleYEndMin', 'scaleYEndMax', 'scaleYEase', 'uniformScale'],
            };
            for (const groupName in groups) {
                const group = {};
                for (const prop of groups[groupName]) {
                    group[prop] = ps[prop];
                }
                ps[groupName] = group;
            }
        }
    }
    static parse(bundleObject, structureObject, spawnStructureObject) {
        for (let propName in structureObject) {
            if (bundleObject[propName] == null) {
                bundleObject[propName] = structureObject[propName];
            }
            else {
                const bundleProp = bundleObject[propName];
                if (typeof bundleProp !== 'object')
                    continue;
                const structureProp = structureObject[propName];
                if (!bundleProp.hasOwnProperty('length')) {
                    Sanitizer.parse(bundleProp, structureProp, spawnStructureObject);
                }
                else {
                    for (let spawn of bundleProp) {
                        for (let spawnPropName in spawnStructureObject) {
                            if (spawn[spawnPropName] == null) {
                                spawn[spawnPropName] = spawnStructureObject[spawnPropName];
                            }
                        }
                    }
                }
            }
        }
    }
}
Sanitizer._presetStructure = {
    sequence: {
        id: 0,
        name: '',
        type: 1,
        delay: 0,
        scaleMin: 1,
        scaleMax: 1,
        effects: []
    },
    sequenceEffect: {
        id: 0,
        componentId: null,
        componentType: 0,
        delay: 0,
        componentParams: {
            animationSpeedMin: 1,
            animationSpeedMax: 1,
            anchorX: 0.5,
            anchorY: 0.5,
            loop: false
        },
        scaleMin: 1,
        scaleMax: 1,
        alphaMin: 1,
        alphaMax: 1,
        rotationMin: 0,
        rotationMax: 0,
        blendMode: 0,
        duration: 0.1,
        tint: 0xffffff,
        containerId: '',
        triggerValue: ''
    },
    emitter: {
        id: 0,
        name: '',
        type: 0,
        core: {
            type: 'circle',
            params: {
                radius: 100,
                radial: true,
                angle: 6.28318530718,
                uniform: false,
                width: 100,
                height: 100
            }
        },
        spawnFrequencyMin: 0.1,
        spawnFrequencyMax: 0.1,
        maxParticles: 1000,
        spawnCountMin: 1,
        spawnCountMax: 1,
        duration: 0,
        infinite: true,
        useGravity: false,
        gravity: 0,
        useFloor: false,
        floorY: 700,
        rotation: 0,
        autoRotation: 0,
        particleSettings: {
            component: {
                componentType: 0,
                componentId: '',
                componentParams: {
                    animationSpeedMin: 1,
                    animationSpeedMax: 1,
                    anchorX: 0.5,
                    anchorY: 0.5,
                    loop: false
                },
            },
            motion: {
                durationMin: 1,
                durationMax: 2,
                distanceMin: 0,
                distanceMax: 0,
                distanceEase: 'linear',
                moveSpeedMin: 0,
                moveSpeedMax: 0,
                bounceFacMin: 0,
                bounceFacMax: 0,
                frictionMin: 0,
                frictionMax: 0,
                useMotion: false,
                align: false,
            },
            rotation: {
                useRotation: false,
                rotationSpeedMin: 0,
                rotationSpeedMax: 0,
                randomRotationDirection: false,
                randomStartRotation: false,
            },
            alpha: {
                useAlpha: false,
                alphaStartMin: 0.7,
                alphaStartMax: 0.9,
                alphaEndMin: 0.7,
                alphaEndMax: 0.8,
                alphaEase: 'linear',
            },
            scale: {
                useScale: false,
                scaleIn: false,
                scaleInDurationFac: 0.2,
                scaleInEase: 'linear',
                uniformScale: true,
                scaleXStartMin: 1,
                scaleXStartMax: 1,
                scaleXEndMin: 1,
                scaleXEndMax: 1,
                scaleXEase: 'linear',
                scaleYStartMin: 1,
                scaleYStartMax: 1,
                scaleYEndMin: 1,
                scaleYEndMax: 1,
                scaleYEase: 'linear',
                scaleStartMin: 1,
                scaleStartMax: 1,
                scaleEndMin: 1,
                scaleEndMax: 1,
                scaleEase: 'linear',
            },
            tint: {
                useTint: false,
                tintStart: 0xffffff,
                tintEnd: 0xffffff,
                tintEase: 'linear',
            },
            fade: {
                fadeIn: true,
                fadeInDurationFac: 0.1,
                fadeInEase: 'linear',
            },
            useChilds: false,
            useSpawns: false,
            stopOnBounce: false,
            blendMode: 1,
            addOnTop: true,
            childs: [],
            spawn: {
                onComplete: [],
                onBounce: [],
                onHalfway: [],
                onStart: []
            }
        },
        childs: []
    },
    emitterSpawn: {
        type: 0,
        id: 0,
        scale: 1,
        adoptRotation: true,
        containerId: ''
    }
};
Sanitizer._presetStructure_v1 = {
    sequence: {
        id: 0,
        name: '',
        type: 1,
        delay: 0,
        scaleMin: 1,
        scaleMax: 1,
        effects: []
    },
    sequenceEffect: {
        id: 0,
        componentId: null,
        componentType: 0,
        delay: 0,
        componentParams: {
            animationSpeedMin: 1,
            animationSpeedMax: 1,
            anchorX: 0.5,
            anchorY: 0.5,
            loop: false
        },
        scaleMin: 1,
        scaleMax: 1,
        alphaMin: 1,
        alphaMax: 1,
        rotationMin: 0,
        rotationMax: 0,
        blendMode: 0,
        duration: 0.1,
        tint: 0xffffff,
        containerId: '',
        triggerValue: ''
    },
    emitter: {
        id: 0,
        name: '',
        type: 0,
        core: {
            type: 'circle',
            params: {
                radius: 100,
                radial: true,
                angle: 6.28318530718,
                uniform: false,
                width: 100,
                height: 100
            }
        },
        spawnFrequencyMin: 0.1,
        spawnFrequencyMax: 0.1,
        maxParticles: 1000,
        spawnCountMin: 1,
        spawnCountMax: 1,
        duration: 0,
        infinite: true,
        useGravity: false,
        gravity: 0,
        useFloor: false,
        floorY: 700,
        rotation: 0,
        autoRotation: 0,
        particleSettings: {
            componentType: 0,
            componentId: '',
            componentParams: {
                animationSpeedMin: 1,
                animationSpeedMax: 1,
                anchorX: 0.5,
                anchorY: 0.5,
                loop: false
            },
            durationMin: 1,
            durationMax: 2,
            distanceMin: 0,
            distanceMax: 0,
            distanceEase: 'linear',
            moveSpeedMin: 0,
            moveSpeedMax: 0,
            bounceFacMin: 0,
            bounceFacMax: 0,
            frictionMin: 0,
            frictionMax: 0,
            useMotion: false,
            useRotation: false,
            useAlpha: false,
            useScale: false,
            useTint: false,
            useChilds: false,
            useSpawns: false,
            stopOnBounce: false,
            align: false,
            blendMode: 1,
            addOnTop: true,
            rotationSpeedMin: 0,
            rotationSpeedMax: 0,
            randomRotationDirection: false,
            randomStartRotation: false,
            fadeIn: true,
            fadeInDurationFac: 0.1,
            fadeInEase: 'linear',
            alphaStartMin: 0.7,
            alphaStartMax: 0.9,
            alphaEndMin: 0.7,
            alphaEndMax: 0.8,
            alphaEase: 'linear',
            tintStart: 0xffffff,
            tintEnd: 0xffffff,
            tintEase: 'linear',
            scaleIn: false,
            scaleInDurationFac: 0.2,
            scaleInEase: 'linear',
            uniformScale: true,
            scaleXStartMin: 1,
            scaleXStartMax: 1,
            scaleXEndMin: 1,
            scaleXEndMax: 1,
            scaleXEase: 'linear',
            scaleYStartMin: 1,
            scaleYStartMax: 1,
            scaleYEndMin: 1,
            scaleYEndMax: 1,
            scaleYEase: 'linear',
            scaleStartMin: 1,
            scaleStartMax: 1,
            scaleEndMin: 1,
            scaleEndMax: 1,
            scaleEase: 'linear',
            childs: [],
            spawn: {
                onComplete: [],
                onBounce: [],
                onHalfway: [],
                onStart: []
            }
        },
        childs: []
    },
    emitterSpawn: {
        type: 0,
        id: 0,
        scale: 1,
        adoptRotation: true,
        containerId: ''
    }
};
//# sourceMappingURL=Sanitizer.js.map