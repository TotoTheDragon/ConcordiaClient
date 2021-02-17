/*
    Constants
*/

export const DefaultConcordiaClientOptions = {
    host: "localhost",
    port: 7591,
    shard: 0,
    shardCount: 1,
    token: process.env.TOKEN || null
}

/*
    Interfaces
*/

export interface ConcordiaClientOptions {
    host?: string,
    port?: number,
    shard?: number | number[],
    shardCount?: number,
    token?: string
}
