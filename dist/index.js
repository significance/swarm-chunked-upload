"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bmt_js_1 = require("@fairdatasociety/bmt-js");
const signature_1 = require("./signature");
async function chunkerStamper(payload, batchID, privateKey, timeStamp) {
    const stampedChunks = [];
    const chunkedFile = (0, bmt_js_1.makeChunkedFile)(payload);
    const levels = chunkedFile.bmt();
    let counter = 0;
    for (const level of levels) {
        for (const chunk of level) {
            const chunkIndex = String(counter++).padStart(5, '0');
            const chunkAddressHex = Buffer.from(chunk.address()).toString('hex');
            const chunkPayload = Buffer.from(Uint8Array.from([...chunk.span(), ...chunk.payload]));
            const chunkBucket = (0, signature_1.swarmAddressToBucketIndex)(16, Buffer.from(chunk.address()));
            const chunkBucketIndex = 0;
            const chunkStamp = await (0, signature_1.marshalPostageStamp)({ batchID, depth: 17 }, timeStamp, Buffer.from(chunk.address()), Buffer.from(privateKey, 'hex'), chunkBucketIndex, chunkBucket);
            const stampedChunk = { address: chunkAddressHex, payload: chunkPayload, stamp: chunkStamp };
            stampedChunks.push(stampedChunk);
        }
    }
    return stampedChunks;
}
exports.default = chunkerStamper;
