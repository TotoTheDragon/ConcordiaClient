import { MessagePayload } from "@developerdragon/dragoncordapi";
import { clearInterval } from "timers";
import { ConcordiaClient } from "../client";
import { MessageHandler } from "./AbstractHandler";

export class ConnectHandler extends MessageHandler {

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
                shard: client.options.shard,
                shardCount: client.options.shardCount
            },
            t: null,
            s: null
        })

    }
}