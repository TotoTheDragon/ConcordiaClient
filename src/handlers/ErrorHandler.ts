import { MessagePayload } from "@developerdragon/dragoncordapi";
import { clearInterval } from "timers";
import { ConcordiaClient } from "../client";
import { AbstractHandler } from "./AbstractHandler";

export class ErrorHandler extends AbstractHandler {

    op = -1;

    handle(client: ConcordiaClient, request: MessagePayload): void {

        clearInterval(client.wsManager.heartbeat);

        client.wsManager.ws = null;

        client.wsManager.startReconnect();

    }
}