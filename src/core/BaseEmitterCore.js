export class BaseEmitterCore {
    constructor(emitter) {
        this.emitter = emitter;
        this._dx = 0;
        this._dy = 0;
        this._rotation = 0;
        this._settings = emitter.settings.core.params;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    emit(particle) {
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(value) {
        this._rotation = value;
        this._dx = Math.cos(value);
        this._dy = Math.sin(value);
    }
    prepare() {
    }
    step() {
    }
    dispose() {
        this.emitter = null;
    }
}