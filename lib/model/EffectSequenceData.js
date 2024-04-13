export class EffectSettingsData {
    constructor(name) {
        this.name = name;
        this.componentParams = {
            anchorX: 0.5,
            anchorY: 0.5,
            animationSpeedMin: 1,
            animationSpeedMax: 1,
            loop: false,
        };
        this.alphaMin = 1;
        this.alphaMax = 1;
        this.rotationMin = 0;
        this.rotationMax = 0;
        this.blendMode = 1;
        this.tint = 0xffffff;
        this.duration = 1;
        this.triggerValue = '';
        this.delay = 0;
        this.scaleMin = 1;
        this.scaleMax = 1;
        this.containerId = '';
        this.componentId = name;
    }
}
export class EffectSequenceData {
    constructor(name) {
        this.name = name;
        this.delay = 0;
        this.scaleMin = 1;
        this.scaleMax = 1;
        this.containerId = '';
        this.id = name;
    }
}
//# sourceMappingURL=EffectSequenceData.js.map