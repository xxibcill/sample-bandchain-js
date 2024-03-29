import type { NextPage } from 'next'
import Header from '../components/Header'

import { LedgerContext } from '../components/useLedger'
import { WalletContext } from '../components/useWallet'
import { Ledger } from '@bandprotocol/bandchain.js/lib/wallet'
import { useState } from 'react'
import ReferenceDataTable from '../components/StandardDataSet/ReferenceDataTable'

const Home: NextPage = () => {
  const [cosmos, setCosmos] = useState<Ledger | undefined>(undefined)
  const [ledger, setLedger] = useState<Ledger | undefined>(undefined)
  const [mnemonic, setMnemonic] = useState<string>('')

  return (
    <WalletContext.Provider value={{ mnemonic, setMnemonic }}>
      <LedgerContext.Provider value={{ ledger, setLedger }}>
        <Header />
        <ReferenceDataTable />
      </LedgerContext.Provider>
    </WalletContext.Provider>
  )
}

export default Home
