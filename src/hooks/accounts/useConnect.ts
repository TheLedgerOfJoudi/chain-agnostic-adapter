import * as React from 'react'

import { WalletConnector } from '../../types'

import { useWallet as useWalletSolana } from '@solana/wallet-adapter-react';
import { useConnect as useConnectWagmi } from 'wagmi';

import { useContext } from '../../context'

type State = {
    connector?: WalletConnector
    error?: Error
    loading: boolean
}

const initialState: State = {
    loading: false,
}

export const useConnect = () => {
    const [wagmiInfo, _] = useConnectWagmi();
    const solanaInfo = useWalletSolana();

    const {
        state: globalState,
        setState: setGlobalState,
        setLastUsedWalletConnector,
    } = useContext()

    const [state, setState] = React.useState<State>(initialState)

    const connect = React.useCallback(
        async (walletConnector: WalletConnector) => {
            // Disconnecting both Wagmi and Solana
            await solanaInfo.disconnect()
            if (wagmiInfo.data.connected) {
                await wagmiInfo.data.connector?.disconnect()
            }

            // Connecting the wallet connector.
            walletConnector?.connect()
        }, [globalState, setGlobalState, setLastUsedWalletConnector]);

    return [
        {
            data: {
                connected: wagmiInfo.data.connected || solanaInfo.connected,
                connector: wagmiInfo.data.connected ? wagmiInfo.data.connector : solanaInfo.wallet?.adapter,
                connectors: globalState.walletConnectors,
            },
            error: wagmiInfo.error,
            loading: wagmiInfo.loading || solanaInfo.connecting || solanaInfo.disconnecting,
        },
        connect,
    ]
}

