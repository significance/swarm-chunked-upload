"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signature_1 = require("./signature");
test('swarmAddressToBucketIndex', async () => {
    const bucketIndex = (0, signature_1.swarmAddressToBucketIndex)(20, Buffer.from('1000000000000000000000000000000000000000000000000000000000000001', 'hex'));
    expect(bucketIndex).toBe(65536);
});
test('marshalPostageStamp', async () => {
    const marshalled = await (0, signature_1.marshalPostageStamp)({
        batchID: '1000000000000000000000000000000000000000000000000000000000000001',
        depth: 20
    }, 200, Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'), Buffer.from('2222222222222222222222222222222222222222222222222222222222222222', 'hex'), 0, 0);
    expect(marshalled).toHaveLength(113); // todo
});
