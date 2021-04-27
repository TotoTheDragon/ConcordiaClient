import { config } from "dotenv";
config()
/*
    Constants
*/

export const DefaultConcordiaClientOptions: ConcordiaClientOptions = {
    host: process.env.CONCORDIA_MANAGER_HOST ?? "127.0.0.1",
    port: process.env.CONCORDIA_MANAGER_PORT as unknown as number ?? 7591,
    APIhost: process.env.CONCORDIA_API_HOST ?? "127.0.0.1",
    APIport: process.env.CONCORDIA_API_PORT as unknown as number ?? 3000,
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
    APIhost?: string,
    APIport?: number,
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