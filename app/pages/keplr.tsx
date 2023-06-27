'use client' // This is a client component 👈🏽

import { cosmos, InstallError } from '@cosmostation/extension-client'
import { Button, Box, styled } from '@mui/material'
import { Client, Wallet, Obi, Message, Coin, Transaction, Fee } from '@bandprotocol/bandchain.js'
import { Address, PublicKey } from '@bandprotocol/bandchain.js/lib/wallet'
import { SignDoc } from '@bandprotocol/bandchain.js/proto/cosmos/tx/v1beta1/tx_pb'
import Long from 'long'
import { useEffect, useState } from 'react'

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

      const { PrivateKey } = Wallet
      const mnemonic =
        'father alert token begin soap appear demise leader else inhale squirrel rich'
      const privateKey = PrivateKey.fromMnemonic(mnemonic, "m/44'/118'/0'/0/0")
      const pubkey = privateKey.toPubkey()
      const sender = pubkey.toAddress().toAccBech32()
      console.log(sender)

      const obi = new Obi('{symbols:[string],multiplier:u64}/{rates:[u64]}')
      const calldata = obi.encodeInput({ symbols: ['ETH'], multiplier: 1000000 })
      let coin = new Coin()
      coin.setDenom('uband')
      coin.setAmount('2000')

      let feeCoin = new Coin()
      feeCoin.setDenom('uband')
      feeCoin.setAmount('20000')

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

      const account = await client.getAccount(sender)
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

      console.log(txn.msgs[0].toString())

      const pubKey = PublicKey.fromHex(Buffer.from(pubKeyU8).toString('hex'))

      console.log(Buffer.from(pubKeyU8).toString('hex') == pubkey.toHex())

      const signDoc = txn.getSignDoc(pubKey)
      const signDoc2 = txn.getSignDoc(pubkey)

      const deserializedSignDoc = SignDoc.deserializeBinary(signDoc)
      const deserializedSignDoc2 = SignDoc.deserializeBinary(signDoc2)

      console.log('gg')

      console.log(Buffer.from(signDoc).toString('hex'))
      console.log(Buffer.from(deserializedSignDoc.getAuthInfoBytes_asU8()).toString('hex'))

      console.log(
        Buffer.compare(
          deserializedSignDoc.getAuthInfoBytes_asU8(),
          deserializedSignDoc2.getAuthInfoBytes_asU8()
        )
      )

      console.log(
        Buffer.compare(
          deserializedSignDoc.getBodyBytes_asU8(),
          deserializedSignDoc2.getBodyBytes_asU8()
        )
      )

      console.log(deserializedSignDoc.getChainId())
      console.log(chainId)

      const plainSignDoc = {
        bodyBytes: deserializedSignDoc.getBodyBytes_asU8(),
        authInfoBytes: deserializedSignDoc.getAuthInfoBytes_asU8(),
        chainId: deserializedSignDoc.getChainId(),
        accountNumber: Long.fromNumber(deserializedSignDoc.getAccountNumber()),
      }

      if (window.keplr) {
        //   // Enabling before using the Keplr is recommended.
        //   // This method will ask the user whethe r to allow access if they haven't visited this website.
        //   // Also, it will request that the user unlock the wallet if the wallet is locked.
        // const offlineSigner = window.keplr.getOfflineSigner(chainId)
        console.log('test')
        console.log((await window.keplr.getKey(chainId)).name)
        const signer = await window.keplr.getOfflineSigner(chainId)
        console.log('for god sake')
        console.log(plainSignDoc)
        const response = await window.keplr.signDirect(chainId, address, plainSignDoc, {
          preferNoSetFee: true,
          preferNoSetMemo: false,
          disableBalanceCheck: false,
        })
        // const response = await offlineSigner.signDirect(address, plainSignDoc)
        console.log(response)
        // const accounts = await offlineSigner.getAccounts()
        // console.log(accounts[0])

        const signature = privateKey.sign(signDoc)
        console.log(signature.toString('base64'))
        console.log(response.signature.signature)

        const txRawBytes = txn.getTxData(
          Buffer.from(response.signature.signature, 'base64'),
          pubKey
        )
        // const txRawBytes = txn.getTxData(signature, pubkey)

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
