import { MessagePayload } from "@developerdragon/dragoncordapi";
import WebSocket, { Data } from "ws";
import { ConcordiaClient } from "./client";
import { AbstractHandler } from "./handlers/AbstractHandler";
import { ConnectHandler } from "./handlers/ConnectHandler";
import { ErrorHandler } from "./handlers/ErrorHandler";
import { StatisticsRequestHandler } from "./handlers/StatisticsRequestHandler";

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

        this._onWSOpen = this._onWSOpen.bind(this);
        this._onWSError = this._onWSError.bind(this);
        this._onWSClose = this._onWSClose.bind(this);
        this._onWSMessage = this._onWSMessage.bind(this);

        /* Register client handlers */
        this.handlers = new Map();
        new ConnectHandler().register(this);
        new ErrorHandler().register(this);
        new StatisticsRequestHandler().register(this);

        /* Start connection */
        this.connect();
    }

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) return; // Websocket is already open
        this.ws = new WebSocket(`ws://${this.client.options.host}:${this.client.options.port}`);
        if (!this.ws) return this.startReconnect();
        this.setupSocket();
    }

    setupSocket() {
        this.lastSequence = 0;
        this.ws.on("open", this._onWSOpen);
        this.ws.on("close", this._onWSClose);
        this.ws.on("error", this._onWSError);
        this.ws.on("message", this._onWSMessage);
    }

    _onWSOpen() {
        this.client.logger.info("Connection opened", "websocket", "concordia");
        clearInterval(this.reconnectInterval); // Remove auto reconnect when connected
        this.reconnectInterval = null;
    }

    _onWSError(err: Error) {
        this.client.logger.error("Received websocket error", "websocket", "concordia", err)
    }

    _onWSClose(code: number, reason: string) {
        if (code >= 4000 && code <= 4100)
            return this.client.logger.error("Disconnected from concordia", "websocket", "concordia", "disconnect", { code, reason });

        this.client.logger.info("Disconnected from concordia", "websocket", "concordia", "disconnect", { code, reason });
        this.startReconnect(); // Attempt reconnecting
    }

    _onWSMessage(message: Data): void {
        try {
            const json: MessagePayload = JSON.parse(message.toString());
            if (json.op === -1) throw Error("Error from server: " + json.d?.error);
            if (this.handlers.has(json.op)) return this.handlers.get(json.op).handle(this.client, json);
            this.client.logger.warn("Received unknown opcode", "websocket", "concordia", { json })
        } catch (err) {
            this.client.logger.error("Error parsing websocket message", "websocket", "concordia", err, { message })
            this.ws.terminate();
            this.startReconnect();
        }
    }

    send(json: MessagePayload): void {
        json.s = this.lastSequence++;
        this.ws.send(JSON.stringify(json));
    }

    startReconnect() {
        if (this.reconnectInterval) return;
        if (this.ws != null && (this.ws.readyState === this.ws.OPEN || this.ws.readyState === this.ws.CONNECTING)) return; // Websocket is already open or reconnecting
        this.ws = null; // Clear websocket
        this.client.logger.debug("Started reconnecting", "websocket", "concordia", "connecting", { interval: 10000 });
        this.reconnectInterval = setInterval(() => {
            this.client.logger.debug("Trying to reconnect", "websocket", "concordia", "connecting", { ip: `${this.client.options.host}:${this.client.options.port}` });
            this.ws = new WebSocket(`ws://${this.client.options.host}:${this.client.options.port}`);
            this.setupSocket();
        }, 10000);
    }

}