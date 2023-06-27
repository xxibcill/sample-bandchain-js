'use client' // This is a client component 👈🏽

import { cosmos, InstallError } from '@cosmostation/extension-client'
import { Button, Box, styled } from '@mui/material'
import { Client, Wallet, Obi, Message, Coin, Transaction, Fee } from '@bandprotocol/bandchain.js'
import { Address, PublicKey } from '@bandprotocol/bandchain.js/lib/wallet'
import { SignDoc } from '@bandprotocol/bandchain.js/proto/cosmos/tx/v1beta1/tx_pb'

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
  const clickchain = async () => {
    try {
      console.log('connext')

      const provider = await cosmos()
      const supportedChains = await provider.getSupportedChains()
      const account = await provider.getAccount('bandtestnet')
      console.log(supportedChains)
      console.log(account)
      console.log('end')

      const obi = new Obi('{symbols:[string],multiplier:u64}/{rates:[u64]}')
      const calldata = obi.encodeInput({ symbols: ['ETH'], multiplier: 1000000 })
      let coin = new Coin()
      coin.setDenom('uband')
      coin.setAmount('200000')

      let feeCoin = new Coin()
      feeCoin.setDenom('uband')
      feeCoin.setAmount('5000')

      const requestMessage = new Message.MsgRequestData(
        111,
        calldata,
        16,
        10,
        'BandProtocol',
        account.address,
        [coin],
        20000,
        100000
      )

      const sendMsg = new Message.MsgSend(
        'band1zv4qrj04u8v9fg9a59gfpld0l0g6w9xeuypyxr',
        'band1zv4qrj04u8v9fg9a59gfpld0l0g6w9xeuypyxr',
        [coin]
      )

      const fee = new Fee()
      fee.setAmountList([feeCoin])
      fee.setGasLimit(2000000)
      const chainId = await client.getChainId()
      const txn = new Transaction()
      txn.withMessages(sendMsg)
      await txn.withSender(client, account.address)
      txn.withChainId(chainId)
      txn.withFee(fee)
      txn.withMemo('')

      const pubKey = PublicKey.fromHex(Buffer.from(account.publicKey).toString('hex'))

      const signDoc = txn.getSignDoc(pubKey)

      console.log('signDoc')
      console.log(signDoc)

      console.log('signDoc')
      const deserializedSignDoc = SignDoc.deserializeBinary(signDoc)
      console.log(deserializedSignDoc.getChainId())
      console.log(deserializedSignDoc.getAuthInfoBytes())
      console.log(deserializedSignDoc.getBodyBytes())

      const response = await provider.signDirect(
        'bandtestnet',
        {
          chain_id: deserializedSignDoc.getChainId(),
          account_number: deserializedSignDoc.getAccountNumber().toString(),
          auth_info_bytes: deserializedSignDoc.getAuthInfoBytes_asU8(),
          body_bytes: deserializedSignDoc.getBodyBytes_asU8(),
        },
        undefined
      )

      console.log(response.signature)

      const txRawBytes = txn.getTxData(Buffer.from(response.signature, 'base64'), pubKey, 1)

      // // Step 4: Broadcast the transaction
      const sendTx = await client.sendTxBlockMode(txRawBytes)
      console.log(sendTx)
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
        Connect Cosmostation
      </Button>
    </FullContainer>
  )
}
