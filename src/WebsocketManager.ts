import { MessagePayload } from "@developerdragon/dragoncordapi";
import WebSocket, { Data } from "ws";
import { ConcordiaClient } from "./client";
import { AbstractHandler } from "./handlers/AbstractHandler";
import { ConnectHandler } from "./handlers/ConnectHandler";
import { ErrorHandler } from "./handlers/ErrorHandler";

export class WebsocketManager {

    client: ConcordiaClient;

    ws: WebSocket;

    handlers: Map<number, AbstractHandler>;

    reconnectInterval: NodeJS.Timeout;

    heartbeat: NodeJS.Timeout;

    heartbeatInterval: number;

    lastSequence: number;

    constructor(client: ConcordiaClient) {
        this.client = client;

        /* Register client handlers */
        this.handlers = new Map();
        new ConnectHandler().register(this);
        new ErrorHandler().register(this);
        /* Start connection */
        this.connect();
    }

    connect() {
        if (this.ws?.OPEN) return; // Websocket is already open
        this.ws = new WebSocket(`ws://${this.client.options.host}:${this.client.options.port}`);
        if (!this.ws) return this.startReconnect();
        this.setupSocket();
    }

    setupSocket() {
        this.lastSequence = 0;
        this.ws.on("open", () => clearInterval(this.reconnectInterval)); // Remove auto reconnect when connected
        this.ws.on("close", () => this.startReconnect()); // Attempt reconnecting
        this.ws.on("error", () => this.startReconnect()); // Attempt reconnecting
        this.ws.on("message", (data: Data) => this.handleMessage(data.toString()));
    }


    handleMessage(message: string): void {
        try {
            const json: MessagePayload = JSON.parse(message);
            if (json.op === -1) throw Error("Error from server: " + json.d?.error);
            if (this.handlers.has(json.op)) return this.handlers.get(json.op).handle(this.client, json);
            console.log("Unknown opcode from server: ", json);
        } catch (err) {
            console.error(err);
            this.ws.terminate();
            this.startReconnect();
        }
    }

    send(json: MessagePayload): void {
        json.s = this.lastSequence++;
        this.ws.send(JSON.stringify(json));
    }

    startReconnect() {
        if (this.ws?.OPEN) return; // Websocket is already open
        this.ws = null; // Clear websocket
        this.reconnectInterval = setInterval(() => {
            console.log(`[CONCORDIA-CLIENT] Trying to reconnect to ${this.client.options.host}:${this.client.options.port}`);
            this.ws = new WebSocket(`ws://${this.client.options.host}:${this.client.options.port}`);
            if (this.ws) this.setupSocket();
        }, 30000);
    }

}