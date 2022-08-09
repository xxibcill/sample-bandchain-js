import { useContext, useState } from "react";
import { Ledger } from "@bandprotocol/bandchain.js/lib/wallet";
import { LedgerContext } from "./useLedger";

const ConnectWallet = () => {
  const {ledger, setLedger} = useContext(LedgerContext);
  const [address, setAddress] = useState("");
  const [transactionResult, setTransactionResult] = useState();

  const handleClick = async () => {
    try {
      const res = await Ledger.connectLedgerWeb();
      setLedger(res);
      try {
        const addressObject = await res.getPubKeyAndBech32Address();
        setAddress(addressObject.bech32_address);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h4>{address}</h4>
      {ledger ? (
        null
      ) : (
        <button onClick={handleClick}>connect</button>
      )}
    </div>
  );
};

export default ConnectWallet;
