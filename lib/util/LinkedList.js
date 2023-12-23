export class LinkedList {
    constructor() {
        this.__length = 0;
    }
    // *********************************************************************************************
    // * Public																                       *
    // *********************************************************************************************
    get length() {
        return this.__length;
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
        this.__length++;
        return this;
    }
    remove(node) {
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
    toArray() {
        const ret = [];
        if (!this.first)
            return ret;
        let node = this.first;
        while (node) {
            ret.push(node);
            node = node.next;
        }
        return ret;
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
//# sourceMappingURL=LinkedList.js.map