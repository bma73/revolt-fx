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
var RevoltEffects_1 = require("./RevoltEffects");
var MovieClip = /** @class */ (function (_super) {
    __extends(MovieClip, _super);
    function MovieClip(componentId, textures, anchorX, anchorY) {
        var _this = this;
        var t = [];
        var l = textures.length;
        for (var i = 0; i < l; i++) {
            t.push(PIXI.Texture.fromFrame(textures[i]));
        }
        _this = _super.call(this, t) || this;
        _this.componentId = componentId;
        _this.anchor.set(0.5, 0.5);
        _this.loop = false;
        _this.__sequenceEndTime = 0;
        return _this;
        // this.play();
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    MovieClip.prototype.recycle = function () {
        // console.log('recycle MovieClip');
        if (this.parent)
            this.parent.removeChild(this);
        this.gotoAndStop(0);
        RevoltEffects_1.RevoltEffects.instance.__recycleObject(this.componentId, this);
    };
    MovieClip.prototype.dispose = function () {
        this.recycle();
        this.destroy();
    };
    return MovieClip;
}(PIXI.extras.AnimatedSprite));
exports.MovieClip = MovieClip;
