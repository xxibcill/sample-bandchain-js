import { PrivateKey } from '@bandprotocol/bandchain.js/lib/wallet'
const MNEMONIC = 'brown kite lady anger income eager left since brown cruise arch danger'
const DERIVATION_PATH = `m/44'/118'/0'/0/0`

const privateKey = PrivateKey.fromMnemonic(MNEMONIC, DERIVATION_PATH)
const address = privateKey.toPubkey().toAddress().toAccBech32()
