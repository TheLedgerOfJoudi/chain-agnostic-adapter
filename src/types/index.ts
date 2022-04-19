

// Wallet Connectors
import { Connector as WagmiConnector } from 'wagmi'
import { BaseMessageSignerWalletAdapter as SolanaWalletAdapter } from '@solana/wallet-adapter-base'
export type WalletConnector = WagmiConnector | SolanaWalletAdapter | null
export { SolanaWalletAdapter, WagmiConnector }

// Providers for creating connections with contracts/programs.
import { Provider as WagmiContractProvider } from '@ethersproject/abstract-provider'
import { AnchorProvider as SolanaProgramProvider } from '@project-serum/anchor';
export type ContractProvider = WagmiContractProvider | SolanaProgramProvider
export { WagmiContractProvider, SolanaProgramProvider };

// Adress type of Solana and EVM.
import { PublicKey as SolanaPublicKey } from '@solana/web3.js'
export type Address = SolanaPublicKey | string

// A wallet abstraction for creating a connections to a Solana's program.
import {Transaction as SolanaTransaction} from '@solana/web3.js'
export type SolanaProgramWallet = {
    signTransaction(tx: SolanaTransaction): Promise<SolanaTransaction>;
    signAllTransactions(txs: SolanaTransaction[]): Promise<SolanaTransaction[]>;
    publicKey: SolanaPublicKey;
}
