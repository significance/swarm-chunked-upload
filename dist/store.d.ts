/// <reference types="node" />
export declare function storeState(state: number[]): Buffer;
export declare function loadState(buffer: Buffer): number[];
export declare function readFileOrCreate(): Buffer;
