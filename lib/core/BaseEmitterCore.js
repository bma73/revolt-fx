"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseEmitterCore = /** @class */ (function () {
    function BaseEmitterCore(emitter) {
        this.emitter = emitter;
        this._dx = 0;
        this._dy = 0;
        this._rotation = 0;
        this._settings = emitter.settings.core.params;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    BaseEmitterCore.prototype.emit = function (particle) {
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
        enumerable: true,
        configurable: true
    });
    BaseEmitterCore.prototype.prepare = function () {
    };
    BaseEmitterCore.prototype.step = function () {
    };
    BaseEmitterCore.prototype.dispose = function () {
        this.emitter = null;
    };
    return BaseEmitterCore;
}());
exports.BaseEmitterCore = BaseEmitterCore;
