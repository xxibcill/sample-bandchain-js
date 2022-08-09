import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import ConnectWallet from '../components/ConnectWallet'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <ConnectWallet/>
    </div>
  )
}

export default Home
