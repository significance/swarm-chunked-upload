"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swarmAddressToBucketIndex = exports.marshalPostageStamp = exports.createSignature = exports.TEST_PRIVATE_KEY = exports.TEST_BATCH_ID = void 0;
const ethers_1 = require("ethers");
exports.TEST_BATCH_ID = process.env.DUMMY_STAMP;
exports.TEST_PRIVATE_KEY = process.env.DUMMY_PRIVATE_KEY;
async function createSignature(address, privateKey, batchID, index, timestamp) {
    if (!Buffer.isBuffer(address)) {
        throw Error('Expected address to be a Buffer');
    }
    if (!Buffer.isBuffer(privateKey)) {
        throw Error('Expected privateKey to be a Buffer');
    }
    if (!Buffer.isBuffer(batchID)) {
        throw Error('Expected batchID to be a Buffer');
    }
    if (address.length !== 32) {
        throw Error('Expected 32 byte address, got ' + address.length + ' bytes');
    }
    if (batchID.length !== 32) {
        throw Error('Expected 32 byte batchID, got ' + batchID.length + ' bytes');
    }
    if (privateKey.length !== 32) {
        throw Error('Expected 32 byte privateKey, got ' + privateKey.length + ' bytes');
    }
    const signer = new ethers_1.Wallet(privateKey.toString('hex'));
    const timestampBuffer = Buffer.alloc(8);
    timestampBuffer.writeBigUInt64BE(BigInt(timestamp));
    const packed = (0, ethers_1.solidityPacked)(['bytes32', 'bytes32', 'bytes8', 'bytes8'], [address, batchID, index, timestampBuffer]);
    const packedBuffer = Buffer.from(packed.slice(2), 'hex');
    const keccaked = (0, ethers_1.keccak256)(packedBuffer);
    const signable = Buffer.from(keccaked.startsWith('0x') ? keccaked.slice(2) : keccaked, 'hex');
    const signedHexString = await signer.signMessage(signable);
    const signed = Buffer.from(signedHexString.slice(2), 'hex');
    if (signed.length !== 65) {
        throw Error('Expected 65 byte signature, got ' + signed.length + ' bytes');
    }
    return signed;
}
exports.createSignature = createSignature;
// how are bucket changes handled on dilution?
async function marshalPostageStamp(postageBatch, timestamp, address, privateKey, chunkIndex, chunkBucket) {
    if (!Buffer.isBuffer(address)) {
        throw Error('Expected address to be a Buffer');
    }
    if (!Buffer.isBuffer(privateKey)) {
        throw Error('Expected privateKey to be a Buffer');
    }
    if (address.length !== 32) {
        throw Error('Expected 32 byte address, got ' + address.length + ' bytes');
    }
    if (privateKey.length !== 32) {
        throw Error('Expected 32 byte privateKey, got ' + privateKey.length + ' bytes');
    }
    const batchID = Buffer.from(postageBatch.batchID, 'hex');
    const index = bucketAndIndexToBuffer(chunkBucket, chunkIndex);
    const signature = await createSignature(address, privateKey, batchID, index, timestamp);
    const buffer = Buffer.alloc(32 + 8 + 8 + 65);
    batchID.copy(buffer, 0);
    index.copy(buffer, 32);
    buffer.writeBigUInt64BE(BigInt(timestamp), 40);
    signature.copy(buffer, 48);
    return buffer;
}
exports.marshalPostageStamp = marshalPostageStamp;
function swarmAddressToBucketIndex(depth, address) {
    if (address.length !== 32) {
        throw Error('Expected 32 byte address, got ' + address.length + ' bytes');
    }
    if (depth < 16 || depth > 100) {
        throw Error('Expected depth between 16 and 100, got ' + depth);
    }
    const i = address.readUInt32BE(0);
    return i >>> (32 - depth);
}
exports.swarmAddressToBucketIndex = swarmAddressToBucketIndex;
function bucketAndIndexToBuffer(bucket, index) {
    const buffer = Buffer.alloc(8);
    buffer.writeUInt32BE(bucket);
    buffer.writeUInt32BE(index, 4);
    return buffer;
}
