export class LinkedList {

    private _length: number;
    public first: Node;
    public last: Node;

    constructor() {
        this._length = 0;
    }

    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    public get length(): number {
        return this._length;
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
        this._length++;
        return this;
    }

    public remove(node: Node): LinkedList {
        if (this.first === this.last) {
            this.first = this.last = null;
        } else if (this._length > 0) {
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
        this._length--;
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

    // *********************************************************************************************
    // * Private																				   *
    // *********************************************************************************************

    // *********************************************************************************************
    // * Events																					   *
    // *********************************************************************************************

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