import { MessagePayload } from "@developerdragon/dragoncordapi";
import { clearInterval } from "timers";
import { ConcordiaClient } from "../client";
import { AbstractHandler } from "./AbstractHandler";

export class ConnectHandler extends AbstractHandler {

    op = 1;

    handle(client: ConcordiaClient, request: MessagePayload): void {

        /* Start heartbeat */
        if (client.wsManager.heartbeat) clearInterval(client.wsManager.heartbeat);
        client.wsManager.heartbeatInterval = request.d.heartbeatInterval;
        if (client.wsManager.heartbeatInterval && client.wsManager.heartbeatInterval > 0)
            client.wsManager.heartbeat = setInterval(() => {
                client.wsManager.send({ op: 2, d: null, t: null, s: null })
            }, client.wsManager.heartbeatInterval);

        /* Identify */
        client.wsManager.send({
            op: 3,
            d: {
                token: client.options.token,
                shard: client.options.shard ?? null,
                shardCount: client.options.shardCount ?? null,
                referenceID: client.options.referenceID
            },
            t: null,
            s: null
        })

    }
}