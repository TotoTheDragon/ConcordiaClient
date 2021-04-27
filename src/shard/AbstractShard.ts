import { EventEmitter3000 } from "eventemitter3000";
import { ConcordiaClient } from "../client";
import { ShardStatus } from "../util/Constants";

export abstract class AbstractShard extends EventEmitter3000 {

    manager: ConcordiaClient;

    private _status: ShardStatus;

    constructor(manager: ConcordiaClient) {
        super();
        this.manager = manager;
        this._status = ShardStatus.CLOSED;
    }

    getStatus = (): ShardStatus => this._status

    setStatus = (status: ShardStatus) => this._status = status;

    abstract sendWS(packet: any): void;

}