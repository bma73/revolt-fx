export declare class LinkedList {
    private _length;
    first: Node;
    last: Node;
    constructor();
    readonly length: number;
    add(node: Node): LinkedList;
    remove(node: Node): LinkedList;
    clear(): void;
}
export declare class Node {
    data: any;
    next: Node;
    prev: Node;
    list: LinkedList;
    constructor(data?: any);
    update(dt: number): void;
    dispose(): void;
}
