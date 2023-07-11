/// <reference types="node" />
declare type Stamp = Buffer;
interface StampedChunk {
    address: string;
    payload: Buffer;
    stamp: Stamp;
}
export default function chunkerStamper(payload: Buffer, batchID: string, privateKey: string, timeStamp: number): Promise<StampedChunk[]>;
export {};
