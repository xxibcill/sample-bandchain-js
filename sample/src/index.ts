import { 
    initWallet,
    makeSendCoinTx,
    signAndSendBlock,
    getFaucet,
    makeRequestStd,
    getReferenceData,
    getRequestResult
} from './Utils'

const MNEMONIC = "brown kite lady anger income eager left since brown cruise arch danger";

(async () => {
    const privKey1 = initWallet(MNEMONIC)
    const privKey2 = initWallet(MNEMONIC,1)
    // console.log(pubkey1.toAddress().toAccBech32());
    // console.log(privKey1.toPubkey().toAddress().toAccBech32());
    // console.log(privKey2.toPubkey().toAddress().toAccBech32());
    
    // make request to oraclescript
    // const response = await makeRequestStd(privKey1)
    // console.log(response);

    const requestData = await getRequestResult(66700)
    console.log(requestData);
    
    // const response = await getFaucet(privKey2.toPubkey().toAddress().toAccBech32(),"10")
    // console.log(response);
    

    // send Coin
    // const tx = await makeSendCoinTx(
    //     privKey1.toPubkey().toAddress().toAccBech32(),
    //     privKey2.toPubkey().toAddress().toAccBech32(),
    //     "1000")
    // const response = await signAndSendBlock(tx,privKey1)
    // console.log(response);

    // getFaucet(sender,10)

    // const pairs = ["BTC/USD", "ETH/USD"]
    // const data = await getReferenceData(pairs)
    // console.log(data);
    
    
})()