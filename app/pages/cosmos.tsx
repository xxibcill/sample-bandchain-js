import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import AppBtc from "@ledgerhq/hw-app-btc";
import { useState } from 'react';
import CosmosApp from 'ledger-cosmos-js'

const DEFAULT_DERIVATION_PATH_LEDGER = "m/44'/118'/0'/0/0"

function isBip44(path: string): boolean {
  let result = path.match(/m\/\d+'\/\d+'\/\d+'\/\d+\/\d+$/)
  return !!result
}

function bip44ToArray(path: string): number[] {
  if (!isBip44(path)) throw Error('Not BIP 44')
  let result = path.match(/\d+/g)
  if ((result?.length ?? 0) !== 5) throw Error('Not BIP 44')
  return result!.map((x: string) => parseInt(x))
}

const Home: NextPage = () => {

  const [address,setAddress] = useState("")
  const [cosmosApp,setCosmosapp] = useState()

  const handleBTC = async () => {
    try {
      const transport = await TransportWebUSB.create();
      transport.setDebugMode();
      const appBtc = new AppBtc(transport);
      const { bitcoinAddress } = await appBtc.getWalletPublicKey("44'/0'/0'/0/0");
      setAddress(bitcoinAddress)
    } catch (err) {
      console.log(err);
      
    }
  }

  const handleCosmos = async () => {
    const transport = await TransportWebUSB.create(3)
    const ledgerCosmosApp = new CosmosApp(transport)
    setCosmosapp(ledgerCosmosApp)
  }

  return (
    <div className={styles.container}>
      <h4>{address}</h4>
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={handleBTC}>Connect BTC</button>
        <button className={styles.button} onClick={handleCosmos}>{cosmosApp ? "Cosmos Connected" : "Connect Cosmos"}</button>
      </div>
    </div>
  )
}

export default Home
