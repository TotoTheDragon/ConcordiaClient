import { PluginHook } from "./PluginHook";

export abstract class Plugin {

    abstract name: string;
    hooks: object;

    constructor() {
        this.hooks = {};
    }

    abstract init(): Promise<void>;

    registerHook(hook: PluginHook): void {
        this.hooks[hook.name] = hook;
    }

}