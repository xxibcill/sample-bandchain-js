import { ReferenceData } from '@bandprotocol/bandchain.js/lib/data'
import React, { useEffect, useState } from 'react'
import { getReferenceData } from '../Utils'
import { Grid, Box } from '@mui/material'
import DataCard from './DataCard'

const PAIRS = [
  'BTC/USD',
  'ETH/USD',
  'BNB/USD',
  'XRP/USD',
  'ADA/USD',
  'SOL/USD',
  'DOT/USD',
  'DOGE/USD',
  'AVAX/USD',
  'SHIB/USD',
  'MATIC/USD',
  'TRX/USD',
]

function ReferenceDataTable() {
  const [data, setData] = useState<ReferenceData[]>([])

  const getDataAndSetToState = () => {
    getReferenceData(PAIRS)
      .then((result) => {
        setData(result)
      })
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    setInterval(() => {
      getDataAndSetToState()
    }, 5000)
  }, [])

  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden', mx: 3 }}>
      <Grid container spacing={2}>
        {data.map((item) => {
          return (
            <Grid key={item.pair} item xs={3}>
              <DataCard symbol={item.pair} rates={item.rate} />
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default ReferenceDataTable
