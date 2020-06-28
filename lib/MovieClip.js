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
exports.MovieClip = void 0;
var PIXI = require("pixi.js");
var MovieClip = (function (_super) {
    __extends(MovieClip, _super);
    function MovieClip(componentId, textures, anchorX, anchorY) {
        var _this = this;
        var t = [];
        var l = textures.length;
        for (var i = 0; i < l; i++) {
            t.push(PIXI.Texture.from(textures[i]));
        }
        _this = _super.call(this, t) || this;
        _this.componentId = componentId;
        _this.anchor.set(0.5, 0.5);
        _this.loop = false;
        _this.__sequenceEndTime = 0;
        return _this;
    }
    MovieClip.prototype.recycle = function () {
        this.alpha = 1;
        this.tint = 0xffffff;
        this.transform.rotation = 0;
        this.transform.scale.set(1);
        if (this.parent)
            this.parent.removeChild(this);
        this.gotoAndStop(0);
        this.__fx.__recycleMovieClip(this.componentId, this);
    };
    MovieClip.prototype.dispose = function () {
        if (this.parent)
            this.parent.removeChild(this);
        this.__fx = null;
        this.gotoAndStop(0);
        this.destroy();
    };
    return MovieClip;
}(PIXI.AnimatedSprite));
exports.MovieClip = MovieClip;
//# sourceMappingURL=MovieClip.js.map