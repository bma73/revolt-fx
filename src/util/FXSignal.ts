import { LinkedList, Node } from "./LinkedList";
import { Particle } from "../Particle";
import { ParticleEmitter } from "../ParticleEmitter";
import { MovieClip } from "../MovieClip";
import { Sprite } from "../Sprite";

export class FXSignal {

    public __hasCallback: boolean = false;
    private _list: LinkedList = new LinkedList();


    constructor() {
    }

    public add(callback: Function, scope?: any, callRate?: number) {
        this._list.add(new Node(new FXSignalListener(callback, scope, false, callRate)));
        this.__hasCallback = true;
    }

    public addOnce(callback: Function, scope?: any) {
        this._list.add(new Node(new FXSignalListener(callback, scope, true)));
        this.__hasCallback = true;
    }

    public dispatch(...params: any[]) {

        const list = this._list;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            let call = true;
            const data = <FXSignalListener>node.data;
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
    }

    public remove(callback: Function) {
        const list = this._list;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            if (node.data.callback === callback) {
                list.remove(node);
                return;
            }
            node = next;
        }
        this.__hasCallback = list.__length > 0;
    }

    public removeAll() {
        this._list.clear();
        this.__hasCallback = false;
    }

}

export class FXSignalListener {
    public calls: number = 0;
    constructor(public callback: Function,
        public scope?: any,
        public once?: boolean,
        public callRate?: number) { }
}