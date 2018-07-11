export class LinkedList {

    public __length: number;
    public first: Node;
    public last: Node;

    constructor() {
        this.__length = 0;
    }

    // *********************************************************************************************
    // * Public																                                        					   *
    // *********************************************************************************************
    public get length(): number {
        return this.__length;
    }

    public add(node: Node): LinkedList {
        if (this.first == null) {
            this.first = this.last = node;
        } else {
            node.prev = this.last;
            this.last.next = node;
            this.last = node;
        }
        node.list = this;
        this.__length++;
        return this;
    }

    public remove(node: Node): LinkedList {
        if (node.list == null) {
            return;
        }

        if (this.first === this.last) {
            this.first = this.last = null;
        } else if (this.__length > 0) {
            if (node === this.last) {
                node.prev.next = null;
                this.last = node.prev;
            } else if (node === this.first) {
                node.next.prev = null;
                this.first = node.next;
            } else {
                node.next.prev = node.prev;
                node.prev.next = node.next;
            }
        }
        node.next = node.prev = node.list = null;
        this.__length--;
        return this;
    }

    public clear() {
        if (!this.first) return;
        let node = this.first;
        while (node) {
            let next = node.next;
            node.next = node.prev = node.list = null;
            node = next;
        }
        this.first = this.last = null;
    }

    public toArray(): Node[] {
        const ret = [];
        if (!this.first) return ret;
        let node = this.first;
        while (node) {
            ret.push(node);
            node = node.next;
        }
        return ret;
    }

}

export class Node {
    public next: Node;
    public prev: Node;
    public list: LinkedList;

    constructor(public data?: any) {

    }

    public update(dt: number) {

    }

    public dispose() {

    }

}
