import { Client, Wallet, Obi, Message, Coin, Transaction, Fee }  from '@bandprotocol/bandchain.js'
import { PrivateKey } from '@bandprotocol/bandchain.js/lib/wallet'
import axios from 'axios'
import fs from 'fs'

const grpcUrl = 'https://laozi-testnet5.bandchain.org/grpc-web'
const BAND_FAUCET_ENDPOINT = 'https://laozi-testnet5.bandchain.org/faucet'

export const initWallet = (Mnemonic:string,accountIndex = 0) => {
    const DERIVATION_PATH = `m/44'/118'/0'/0/${accountIndex}`
    const privateKey = PrivateKey.fromMnemonic(Mnemonic,DERIVATION_PATH)
    return privateKey
}

export const makeRequestStd = async (privkey:PrivateKey) => {
    const client = new Client(grpcUrl)
    const pubkey = privkey.toPubkey()
    const sender = pubkey.toAddress().toAccBech32()

    const obi = new Obi('{symbols:[string],multiplier:u64}/{rates:[u64]}')
    const calldata = obi.encodeInput({ symbols: ['ETH','USDC'], multiplier: 100 })

    const oracleScriptId = 111
    const askCount = 4
    const minCount = 3
    const clientId = 'from_bandchain.js'

    let feeLimit = new Coin()
    feeLimit.setDenom('uband')
    feeLimit.setAmount('100000')

    const prepareGas = 100000
    const executeGas = 200000

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

    const fee = new Fee()
    fee.setAmountList([feeCoin])
    fee.setGasLimit(1000000)

    const chainId = await client.getChainId()
    const txn = new Transaction()
        .withMessages(requestMessage)
        .withFee(fee)
        .withMemo('')
        .withChainId(chainId)
    await txn.withSender(client, sender)

    // prepare transaction for signed
    const signDoc = txn.getSignDoc(pubkey)
    // use privateKey to sign transaction
    const signature = privkey.sign(signDoc)
    // compose transaction data with signature 
    const txRawBytes = txn.getTxData(signature, pubkey)

    // Broadcast the transaction
    const response = await client.sendTxBlockMode(txRawBytes)
    fs.writeFileSync("./data.json",JSON.stringify(response))
    return response
}

export const getFaucet = async (address:string,amount:string) => {
    const data = {
      address,
      amount
    }
  
    // See https://docs.bandchain.org/technical-specifications/band-endpoints.html#laozi-testnet-5
    return await axios.post('http://httpbin.org/post', data, { headers: { 'Content-Type': 'application/json;charset=utf-8',} });
}

export const makeSendCoinTx = async (sender:string,receiver:string,amount:string) => {
    const client = new Client(grpcUrl)
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

export const signAndSendBlock = async (tx:Transaction,privkey:PrivateKey) => {
const client = new Client(grpcUrl)
// Sign the transaction
     const pubkey = privkey.toPubkey()
     const txSignData = tx.getSignDoc(pubkey)
     const signature = privkey.sign(txSignData)
     const signedTx = tx.getTxData(signature, pubkey)
   
     // Send the transaction
     const response = await client.sendTxBlockMode(signedTx)
     return response
}

export const getReferenceData = async (pairs:string[]) => {
const client = new Client(grpcUrl)
const minCount = 3
    const askCount = 4
    return await client.getReferenceData(pairs, minCount, askCount)
}

export const getRequestResult = async (id:number) => {
const client = new Client(grpcUrl)
const response = await client.getRequestById(id)
    const obi = new Obi('{symbols:[string],multiplier:u64}/{rates:[u64]}')
    return obi.decodeOutput(Buffer.from(response.result.result as string, "base64"))
}