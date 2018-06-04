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
var LinkedList_1 = require("./util/LinkedList");
var BaseEffect = /** @class */ (function (_super) {
    __extends(BaseEffect, _super);
    function BaseEffect(componentId) {
        var _this = _super.call(this) || this;
        _this.componentId = componentId;
        _this.exhausted = false;
        _this.completed = false;
        _this._x = 0;
        _this._y = 0;
        _this._rotation = 0;
        _this._alpha = 0;
        _this._scale = new PIXI.Point();
        _this._active = false;
        return _this;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    BaseEffect.prototype.update = function (dt) {
    };
    BaseEffect.prototype.recycle = function () {
    };
    Object.defineProperty(BaseEffect.prototype, "active", {
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEffect.prototype, "scale", {
        get: function () {
            return this._scale;
        },
        set: function (value) {
            this._scale = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEffect.prototype, "alpha", {
        get: function () {
            return this._alpha;
        },
        set: function (value) {
            this._alpha = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEffect.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (value) {
            this._rotation = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEffect.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEffect.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        },
        enumerable: true,
        configurable: true
    });
    // *********************************************************************************************
    // * internal																				   *
    // *********************************************************************************************
    BaseEffect.prototype.__applySettings = function (value) {
    };
    return BaseEffect;
}(LinkedList_1.Node));
exports.BaseEffect = BaseEffect;
