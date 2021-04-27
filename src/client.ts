import { Logger } from "winston";
import { AbstractHandler } from "./handlers/AbstractHandler";
import { ClientPlugin } from "./plugins/ClientPlugin";
import { PluginManager } from "./plugins/PluginManager";
import { AbstractShard } from "./shard/AbstractShard";
import { ConcordiaClientOptions, DefaultConcordiaClientOptions } from "./util/Constants";
import { Util } from "./util/Util";
import { WebsocketManager } from "./WebsocketManager";
import { createLogger } from "./winston/patch";
import { transport } from "./winston/transport";

export class ConcordiaClient {

    options: ConcordiaClientOptions;

    wsManager: WebsocketManager;

    pluginManager: PluginManager;

    shards: Map<number, AbstractShard>;

    logger: Logger;

    private _startTime: number;

    constructor(options?: ConcordiaClientOptions) {
        this.options = Util.mergeDefault(DefaultConcordiaClientOptions, options);

        this.wsManager = new WebsocketManager(this);

        this.pluginManager = new PluginManager(this);

        this.shards = new Map();

        this._startTime = Date.now();

        this.logger = createLogger({ transports: transport(), level: this.options.logLevel });
    }

    get startedAt(): Date {
        return new Date(this._startTime);
    }

    get uptime(): number {
        return Date.now() - this._startTime;
    }

    registerShard(id: number, shard: AbstractShard) {
        return this.shards.set(id, shard);
    }

    registerHandler(handler: AbstractHandler) {
        return handler.register(this.wsManager);
    }

    registerPlugin(plugin: ClientPlugin) {
        this.pluginManager.register(plugin);
    }
}

