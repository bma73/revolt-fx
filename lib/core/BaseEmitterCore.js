export class BaseEmitterCore {
    constructor(type) {
        this.type = type;
        this._dx = 0;
        this._dy = 0;
        this._rotation = 0;
    }
    // *********************************************************************************************
    // * Public			                                        								   *
    // *********************************************************************************************
    init(emitter) {
        this.emitter = emitter;
        this._settings = emitter.settings.core.params;
        this.x = this.__x = emitter.x;
        this.y = this.__y = emitter.y;
        this.rotation = emitter.rotation;
    }
    emit(particle) {
    }
    prepare(spawnCount) {
        this._posInterpolationStep = 1 / spawnCount;
        this._t = this._posInterpolationStep * 0.5;
    }
    step() {
        this.__x = this.x;
        this.__y = this.y;
    }
    recycle() {
        this.emitter = null;
        this._settings = null;
    }
    dispose() {
        this.recycle();
        this.emitter = null;
        this._settings = null;
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(value) {
        this._rotation = value;
        this._dx = Math.cos(value);
        this._dy = Math.sin(value);
    }
}
BaseEmitterCore.__TYPE_BOX = 'box';
BaseEmitterCore.__TYPE_CIRCLE = 'circle';
BaseEmitterCore.__TYPE_RING = 'ring';
//# sourceMappingURL=BaseEmitterCore.js.map