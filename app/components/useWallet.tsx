import React, { Dispatch, SetStateAction } from 'react'

export type WalletContextType = {
  mnemonic: string
  setMnemonic: Dispatch<SetStateAction<string>>
}

export const WalletContext = React.createContext<WalletContextType>({
  mnemonic: '',
  setMnemonic: () => {},
})

const useWallet = () => {
  const context = React.useContext(WalletContext)
  if (!context) {
    throw new Error(`useWallet must be used within a LedgerProvider`)
  }
  return context
}

export default useWallet
