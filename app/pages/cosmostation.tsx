'use client' // This is a client component 👈🏽

import { cosmos, InstallError } from '@cosmostation/extension-client'
import { Button, Box, styled } from '@mui/material'
import { Client, Wallet, Obi, Message, Coin, Transaction, Fee } from '@bandprotocol/bandchain.js'
import { Address, Ledger, PublicKey } from '@bandprotocol/bandchain.js/lib/wallet'
import { SignDoc } from '@bandprotocol/bandchain.js/proto/cosmos/tx/v1beta1/tx_pb'
import { Msg } from '@cosmostation/extension-client/types/message'

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
      const accountClient = await client.getAccount(account.address)
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

      const sendMsg = new Message.MsgSend(account.address, account.address, [coin])

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

      const aminoSignDoc = {
        chain_id: chainId,
        account_number: accountClient.accountNumber.toString(),
        sequence: accountClient.sequence.toString(),
        fee: {
          amount: [
            {
              denom: 'uband',
              amount: '50000',
            },
          ],
          gas: '200000',
        },
        msgs: [sendMsg.toJSON() as Msg],
        memo: '',
      }

      // const response = await provider.signDirect(
      //   'bandtestnet',
      //   {
      //     chain_id: deserializedSignDoc.getChainId(),
      //     account_number: deserializedSignDoc.getAccountNumber().toString(),
      //     auth_info_bytes: deserializedSignDoc.getAuthInfoBytes_asU8(),
      //     body_bytes: deserializedSignDoc.getBodyBytes_asU8(),
      //   },
      //   undefined
      // )

      const getSignDoc = (tx: Transaction) => ({
        account_number: tx.accountNum?.toString() as string,
        chain_id: tx.chainId as string,
        fee: {
          amount: tx.fee.getAmountList().map((coin) => coin.toObject()),
          gas: tx.fee.getGasLimit().toString(),
        },
        memo: tx.memo,
        msgs: tx.msgs.map((msg) => msg.toJSON()) as Msg<unknown>[],
        sequence: tx.sequence?.toString() as string,
      })

      const response = await provider.signAmino('bandtestnet', getSignDoc(txn))
      console.log(response.signature)
      // const ledger = await Ledger.connectLedgerWeb()
      // const ledgerSig = await ledger.sign(txn)
      // console.log(ledgerSig.toString('base64'))

      const txRawBytes = txn.getTxData(Buffer.from(response.signature, 'base64'), pubKey, 127)
      // const txRawBytes = txn.getTxData(ledgerSig, pubKey, 127)

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
