import { MessagePayload } from "@developerdragon/dragoncordapi";
import { clearInterval } from "timers";
import { ConcordiaClient } from "../client";
import { MessageHandler } from "./AbstractHandler";

export class ErrorHandler extends MessageHandler {

    op = -1;

    handle(client: ConcordiaClient, request: MessagePayload): void {

        clearInterval(client.heartbeat);

        client.ws = null;

        client.startReconnect();

    }
}