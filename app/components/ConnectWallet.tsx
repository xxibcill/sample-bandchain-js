import { useState } from 'react'
import { Ledger } from '@bandprotocol/bandchain.js/lib/wallet'

const ConnectWallet = () => {

  const [ledger,setLedger] = useState<Ledger>()
  const [address,setAddress] = useState("")
  
  const handleClick = async () => {
    const res = await Ledger.connectLedgerWeb()
    console.log(res);
    setLedger(res)
    const addressObject = await res.getPubKeyAndBech32Address()
    setAddress(addressObject.bech32_address)
  }

  return (
    <div>
      <h1>{address}</h1>
      {
        ledger ? <div></div> : <button onClick={handleClick}>connect</button>
      }
      
    </div>
  )
}

export default ConnectWallet