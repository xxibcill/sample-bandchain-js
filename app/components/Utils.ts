import { Client, Wallet, Obi, Message, Coin, Transaction, Fee } from '@bandprotocol/bandchain.js'
import { Ledger, PrivateKey } from '@bandprotocol/bandchain.js/lib/wallet'
import axios from 'axios'
import fs from 'fs'

// const grpcUrl = 'https://laozi-testnet6.bandchain.org/grpc-web'
const grpcUrl = 'https://laozi1.bandchain.org/grpc-web'
const BAND_FAUCET_ENDPOINT = 'https://laozi-testnet6.bandchain.org/faucet'
const client = new Client(grpcUrl)

export const initWallet = (Mnemonic: string, accountIndex = 0) => {
  const DERIVATION_PATH = `m/44'/118'/0'/0/${accountIndex}`

  const { PrivateKey } = Wallet
  const privateKey = PrivateKey.fromMnemonic(Mnemonic, DERIVATION_PATH)
  return privateKey
}

export const makeRequestStd = async (privkey: PrivateKey) => {
  const pubkey = privkey.toPubkey()
  const sender = pubkey.toAddress().toAccBech32()

  // Step 2.1: Prepare oracle request's properties
  const obi = new Obi('{symbols:[string],multiplier:u64}/{rates:[u64]}')
  const calldata = obi.encodeInput({ symbols: ['ETH', 'USDC'], multiplier: 100 })

  const oracleScriptId = 111
  const askCount = 4
  const minCount = 3
  const clientId = 'from_bandchain.js'

  let feeLimit = new Coin()
  feeLimit.setDenom('uband')
  feeLimit.setAmount('100000')

  const prepareGas = 100000
  const executeGas = 200000

  // Step 2.2: Create an oracle request message
  const requestMessage = new Message.MsgRequestData(
    oracleScriptId,
    calldata,
    askCount,
    minCount,
    clientId,
    sender,
    [feeLimit],
    prepareGas,
    executeGas
  )

  let feeCoin = new Coin()
  feeCoin.setDenom('uband')
  feeCoin.setAmount('50000')

  // Step 3.1: Construct a transaction
  const fee = new Fee()
  fee.setAmountList([feeCoin])
  fee.setGasLimit(1000000)

  const chainId = await client.getChainId()
  const txn = new Transaction()
  txn.withMessages(requestMessage)
  await txn.withSender(client, sender)
  txn.withChainId(chainId)
  txn.withFee(fee)
  txn.withMemo('')

  // Step 3.2: Sign the transaction using the private key
  const signDoc = txn.getSignDoc(pubkey)
  const signature = privkey.sign(signDoc)

  const txRawBytes = txn.getTxData(signature, pubkey)

  // Step 4: Broadcast the transaction
  const response = await client.sendTxBlockMode(txRawBytes)
  fs.writeFileSync('./data.json', JSON.stringify(response))
  return response
}

export const getFaucet = async (address: string, amount: string) => {
  const data = {
    address,
    amount,
  }

  // See https://docs.bandchain.org/technical-specifications/band-endpoints.html#laozi-testnet-5
  return await axios.post('http://httpbin.org/post', data, {
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  })
}

export const makeSendCoinTx = async (sender: string, receiver: string, amount: string) => {
  console.log(sender)
  console.log(receiver)
  console.log(amount)

  // Here we use different message type, which is MsgSend
  const sendAmount = new Coin()
  sendAmount.setDenom('uband')
  sendAmount.setAmount(amount)
  const msg = new Message.MsgSend(sender, receiver, [sendAmount])

  // constructs a transaction
  const account = await client.getAccount(sender)
  const chainId = await client.getChainId()

  let feeCoin = new Coin()
  feeCoin.setDenom('uband')
  feeCoin.setAmount('1000')

  const fee = new Fee()
  fee.setAmountList([feeCoin])
  fee.setGasLimit(1000000)
  return new Transaction()
    .withMessages(msg)
    .withAccountNum(account.accountNumber)
    .withSequence(account.sequence)
    .withChainId(chainId)
    .withFee(fee)
}

export const signAndSendBlock = async (tx: Transaction, privkey: PrivateKey) => {
  // Sign the transaction
  const pubkey = privkey.toPubkey()
  const txSignData = tx.getSignDoc(pubkey)
  const signature = privkey.sign(txSignData)
  const signedTx = tx.getTxData(signature, pubkey)

  // Send the transaction
  const response = await client.sendTxBlockMode(signedTx)
  return response
}

export const signAndSendWithLedger = async (tx: Transaction, ledger: Ledger) => {
  const { pubKey } = await ledger.getPubKeyAndBech32Address()
  // Sign a message with Ledger device
  const signature = await ledger.sign(tx)
  const signedTx = tx.getTxData(signature, pubKey, 127)

  // Create a transaction
  const response = await client.sendTxBlockMode(signedTx)
  return response
}

export const getReferenceData = async (pairs: string[], minCount = 10, askCount = 16) => {
  return await client.getReferenceData(pairs, minCount, askCount)
}

export const getRequestResult = async (id: number) => {
  client
    .getRequestById(id)
    .then((response) => {
      const obi = new Obi('{symbols:[string],multiplier:u64}/{rates:[u64]}')
      if (response.result) {
        return obi.decodeOutput(Buffer.from(response.result.result as string, 'base64'))
      } else {
        return ''
      }
    })
    .catch((err) => {
      return err
    })
}

export async function exampleSendBlockTransaction() {
  // Step 1: Import a private key for signing transaction
  const { PrivateKey } = Wallet
  const mnemonic = 'test'
  const privateKey = PrivateKey.fromMnemonic(mnemonic)
  const pubkey = privateKey.toPubkey()
  const sender = pubkey.toAddress().toAccBech32()

  // Step 2.1: Prepare oracle request's properties
  const obi = new Obi('{symbols:[string],multiplier:u64}/{rates:[u64]}')
  const calldata = obi.encodeInput({ symbols: ['ETH'], multiplier: 1000000 })
  let coin = new Coin()
  coin.setDenom('uband')
  coin.setAmount('2000')

  let feeCoin = new Coin()
  feeCoin.setDenom('uband')
  feeCoin.setAmount('20000')

  // Step 2.2: Create an oracle request message
  const requestMessage = new Message.MsgRequestData(
    111,
    calldata,
    16,
    10,
    'BandProtocol',
    sender,
    [coin],
    20000,
    100000
  )

  // Step 3.1: Construct a transaction
  const fee = new Fee()
  fee.setAmountList([feeCoin])
  fee.setGasLimit(2000000)
  const chainId = await client.getChainId()
  const txn = new Transaction()
  txn.withMessages(requestMessage)
  await txn.withSender(client, sender)
  txn.withChainId(chainId)
  txn.withFee(fee)
  txn.withMemo('')

  // Step 3.2: Sign the transaction using the private key
  const signDoc = txn.getSignDoc(pubkey)
  const signature = privateKey.sign(signDoc)

  const txRawBytes = txn.getTxData(signature, pubkey)

  // Step 4: Broadcast the transaction
  const sendTx = await client.sendTxBlockMode(txRawBytes)

  return sendTx
}
