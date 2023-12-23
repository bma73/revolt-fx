import { LinkedList, Node } from "./LinkedList";
export class FXSignal {
    constructor() {
        this.__hasCallback = false;
        this._list = new LinkedList();
    }
    add(callback, scope, callRate) {
        this._list.add(new Node(new FXSignalListener(callback, scope, false, callRate)));
        this.__hasCallback = true;
    }
    addOnce(callback, scope) {
        this._list.add(new Node(new FXSignalListener(callback, scope, true)));
        this.__hasCallback = true;
    }
    dispatch(...params) {
        const list = this._list;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            let call = true;
            const data = node.data;
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
    remove(callback) {
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
    removeAll() {
        this._list.clear();
        this.__hasCallback = false;
    }
}
export class FXSignalListener {
    constructor(callback, scope, once, callRate) {
        this.callback = callback;
        this.scope = scope;
        this.once = once;
        this.callRate = callRate;
        this.calls = 0;
    }
}
//# sourceMappingURL=FXSignal.js.map