import { Client } from '@bandprotocol/bandchain.js';
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
    // console.log(privKey1.toPubkey().toAddress().toAccBech32());
    // console.log(privKey2.toPubkey().toAddress().toAccBech32());

    // const grpcUrl = 'https://laozi1.bandchain.org/grpc-web'
    // const client = new Client(grpcUrl)
    // const chainId = await client.getChainId()
    // console.log(chainId);
    // const account = await client.getAccount("band1pxzqj53rg87e2n0swh8h7a6m2umjlja6uwffp9")
    // console.log(account);
    
    
    // make request to oraclescript
    // const response = await makeRequestStd(privKey1)
    // console.log(response);

    // const requestData = await getRequestResult(66700)
    // console.log(requestData);
    
    // const response = await getFaucet(privKey2.toPubkey().toAddress().toAccBech32(),"10")
    // console.log(response);
    
    // send Coin
    const tx = await makeSendCoinTx(privKey1.toPubkey().toAddress().toAccBech32(),"band1pxzqj53rg87e2n0swh8h7a6m2umjlja6uwffp9","5000000")
    const response = await signAndSendBlock(tx,privKey1)
    console.log(response);
    
    // const pairs = ["BTC/USD", "ETH/USD"]
    // const data = await getReferenceData(pairs)
    // console.log(data);
})()