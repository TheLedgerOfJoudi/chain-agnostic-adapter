import * as React from 'react'

import { useContext } from '../../context'
import { WalletConnector } from '../../types'

import { useWallet as useWalletSolana, Wallet as SolanaWallet } from '@solana/wallet-adapter-react';
import { useConnect as useConnectWagmi, Connector as WagmiConnector } from 'wagmi';

type State = {
    connector?: WalletConnector
    error?: Error
    loading: boolean
}

const initialState: State = {
    loading: false,
}

export const useConnect = () => {
    const [wagmiInfo, wagmiConnect] = useConnectWagmi();
    const solanaInfo = useWalletSolana();

    const {
        state: globalState,
        setState: setGlobalState,
        setLastUsedWalletConnector,
    } = useContext()

    const [state, setState] = React.useState<State>(initialState)

    const connect = React.useCallback(
        (walletConnector: WalletConnector) => {
            solanaInfo.disconnect()
            if (wagmiInfo.data.connected){
                wagmiInfo.data.connector?.disconnect()
            }
            if (walletConnector instanceof WagmiConnector){
                wagmiConnect(walletConnector)
            }
            else if((walletConnector as SolanaWallet).adapter) {
                walletConnector?.adapter.connect()
            }
        }, [globalState.connector, setGlobalState, setLastUsedWalletConnector]);

    React.useEffect(() => {
        setState((x) => ({
            ...x,
            connector: globalState.connector,
            error: undefined,
        }))
    }, [wagmiInfo, wagmiConnect, solanaInfo])

    return [
        {
            data: {
                connected: !!globalState.data?.account,
                connector: state.connector,
                connectors: globalState.connectors,
            },
            error: state.error,
            loading: state.loading || globalState.connecting,
        },
        connect,
    ] as const
}


