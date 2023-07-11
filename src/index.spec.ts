import chunkerStamper from './index'
import { readFileSync } from 'fs'



const expectedChunkedStamped_0 = [
    {
      address: "cbe563e4865fd01948a1180081bbb7e144204344012dea8ce6e86d36dbc63495",
      payload: Buffer.from("0b0000000000000068656c6c6f20776f72646c", "hex"),
      stamp: Buffer.from("c3387832bb1b88acbcd0ffdb65a08ef077d98c08d4bee576a72dbe3d367613690000cbe5000000000000018921ff0dbb29169df9e6364e26c6ca6b17745c10b9d6a36ea38e204f2e3cc64a8373c0661f5bb0a347c61d8d1689b0dcf8354117686a6a18d08cff927f526de5fc61b2b7491b", "hex")
    }
  ]

test('chunkerStampers', async () => {
    const timeStamp = 1688492510651;
    const payload = Buffer.from("hello wordl")
    const batchID = 'c3387832bb1b88acbcd0ffdb65a08ef077d98c08d4bee576a72dbe3d36761369' // process.argv[3]
    const privateKey = 'be52c649a4c560a1012daa572d4e81627bcce20ca14e007aef87808a7fadd3d0' // process.argv[4]
    const chunkedStamped = await chunkerStamper(payload, batchID, privateKey, timeStamp)

    expect(chunkedStamped.length).toBe(1)
    expect(chunkedStamped[0].address).toEqual(expectedChunkedStamped_0[0].address)
    expect(chunkedStamped[0].stamp).toEqual(expectedChunkedStamped_0[0].stamp)
    expect(chunkedStamped[0].payload).toEqual(expectedChunkedStamped_0[0].payload)
})