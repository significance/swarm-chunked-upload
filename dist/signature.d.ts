/// <reference types="node" />
import { PostageBatch } from '@ethersphere/bee-js';
export declare const TEST_BATCH_ID: string | undefined;
export declare const TEST_PRIVATE_KEY: string | undefined;
export declare function createSignature(address: Buffer, privateKey: Buffer, batchID: Buffer, index: Buffer, timestamp: number): Promise<Buffer>;
export declare function marshalPostageStamp(postageBatch: PostageBatch, timestamp: number, address: Buffer, privateKey: Buffer, chunkIndex: number, chunkBucket: number): Promise<Buffer>;
export declare function swarmAddressToBucketIndex(depth: number, address: Buffer): number;
