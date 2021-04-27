import { config } from "dotenv";
config()
/*
    Constants
*/

export const DefaultConcordiaClientOptions: ConcordiaClientOptions = {
    host: "localhost",
    port: 7591,
    shard: 0,
    shardCount: 1,
    token: process.env.CONCORDIA_CLIENT_TOKEN || null,
    logLevel: "info",
    referenceID: process.env.CONCORDIA_REFERENCE_ID ?? null
}

/*
    Interfaces
*/

export interface ConcordiaClientOptions {
    host?: string,
    port?: number,
    shard?: number | number[],
    shardCount?: number,
    token?: string,
    logLevel?: string,
    referenceID?: string
}


/*
    Shard
*/

export enum ShardStatus {
    CLOSED = 0,
    LOGGING_IN = 1,
    LOGGED_IN = 2,
    CONNECTING = 3,
    CONNECTED = 4,
    DISCONNECTED = 5
}