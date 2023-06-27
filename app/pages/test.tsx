import React, { useEffect } from 'react'
import { exampleSendBlockTransaction } from '../components/Utils'

export default function test() {
  useEffect(() => {
    exampleSendBlockTransaction()
  }, [])

  return <div>test</div>
}
