export declare class FXSignal {
    __hasCallback: boolean;
    private _list;
    constructor();
    add(callback: Function, scope?: any, callRate?: number): void;
    addOnce(callback: Function, scope?: any): void;
    dispatch(...params: any[]): void;
    remove(callback: Function): void;
    removeAll(): void;
}
export declare class FXSignalListener {
    callback: Function;
    scope?: any;
    once?: boolean;
    callRate?: number;
    calls: number;
    constructor(callback: Function, scope?: any, once?: boolean, callRate?: number);
}
