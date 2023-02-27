import React, { Dispatch, SetStateAction, useState } from 'react'
import { Ledger } from '@bandprotocol/bandchain.js/lib/wallet'

export type LedgerContextType = {
  ledger: Ledger | undefined
  setLedger: Dispatch<SetStateAction<Ledger | undefined>>
}

export const LedgerContext = React.createContext<LedgerContextType>({
  ledger: undefined,
  setLedger: () => {},
})

const useLedger = () => {
  const context = React.useContext(LedgerContext)
  if (!context) {
    throw new Error(`useLedger must be used within a LedgerProvider`)
  }
  return context
}

export default useLedger
