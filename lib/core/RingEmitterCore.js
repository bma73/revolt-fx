"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseEmitterCore_1 = require("./BaseEmitterCore");
var Rnd_1 = require("../util/Rnd");
var RingEmitterCore = /** @class */ (function (_super) {
    __extends(RingEmitterCore, _super);
    function RingEmitterCore(emitter) {
        return _super.call(this, emitter) || this;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    RingEmitterCore.prototype.emit = function (particle) {
        var settings = this._settings;
        var emitter = this.emitter;
        var angle;
        if (!settings.angle) {
            if (settings.uniform) {
                angle = this._angle + emitter.rotation;
                this._angle += this._uniformStep;
            }
            else {
                angle = Rnd_1.Rnd.float(0, 6.28319) + emitter.rotation;
            }
        }
        else {
            angle = Rnd_1.Rnd.float(-settings.angle * 0.5, settings.angle * 0.5) + emitter.rotation;
        }
        var r = settings.radius;
        particle.component.x = this.x + Math.cos(angle) * r;
        particle.component.y = this.y + Math.sin(angle) * r;
        if (settings.radial) {
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
            particle.component.rotation = angle;
        }
        else {
            particle.dx = this._dx;
            particle.dy = this._dy;
            particle.component.rotation = emitter.rotation;
        }
    };
    RingEmitterCore.prototype.prepare = function () {
        this._uniformStep = 6.28319 / this.emitter.settings.spawnCount;
        this._angle = 0;
    };
    RingEmitterCore.prototype.step = function () {
    };
    return RingEmitterCore;
}(BaseEmitterCore_1.BaseEmitterCore));
exports.RingEmitterCore = RingEmitterCore;
