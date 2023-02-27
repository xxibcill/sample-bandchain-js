import * as React from 'react'
import { useContext, useState } from 'react'
import { WalletContext } from './useWallet'
import { Button, TextField, Dialog } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'rgb(0, 30, 60)',
  border: '1px solid #000',
  p: 4,
}

const ConnectWallet = () => {
  const { mnemonic, setMnemonic } = useContext(WalletContext)
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  const handleClick = async () => {
    setOpen(true)
  }

  const handleClose = async () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    setMnemonic(text)
    setOpen(false)
  }
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  return (
    <>
      <Button
        sx={{ mx: 3 }}
        onClick={handleClick}
        variant={mnemonic.length ? 'contained' : 'outlined'}
        size="small"
      >
        {mnemonic.length ? 'Connected' : 'Connect Wallet'}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter Seed Phrase</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ width: '500px', my: 2 }}
            // inputProps={{ style: { color: "white" } }}
            color="primary"
            label="Seed Phrase"
            variant="outlined"
            onChange={handleText}
            focused
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}> Submit </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConnectWallet
