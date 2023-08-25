'use client' // This is a client component 👈🏽

import { cosmos, InstallError } from '@cosmostation/extension-client'
import { Button, Box, styled } from '@mui/material'
import { Client, Wallet, Obi, Message, Coin, Transaction, Fee } from '@bandprotocol/bandchain.js'
import { Address, PublicKey } from '@bandprotocol/bandchain.js/lib/wallet'
import { SignDoc } from '@bandprotocol/bandchain.js/proto/cosmos/tx/v1beta1/tx_pb'
import Long from 'long'
import { useEffect, useState } from 'react'
import { Coin as keplrCoin, Msg } from '@keplr-wallet/types'

const FullContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
})

const grpcEndpoint = 'https://laozi-testnet6.bandchain.org/grpc-web'
const client = new Client(grpcEndpoint)

export default () => {
  const [address, setAddress] = useState('')
  const [pubKeyU8, setPubKeyU8] = useState(Uint8Array.from([]))

  useEffect(() => {
    const initKeplr = async () => {
      const chainId = await client.getChainId()

      if (window.keplr) {
        // Enabling before using the Keplr is recommended.
        // This method will ask the user whether to allow access if they haven't visited this website.
        // Also, it will request that the user unlock the wallet if the wallet is locked.
        await window.keplr.enable(chainId)
        const keplrKey = await window.keplr.getKey(chainId)
        console.log(keplrKey)

        setAddress(keplrKey.bech32Address)
        setPubKeyU8(keplrKey.pubKey)
      }
    }
    initKeplr()
  }, [])

  const clickchain = async () => {
    try {
      console.log('sign')

      // const { PrivateKey } = Wallet
      // const mnemonic =
      //   'father alert token begin soap appear demise leader else inhale squirrel rich'
      // const privateKey = PrivateKey.fromMnemonic(mnemonic, "m/44'/118'/0'/0/0")
      // const pubkeyMnemo = privateKey.toPubkey()
      // const sender = pubkeyMnemo.toAddress().toAccBech32()

      const obi = new Obi('{symbols:[string],multiplier:u64}/{rates:[u64]}')
      const calldata = obi.encodeInput({ symbols: ['ETH'], multiplier: 1000000 })
      let coin = new Coin()
      coin.setDenom('uband')
      coin.setAmount('200000')

      let feeCoin = new Coin()
      feeCoin.setDenom('uband')
      feeCoin.setAmount('200000')

      const requestMessage = new Message.MsgRequestData(
        111,
        calldata,
        16,
        10,
        'BandProtocol',
        address,
        [coin],
        20000,
        100000
      )

      const sendMessage = new Message.MsgSend(address, address, [coin])

      const account = await client.getAccount(address)
      const sequence = account.sequence

      const fee = new Fee()
      fee.setAmountList([feeCoin])
      fee.setGasLimit(2000000)
      const chainId = await client.getChainId()
      const txn = new Transaction()
      txn.withMessages(requestMessage)
      await txn.withSender(client, address)
      txn.withSequence(sequence)
      txn.withChainId(chainId)
      txn.withFee(fee)
      txn.withMemo('')

      const pubKey = PublicKey.fromHex(Buffer.from(pubKeyU8).toString('hex'))

      const signDoc = txn.getSignDoc(pubKey)

      const deserializedSignDoc = SignDoc.deserializeBinary(signDoc)

      const directSignDoc = {
        bodyBytes: deserializedSignDoc.getBodyBytes_asU8(),
        authInfoBytes: deserializedSignDoc.getAuthInfoBytes_asU8(),
        chainId: deserializedSignDoc.getChainId(),
        accountNumber: Long.fromNumber(deserializedSignDoc.getAccountNumber()),
      }
      const aminoSignDoc = {
        chain_id: deserializedSignDoc.getChainId(),
        account_number: deserializedSignDoc.getAccountNumber().toString(),
        sequence: account.sequence.toString(),
        fee: {
          amount: [
            {
              denom: 'uband',
              amount: '50000',
            } as keplrCoin,
          ],
          gas: '200000',
        },
        msgs: [sendMessage.toJSON() as Msg],
        memo: '',
      }

      if (window.keplr) {
        // const response = await window.keplr.signDirect(chainId, address, directSignDoc, {
        //   preferNoSetFee: true,
        //   preferNoSetMemo: false,
        //   disableBalanceCheck: false,
        // })

        console.log(aminoSignDoc)

        const getSignDoc = (tx: Transaction) => ({
          account_number: tx.accountNum?.toString() as string,
          chain_id: tx.chainId as string,
          fee: {
            amount: tx.fee.getAmountList().map((coin) => coin.toObject()),
            gas: tx.fee.getGasLimit().toString(),
          },
          memo: tx.memo,
          msgs: tx.msgs.map((msg) => msg.toJSON()) as Msg[],
          sequence: tx.sequence?.toString() as string,
        })

        const response = await window.keplr.signAmino(chainId, address, getSignDoc(txn), {
          preferNoSetFee: true,
          preferNoSetMemo: false,
          disableBalanceCheck: false,
        })

        // const signature = privateKey.sign(signDoc)
        // console.log(signature.toString('base64'))
        console.log(response)

        const txRawBytes = txn.getTxData(
          Buffer.from(response.signature.signature, 'base64'),
          pubKey,
          127
        )

        // Step 4: Broadcast the transaction
        const sendTx = await client.sendTxBlockMode(txRawBytes)
        console.log(sendTx)
      }
    } catch (e) {
      console.log('err')
      console.log(e)

      if (e instanceof InstallError) {
        console.log('not installed')
      }
    }
  }

  return (
    <FullContainer>
      <Button variant="contained" onClick={clickchain}>
        Connect Keplr
      </Button>
    </FullContainer>
  )
}
