"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RingEmitterCore = void 0;
var BaseEmitterCore_1 = require("./BaseEmitterCore");
var Rnd_1 = require("../util/Rnd");
var RingEmitterCore = (function (_super) {
    __extends(RingEmitterCore, _super);
    function RingEmitterCore() {
        return _super.call(this, BaseEmitterCore_1.BaseEmitterCore.__TYPE_RING) || this;
    }
    RingEmitterCore.prototype.prepare = function (spawnCount) {
        _super.prototype.prepare.call(this, spawnCount);
        var angle = this._settings.angle;
        if (2 * Math.PI - angle < 0.1) {
            this._uniformStep = angle / (spawnCount);
            this._angle = angle;
        }
        else {
            this._uniformStep = angle / (spawnCount - 1);
            this._angle = -angle * 0.5;
        }
    };
    RingEmitterCore.prototype.emit = function (particle) {
        var settings = this._settings;
        var emitter = this.emitter;
        var angle;
        if (settings.uniform) {
            angle = this._angle + emitter.rotation;
            this._angle += this._uniformStep;
        }
        else {
            angle = Rnd_1.Rnd.float(-settings.angle * 0.5, settings.angle * 0.5) + emitter.rotation;
        }
        var r = settings.radius * this.__scaleMod;
        particle.component.transform.position.x = (this.__x + this._t * (this.x - this.__x)) + Math.cos(angle) * r;
        particle.component.transform.position.y = (this.__y + this._t * (this.y - this.__y)) + Math.sin(angle) * r;
        if (settings.radial) {
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
            particle.component.transform.rotation = angle;
        }
        else {
            particle.dx = this._dx;
            particle.dy = this._dy;
            particle.component.transform.rotation = emitter.rotation;
        }
        this._t += this._posInterpolationStep;
    };
    return RingEmitterCore;
}(BaseEmitterCore_1.BaseEmitterCore));
exports.RingEmitterCore = RingEmitterCore;
//# sourceMappingURL=RingEmitterCore.js.map