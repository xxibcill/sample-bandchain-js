import { Client, Wallet, Message, Coin, Transaction, Fee } from '@bandprotocol/bandchain.js'
import fs from 'fs'
import path from 'path'

const grpcURL = 'https://laozi-testnet6.bandchain.org/grpc-web'
const client = new Client(grpcURL)

// Setup the client
async function createOracleScript() {
  // Setup the wallet
  const { PrivateKey } = Wallet
  const MNEMONIC = 'brown kite lady anger income eager left since brown cruise arch danger'

  const privateKey = PrivateKey.fromMnemonic(MNEMONIC)
  const publicKey = privateKey.toPubkey()
  const sender = publicKey.toAddress().toAccBech32()

  // Setup the transaction's properties
  const chainId = await client.getChainId()
  const execPath = path.resolve(__dirname, '..', 'osexp.wasm')
  const file = fs.readFileSync(execPath)
  const code = Buffer.from(file)

  let feeCoin = new Coin()
  feeCoin.setDenom('uband')
  feeCoin.setAmount('0')

  // MsgCreateOracleScript arguments type
  //     name: string,
  //     code: Buffer,
  //     owner: string,
  //     sender: string,
  //     description?: string,
  //     schema?: string,
  //     sourceCodeUrl?: string

  const requestMessage = new Message.MsgCreateOracleScript(
    'OSEXP', // oracle script name
    code, // oracle script code
    sender, // owner
    sender, // sender
    '', // description
    '{repeat:u64}/{response:string}', // schema
    'https://chayanin.infura-ipfs.io/ipfs/QmRbWA6EfL8AHYAg3Mga8FqZaq66kTkXv7hGgjb6uTb3mh' // source code url
  )

  // Construct the transaction
  const fee = new Fee()
  fee.setAmountList([feeCoin])
  fee.setGasLimit(350000)

  const txn = new Transaction()
  txn.withMessages(requestMessage)
  await txn.withSender(client, sender)
  txn.withChainId(chainId)
  txn.withFee(fee)
  txn.withMemo('')

  // Sign the transaction
  const signDoc = txn.getSignDoc(publicKey)
  const signature = privateKey.sign(signDoc)
  const txRawBytes = txn.getTxData(signature, publicKey)

  // Broadcast the transaction
  const sendTx = await client.sendTxBlockMode(txRawBytes)

  return sendTx
}

;(async () => {
  console.log(await createOracleScript())
})()
