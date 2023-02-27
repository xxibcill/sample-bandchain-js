import React, { useContext } from 'react'
import Link from 'next/link'
import { Toolbar, Button, IconButton, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ConnectLedgerButton from './ConnectLedgerButton'
import ConnectWalletButton from './ConnectWalletButton'
import { WalletContext } from './useWallet'
import { LedgerContext } from './useLedger'

function Header() {
  const { mnemonic, setMnemonic } = useContext(WalletContext)
  const { ledger, setLedger } = useContext(LedgerContext)

  return (
    <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Link href="/cosmos">
        <a>Cosmos Ver.</a>
      </Link>
      <Typography
        component="h2"
        variant="h5"
        color="inherit"
        align="center"
        noWrap
        sx={{ flex: 1 }}
      >
        Band Protocol
      </Typography>
      <IconButton>
        <SearchIcon />
      </IconButton>
      {mnemonic || !(mnemonic || ledger) ? <ConnectWalletButton /> : null}
      {ledger || !(mnemonic || ledger) ? <ConnectLedgerButton /> : null}
    </Toolbar>
  )
}

export default Header
