import React, { useContext } from 'react'
import { makeSendCoinTx, signAndSendWithLedger } from '../Utils'
import { LedgerContext } from '../useLedger'

const SendCoins = () => {
  const { ledger, setLedger } = useContext(LedgerContext)

  const handleSend = async () => {
    if (ledger) {
      const isAppReady = await ledger.isCosmosAppOpen()
      console.log(isAppReady)
      console.log(await ledger.appInfo())

      // const addressObject = await ledger.getPubKeyAndBech32Address();
      // const tx = await makeSendCoinTx(addressObject.bech32_address, "band1pdvm6paaenlelmga2qkr50thpkrzwxy3gsr4xs", "100000");
      // const res = await signAndSendWithLedger(tx, ledger);
      // console.log(res);
    }
  }

  return (
    <div>
      <button onClick={handleSend}>send band</button>
    </div>
  )
}

export default SendCoins
