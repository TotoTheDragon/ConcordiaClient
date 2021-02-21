import { ConcordiaClient } from "../client";
import { ClientPlugin } from "./ClientPlugin";

export class PluginManager {

    client: ConcordiaClient;

    registered: Map<string, ClientPlugin>;

    constructor(client: ConcordiaClient) {
        this.client = client;
        this.registered = new Map();
    }

    getPlugin<T extends ClientPlugin>(identifier: string): T {
        return this.registered.get(identifier) as T;
    }

    register(plugin: ClientPlugin) {
        if (this.registered.has(plugin.identifier)) throw Error("Tried to register a plugin that is already registered: " + plugin.identifier);
        plugin.initialize(this.client);
        this.registered.set(plugin.identifier, plugin);
    }
}