import React, { Dispatch, SetStateAction } from 'react'
import { cosmos, InstallError, Cosmos } from '@cosmostation/extension-client'

export type ContextType = {
  provider: Cosmos
}

export const WalletContext = React.createContext<ContextType>({
  provider: {} as Cosmos,
})

const useWallet = async () => {
  const provider = await cosmos()
  const context = React.useContext(WalletContext)
  if (!context) {
    throw new Error(`useWallet must be used within a LedgerProvider`)
  }
  return context
}

export default useWallet
