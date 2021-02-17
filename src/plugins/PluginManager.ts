import { ConcordiaClient } from "../client";
import { ClientPlugin } from "./ClientPlugin";

export class PluginManager {

    client: ConcordiaClient;

    registered: Map<string, ClientPlugin>;

    constructor(client: ConcordiaClient) {
        this.client = client;
        this.registered = new Map();
    }

    register(plugin: ClientPlugin) {
        if (this.registered.has(plugin.identifier)) throw Error("Tried to register a plugin that is already registered: " + plugin.identifier);
        plugin.initialize(this.client);
        this.registered.set(plugin.identifier, plugin);
    }
}