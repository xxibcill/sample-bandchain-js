import bandchainjs from '@bandprotocol/bandchain.js'
const { Client, Wallet, Obi, Message, Coin, Transaction, Fee } = bandchainjs
import fs from 'fs'
import fetch from "node-fetch";

const grpcUrl = 'https://laozi-testnet5.bandchain.org/grpc-web'
const BAND_FAUCET_ENDPOINT = 'https://laozi-testnet5.bandchain.org/faucet'
const client = new Client(grpcUrl)

export const initWallet = (Mnemonic,accountIndex = 0) => {
    const DERIVATION_PATH = `m/44'/494'/0'/0/${accountIndex}`

    const { PrivateKey } = Wallet
    const privateKey = PrivateKey.fromMnemonic(Mnemonic,DERIVATION_PATH)
    const pubkey = privateKey.toPubkey()
    return [pubkey,privateKey]
}

export const makeRequest = async () => {
  // Step 1: Import a private key for signing transaction
  const [pubKey,privKey] = initWallet(MNEMONIC)
  const sender = pubKey.toAddress().toAccBech32()

  // Step 2.1: Prepare oracle request's properties
  const obi = new Obi('{symbols:[string],multiplier:u64}/{rates:[u64]}')
  const calldata = obi.encodeInput({ symbols: ['ETH'], multiplier: 100 })

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
  const signature = privateKey.sign(signDoc)

  const txRawBytes = txn.getTxData(signature, pubkey)

  // Step 4: Broadcast the transaction
  const sendTx = await client.sendTxBlockMode(txRawBytes)
  return sendTx
}

export const getFaucet = async (address,amount) => {
    const body = {
      address,
      amount
    }
  
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    }
  
    // See https://docs.bandchain.org/technical-specifications/band-endpoints.html#laozi-testnet-5
    let response = await fetch(`${BAND_FAUCET_ENDPOINT}`, options)
}

export const makeSendCoinTx = async (sender,receiver,amount) => {
    // Here we use different message type, which is MsgSend
    const sendAmount = new Coin()
    sendAmount.setDenom('uband')
    sendAmount.setAmount(amount + "")
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

export const signAndSendBlock = async (tx,privkey) => {
     // Sign the transaction
     const pubkey = privkey.toPubkey()
     const txSignData = tx.getSignDoc(pubkey)
     const signature = privkey.sign(txSignData)
     const signedTx = tx.getTxData(signature, pubkey)
   
     // Send the transaction
     const response = await client.sendTxBlockMode(signedTx)
     return response
}
