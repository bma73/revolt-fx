"use strict";
/// <reference types="pixi.js" />
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
var PIXI = require("pixi.js");
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(componentId, texture, anchorX, anchorY) {
        var _this = _super.call(this, PIXI.Texture.from(texture)) || this;
        _this.componentId = componentId;
        _this.anchor.set(anchorX || 0.5, anchorY || 0.5);
        _this.__sequenceEndTime = null;
        return _this;
    }
    // *********************************************************************************************
    // * Public										                                        											   *
    // *********************************************************************************************
    Sprite.prototype.recycle = function () {
        this.tint = 0xffffff;
        this.alpha = 1;
        this.transform.rotation = 0;
        this.transform.scale.set(1);
        if (this.parent)
            this.parent.removeChild(this);
        this.__fx.__recycleSprite(this.componentId, this);
    };
    Sprite.prototype.dispose = function () {
        this.__fx = null;
        this.recycle();
        // @ts-ignore
        this.destroy(false);
    };
    return Sprite;
}(PIXI.Sprite));
exports.Sprite = Sprite;
//# sourceMappingURL=Sprite.js.map