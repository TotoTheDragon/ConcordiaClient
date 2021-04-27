import { Plugin } from "./Plugin";

export class PluginController {

    store: Plugin[];

    constructor() {
        this.store = [];
    }

    getHooks(name: string, sort: boolean = true) {
        const split = name.split(":");
        let plugins = split.shift().split(",");
        const hook = split.shift();
    }


    call(name: string, ...args: any[]): any {

    }

    deconstructName(name: string): DeconstructedName {
        const split = name.split(":");
        if (split.length > 2) throw Error("Invalid name, contains more than 1 delimiter (:)");
        if (split.length === 1) return { hook: split[0], plugins: [""] };
        const hook = split[1];
        let plugins: string[] = split[0].split(",");
        if (plugins.includes("*")) plugins = this.store.filter(p => p.hooks[hook] != null).map(plugin => plugin.name);
        return { hook, plugins };
    }
}

export interface DeconstructedName {
    hook: string,
    plugins: string[]
}