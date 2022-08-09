import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { LedgerContext } from '../components/useLedger'
import ConnectWallet from '../components/ConnectWallet'
import { Ledger } from '@bandprotocol/bandchain.js/lib/wallet'
import { useState } from 'react'
import SendCoins from '../components/SendCoins'


const Home: NextPage = () => {

  const [ledger,setLedger] = useState<Ledger | undefined>(undefined)

  return (
    <LedgerContext.Provider value={{ledger,setLedger}}>
      <div className={styles.container}>
        <ConnectWallet/>
        {
          ledger ? <SendCoins/> : null
        }
        
      </div>
    </LedgerContext.Provider>
  )
}

export default Home
