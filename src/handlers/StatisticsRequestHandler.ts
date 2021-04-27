import { MessagePayload } from "@developerdragon/dragoncordapi";
import { ConcordiaClient } from "../client";
import { AbstractHandler } from "./AbstractHandler";

export class StatisticsRequestHandler extends AbstractHandler {

    op = 4;

    handle(client: ConcordiaClient, request: MessagePayload): void {

        const type: string = request.t;

        switch (type) {

            case "METRICS":
                client.wsManager.send({
                    op: 5,
                    t: "METRICS",
                    d: {
                        uptime: client.uptime
                    }
                });
                break;

            default:
                break;

        }


    }
}