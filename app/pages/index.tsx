import type { NextPage } from 'next'
import Header from '../components/Header';

import { LedgerContext } from '../components/useLedger'
import { Ledger } from '@bandprotocol/bandchain.js/lib/wallet'
import { useState } from 'react'
import ReferenceDataTable from '../components/StandardDataSet/ReferenceDataTable';

const Home: NextPage = () => {

  const [ledger,setLedger] = useState<Ledger | undefined>(undefined)

  return (
    <LedgerContext.Provider value={{ledger,setLedger}}>
      <Header/>
      <ReferenceDataTable/>
    </LedgerContext.Provider>
  )
}

export default Home
