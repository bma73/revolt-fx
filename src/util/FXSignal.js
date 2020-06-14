"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList_1 = require("./LinkedList");
var FXSignal = /** @class */ (function () {
    function FXSignal() {
        this.__hasCallback = false;
        this._list = new LinkedList_1.LinkedList();
    }
    FXSignal.prototype.add = function (callback, scope, callRate) {
        this._list.add(new LinkedList_1.Node(new FXSignalListener(callback, scope, false, callRate)));
        this.__hasCallback = true;
    };
    FXSignal.prototype.addOnce = function (callback, scope) {
        this._list.add(new LinkedList_1.Node(new FXSignalListener(callback, scope, true)));
        this.__hasCallback = true;
    };
    FXSignal.prototype.dispatch = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var list = this._list;
        var node = list.first;
        var next;
        while (node) {
            next = node.next;
            var call = true;
            var data = node.data;
            if (data.callRate) {
                if (data.calls % data.callRate != 0) {
                    call = false;
                }
            }
            if (call) {
                data.callback.apply(data.scope, params);
                if (data.once) {
                    list.remove(node);
                }
            }
            node = next;
        }
        this.__hasCallback = list.__length > 0;
    };
    FXSignal.prototype.remove = function (callback) {
        var list = this._list;
        var node = list.first;
        var next;
        while (node) {
            next = node.next;
            if (node.data.callback === callback) {
                list.remove(node);
                return;
            }
            node = next;
        }
        this.__hasCallback = list.__length > 0;
    };
    FXSignal.prototype.removeAll = function () {
        this._list.clear();
        this.__hasCallback = false;
    };
    return FXSignal;
}());
exports.FXSignal = FXSignal;
var FXSignalListener = /** @class */ (function () {
    function FXSignalListener(callback, scope, once, callRate) {
        this.callback = callback;
        this.scope = scope;
        this.once = once;
        this.callRate = callRate;
        this.calls = 0;
    }
    return FXSignalListener;
}());
exports.FXSignalListener = FXSignalListener;
//# sourceMappingURL=FXSignal.js.map