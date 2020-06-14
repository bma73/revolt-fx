"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList = /** @class */ (function () {
    function LinkedList() {
        this.__length = 0;
    }
    Object.defineProperty(LinkedList.prototype, "length", {
        // *********************************************************************************************
        // * Public																                                        					   *
        // *********************************************************************************************
        get: function () {
            return this.__length;
        },
        enumerable: true,
        configurable: true
    });
    LinkedList.prototype.add = function (node) {
        if (this.first == null) {
            this.first = this.last = node;
        }
        else {
            node.prev = this.last;
            this.last.next = node;
            this.last = node;
        }
        node.list = this;
        this.__length++;
        return this;
    };
    LinkedList.prototype.remove = function (node) {
        if (node.list == null) {
            return;
        }
        if (this.first === this.last) {
            this.first = this.last = null;
        }
        else if (this.__length > 0) {
            if (node === this.last) {
                node.prev.next = null;
                this.last = node.prev;
            }
            else if (node === this.first) {
                node.next.prev = null;
                this.first = node.next;
            }
            else {
                node.next.prev = node.prev;
                node.prev.next = node.next;
            }
        }
        node.next = node.prev = node.list = null;
        this.__length--;
        return this;
    };
    LinkedList.prototype.clear = function () {
        if (!this.first)
            return;
        var node = this.first;
        while (node) {
            var next = node.next;
            node.next = node.prev = node.list = null;
            node = next;
        }
        this.first = this.last = null;
    };
    LinkedList.prototype.toArray = function () {
        var ret = [];
        if (!this.first)
            return ret;
        var node = this.first;
        while (node) {
            ret.push(node);
            node = node.next;
        }
        return ret;
    };
    return LinkedList;
}());
exports.LinkedList = LinkedList;
var Node = /** @class */ (function () {
    function Node(data) {
        this.data = data;
    }
    Node.prototype.update = function (dt) {
    };
    Node.prototype.dispose = function () {
    };
    return Node;
}());
exports.Node = Node;
//# sourceMappingURL=LinkedList.js.map