import { MessagePayload } from "@developerdragon/dragoncordapi";
import { ConcordiaClient } from "../client";
import { WebsocketManager } from "../WebsocketManager";

export abstract class MessageHandler {

    op: number = -1;

    abstract handle(client: ConcordiaClient, request: MessagePayload): void;

    register(manager: WebsocketManager) {
        manager.handlers.set(this.op, this);
    }
}
