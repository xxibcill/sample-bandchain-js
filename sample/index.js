import { initWallet ,makeSendCoinTx ,signAndSendBlock } from './Utils.js'

const MNEMONIC = "brown kite lady anger income eager left since brown cruise arch danger";

(async () => {
    //   const response = await makeRequest()
    //   console.log(response);
    //   fs.writeFileSync('./data.json', JSON.stringify(response))

        const [pubkey1,privKey1] = initWallet(MNEMONIC)
        const [pubkey2,privKey2] = initWallet(MNEMONIC,1)
        console.log(pubkey1.toAddress().toAccBech32());
        console.log(pubkey2.toAddress().toAccBech32());

        const tx = await makeSendCoinTx(pubkey1.toAddress().toAccBech32(),pubkey2.toAddress().toAccBech32(),1)
        const response = await signAndSendBlock(tx,privKey1)
        console.log(response);
        // getFaucet(sender,10)
    
})()