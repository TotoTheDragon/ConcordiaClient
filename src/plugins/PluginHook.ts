export class PluginHook {

    private _name: string;

    private _after: string[];

    private _before: string[];

    constructor(name: string) {
        this._name = name;
        this._after = [];
        this._before = []
    }

    get name() {
        return this._name;
    }

    get after() {
        return this._after;
    }

    get before() {
        return this._before;
    }
}