import chunkerStamper from './index'
import { readFileSync } from 'fs'



const expectedChunkedStamped_0 = [
    {
      payload: Buffer.from("0b0000000000000068656c6c6f20776f72646c", "hex"),
      stamp: Buffer.from("f8f97cc4e4a5e2cf364694db0889578b7390be33c4d5c46d5fffa516902501a10000cbe5000000000000018921ff0dbb5a84731dd86593716297dfe32d64cb4554f6fa43f5644bbdb4e90e9db041cfde2b275a002485a864cb85b45a2f24cb945d9140db10af89ff425241d165769ffb1c", "hex")
    }
  ]

test('chunkerStampers', async () => {
    const timeStamp = 1688492510651;
    const payload = Buffer.from("hello wordl")
    const batchID = 'f8f97cc4e4a5e2cf364694db0889578b7390be33c4d5c46d5fffa516902501a1' // process.argv[3]
    const privateKey = 'be52c649a4c560a1012daa572d4e81627bcce20ca14e007aef87808a7fadd3d0' // process.argv[4]
    const chunkedStamped = await chunkerStamper(payload, batchID, privateKey, timeStamp)

    expect(chunkedStamped.length).toBe(1)
    expect(chunkedStamped[0].stamp).toEqual(expectedChunkedStamped_0[0].stamp)
    expect(chunkedStamped[0].payload).toEqual(expectedChunkedStamped_0[0].payload)
})