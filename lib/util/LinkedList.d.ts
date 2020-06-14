export declare class LinkedList {
    __length: number;
    first: Node;
    last: Node;
    constructor();
    get length(): number;
    add(node: Node): LinkedList;
    remove(node: Node): LinkedList;
    clear(): void;
    toArray(): Node[];
}
export declare class Node {
    data?: any;
    next: Node;
    prev: Node;
    list: LinkedList;
    constructor(data?: any);
    update(dt: number): void;
    dispose(): void;
}
