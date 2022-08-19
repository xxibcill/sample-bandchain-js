import { useContext, useState } from "react";
import { Ledger } from "@bandprotocol/bandchain.js/lib/wallet";
import { LedgerContext } from "./useLedger";
import {Button} from '@mui/material'

const ConnectLedger = () => {
  const {ledger, setLedger} = useContext(LedgerContext);

  const handleClick = async () => {
    try {
      const res = await Ledger.connectLedgerWeb();
      setLedger(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button onClick={handleClick} variant={ledger ? "contained" : "outlined"} size="small">
      {ledger ? "Connected" : "Connect with Ledger"}
    </Button>
  );
};

export default ConnectLedger;
