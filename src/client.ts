import { ConcordiaClientOptions, DefaultConcordiaClientOptions } from "./util/Constants";
import { Util } from "./util/Util";
import { WebsocketManager } from "./WebsocketManager";

export class ConcordiaClient {

    options: ConcordiaClientOptions;

    wsManager: WebsocketManager;

    constructor(options: ConcordiaClientOptions) {
        this.options = Util.mergeDefault(DefaultConcordiaClientOptions, options);

        this.wsManager = new WebsocketManager(this);
    }



}

