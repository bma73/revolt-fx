export class LinkedList {
    constructor() {
        this._length = 0;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    get length() {
        return this._length;
    }
    add(node) {
        if (this.first == null) {
            this.first = this.last = node;
        }
        else {
            node.prev = this.last;
            this.last.next = node;
            this.last = node;
        }
        node.list = this;
        this._length++;
        return this;
    }
    remove(node) {
        if (this.first === this.last) {
            this.first = this.last = null;
        }
        else if (this._length > 0) {
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
        this._length--;
        return this;
    }
    clear() {
        if (!this.first)
            return;
        let node = this.first;
        while (node) {
            let next = node.next;
            node.next = node.prev = node.list = null;
            node = next;
        }
        this.first = this.last = null;
    }
}
export class Node {
    constructor(data) {
        this.data = data;
    }
    update(dt) {
    }
    dispose() {
    }
}