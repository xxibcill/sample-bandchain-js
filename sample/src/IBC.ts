import { Client, Wallet, Transaction, Message, Coin, Fee } from '@bandprotocol/bandchain.js'
import moment from 'moment'

const { PrivateKey } = Wallet
const client = new Client('https://laozi-testnet5.bandchain.org/grpc-web')
const privkey = PrivateKey.fromMnemonic('brown kite lady anger income eager left since brown cruise arch danger')

const pubkey = privkey.toPubkey()
const sender = pubkey.toAddress().toAccBech32()

const sendCoinIbc = async () => {
  // Step 1 constructs MsgTransfer message
  const { MsgTransfer } = Message

  const receiver = 'band1p46uhvdk8vr829v747v85hst3mur2dzlmlac7f'
  const sourcePort = 'transfer'
  const sourceChannel = 'channel-25'
  const sendAmount = new Coin()
  sendAmount.setDenom('uband')
  sendAmount.setAmount('10')
  const timeoutTimestamp = moment().unix() + 600 * 1e9 // timeout in 10 mins

//   constructor(sourcePort: string,sourceChannel: string,sender: string,receiver: string,token: Coin,timeoutTimestamp: number)
  const msg = new MsgTransfer(
    sourcePort,
    sourceChannel,
    sender,
    receiver,
    sendAmount,
    timeoutTimestamp
  )

  // Step 2 constructs a transaction
  const account = await client.getAccount(sender)
  const chainId = 'band-laozi-testnet5'

  let feeCoin = new Coin()
  feeCoin.setDenom('uband')
  feeCoin.setAmount('1000')

  const fee = new Fee()
  fee.setAmountList([feeCoin])
  fee.setGasLimit(1000000)
  const tx = new Transaction()
    .withMessages(msg)
    .withAccountNum(account.accountNumber)
    .withSequence(account.sequence)
    .withChainId(chainId)
    .withFee(fee)

  // Step 3 sign the transaction
  const txSignData = tx.getSignDoc(pubkey)
  const signature = privkey.sign(txSignData)
  const signedTx = tx.getTxData(signature, pubkey)

  // Step 4 send the transaction
  const response = await client.sendTxBlockMode(signedTx)
  console.log(response)
}

;(async () => {
  await sendCoinIbc()
})()
