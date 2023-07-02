import { makeChunkedFile } from '@fairdatasociety/bmt-js'
import { readFileSync, writeFileSync } from 'fs'
import { marshalPostageStamp, swarmAddressToBucketIndex } from './signature'
import { type } from 'os'

main()

async function main() {
    const path = process.argv[2]
    const batchID = 'f8f97cc4e4a5e2cf364694db0889578b7390be33c4d5c46d5fffa516902501a1' // process.argv[3]
    const privateKey = 'be52c649a4c560a1012daa572d4e81627bcce20ca14e007aef87808a7fadd3d0' // process.argv[4]
    const rawBinaryFileData = readFileSync(path)
    const chunkedStamped = await chunkerStamper(rawBinaryFileData, batchID, privateKey)
    console.log(chunkedStamped)
}

interface Batch {
    batchID: string;
}

type Stamp = Buffer

interface StampedChunk {
    payload: Buffer;
    stamp: Stamp;
}

export async function chunkerStamper(payload: Buffer, batchID: string, privateKey: string) {
    const stampedChunks: StampedChunk[] = [];
    const chunkedFile = makeChunkedFile(payload)

    const levels = chunkedFile.bmt()
    let counter = 0
    for (const level of levels) {
        for (const chunk of level) {
            const chunkIndex = String(counter++).padStart(5, '0')
            const chunkAddressHex = Buffer.from(chunk.address()).toString('hex')
            const chunkPayload = Buffer.from(Uint8Array.from([...chunk.span(), ...chunk.payload]));
            const chunkBucket = swarmAddressToBucketIndex(16, Buffer.from(chunk.address()))
            const chunkBucketIndex = 0;
            const chunkStamp = await marshalPostageStamp(
                { batchID, depth: 17 } as unknown as any,
                Date.now(),
                Buffer.from(chunk.address()),
                Buffer.from(privateKey, 'hex'),
                chunkBucketIndex,
                chunkBucket
            )
            const stampedChunk = {payload: chunkPayload, stamp: chunkStamp}
            stampedChunks.push(stampedChunk)
        }
    }

    return stampedChunks;
}
