import { AbstractHandler } from "./handlers/AbstractHandler";
import { ClientPlugin } from "./plugins/ClientPlugin";
import { PluginManager } from "./plugins/PluginManager";
import { ConcordiaClientOptions, DefaultConcordiaClientOptions } from "./util/Constants";
import { Util } from "./util/Util";
import { WebsocketManager } from "./WebsocketManager";

export class ConcordiaClient {

    options: ConcordiaClientOptions;

    wsManager: WebsocketManager;

    pluginManager: PluginManager;

    constructor(options: ConcordiaClientOptions) {
        this.options = Util.mergeDefault(DefaultConcordiaClientOptions, options);

        this.wsManager = new WebsocketManager(this);

        this.pluginManager = new PluginManager(this);
    }

    registerHandler(handler: AbstractHandler) {
        return handler.register(this.wsManager);
    }

    registerPlugin(plugin: ClientPlugin) {
        return this.pluginManager.register(plugin);
    }
}

