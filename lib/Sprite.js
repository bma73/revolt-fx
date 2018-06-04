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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var RevoltEffects_1 = require("./RevoltEffects");
var PIXI = __importStar(require("pixi.js"));
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(componentId, texture, anchorX, anchorY) {
        var _this = _super.call(this, PIXI.Texture.fromFrame(texture)) || this;
        _this.componentId = componentId;
        _this.anchor.set(anchorX || 0.5, anchorY || 0.5);
        _this.__sequenceEndTime = null;
        return _this;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    Sprite.prototype.recycle = function () {
        // console.log('recycle Sprite');
        if (this.parent)
            this.parent.removeChild(this);
        RevoltEffects_1.RevoltEffects.instance.__recycleObject(this.componentId, this);
        // this.x = this.y = 0;
        // console.log(this, 'recycle');
    };
    Sprite.prototype.dispose = function () {
        this.recycle();
        this.destroy(false);
    };
    return Sprite;
}(PIXI.Sprite));
exports.Sprite = Sprite;
