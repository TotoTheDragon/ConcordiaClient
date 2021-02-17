import { ConcordiaClient } from "../client";

export abstract class ClientPlugin {

    abstract identifier: string;

    abstract initialize(client: ConcordiaClient): void;

}