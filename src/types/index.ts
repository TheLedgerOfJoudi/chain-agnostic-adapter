
import { Connector as WagmiConnector } from 'wagmi'
import { BaseMessageSignerWalletAdapter as SolanaWalletAdapter } from '@solana/wallet-adapter-base'


export { Connector as WagmiConnector } from 'wagmi'
export { BaseMessageSignerWalletAdapter as SolanaWalletAdapter }from '@solana/wallet-adapter-base'
export type WalletConnector = WagmiConnector | SolanaWalletAdapter | null
