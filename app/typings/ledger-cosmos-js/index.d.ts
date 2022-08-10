/// <reference types = "node"/>

declare module 'ledger-cosmos-js' {
  interface LedgerResponse {
    return_code: number
    error_message: string
  }

  interface AppInfo extends LedgerResponse {
    appName: string
    appVersion: string
    flagLen: number
    flagsValue: number
    flag_recovery: boolean
    flag_signed_mcu_code: boolean
    flag_onboarded: boolean
    flag_pin_validated: boolean
  }

  interface AddressAndPublicKey extends LedgerResponse {
    bech32_address: string
    compressed_pk: Buffer
    return_code: number
    error_message: string
  }

  interface Version extends LedgerResponse {
    test_mode: boolean
    major: number
    minor: number
    patch: number
    device_locked: boolean
    target_id: string
  }

  interface Sign extends LedgerResponse {
    signature: Buffer
  }

  class CosmosApp {
    constructor(transport: Transport<string>)
    appInfo(): Promise<AppInfo>
    getAddressAndPubKey(
      hdPath: number[],
      prefix: string,
    ): Promise<AddressAndPublicKey>
    getVersion(): Promise<Version>
    sign(hdPath: number[], signData: string): Promise<Sign>
  }

  export default CosmosApp
  export { LedgerResponse, AppInfo, AddressAndPublicKey, Version, Sign }
}
