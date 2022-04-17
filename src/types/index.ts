
import { Connector as wagmiConnector } from 'wagmi'
import { Wallet as solanaWallet } from '@solana/wallet-adapter-react';

export type WalletConnector = wagmiConnector | solanaWallet | null
