import { Wallet } from '@bandprotocol/bandchain.js'

const { Ledger } = Wallet

const connectLedger = async () => {
  const ledger = await Ledger.connectLedgerWeb()
  console.log(ledger)
}

;(async () => {
  await connectLedger()
})()
