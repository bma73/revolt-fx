/// <reference types="pixi.js" />
import * as PIXI from "pixi.js";
import { Node } from "./util/LinkedList";
export class BaseEffect extends Node {
    constructor(componentId) {
        super();
        this.componentId = componentId;
        this.exhausted = false;
        this.completed = false;
        this.name = "";
        this.endTime = 0;
        this._x = 0;
        this._y = 0;
        this._rotation = 0;
        this._alpha = 0;
        this._scale = new PIXI.Point();
        this._time = 0;
        this._active = false;
        this.__recycled = true;
    }
    // *********************************************************************************************
    // * Public																					                                           *
    // *********************************************************************************************
    update(dt) {
    }
    recycle() {
    }
    get active() {
        return this._active;
    }
    get scale() {
        return this._scale;
    }
    set scale(value) {
        this._scale = value;
    }
    get alpha() {
        return this._alpha;
    }
    set alpha(value) {
        this._alpha = value;
    }
    set rotation(value) {
        this._rotation = value;
    }
    get rotation() {
        return this._rotation;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    // *********************************************************************************************
    // * internal										                                        										   *
    // *********************************************************************************************
    __applySettings(value) {
    }
}
//# sourceMappingURL=BaseEffect.js.map