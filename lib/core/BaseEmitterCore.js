"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEmitterCore = void 0;
var BaseEmitterCore = (function () {
    function BaseEmitterCore(type) {
        this.type = type;
        this._dx = 0;
        this._dy = 0;
        this._rotation = 0;
    }
    BaseEmitterCore.prototype.init = function (emitter) {
        this.emitter = emitter;
        this._settings = emitter.settings.core.params;
        this.x = this.__x = emitter.x;
        this.y = this.__y = emitter.y;
        this.rotation = emitter.rotation;
    };
    BaseEmitterCore.prototype.emit = function (particle) {
    };
    BaseEmitterCore.prototype.prepare = function (spawnCount) {
        this._posInterpolationStep = 1 / spawnCount;
        this._t = this._posInterpolationStep * 0.5;
    };
    BaseEmitterCore.prototype.step = function () {
        this.__x = this.x;
        this.__y = this.y;
    };
    BaseEmitterCore.prototype.recycle = function () {
        this.emitter = null;
        this._settings = null;
    };
    BaseEmitterCore.prototype.dispose = function () {
        this.recycle();
        this.emitter = null;
        this._settings = null;
    };
    Object.defineProperty(BaseEmitterCore.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (value) {
            this._rotation = value;
            this._dx = Math.cos(value);
            this._dy = Math.sin(value);
        },
        enumerable: false,
        configurable: true
    });
    BaseEmitterCore.__TYPE_BOX = 'box';
    BaseEmitterCore.__TYPE_CIRCLE = 'circle';
    BaseEmitterCore.__TYPE_RING = 'ring';
    return BaseEmitterCore;
}());
exports.BaseEmitterCore = BaseEmitterCore;
//# sourceMappingURL=BaseEmitterCore.js.map