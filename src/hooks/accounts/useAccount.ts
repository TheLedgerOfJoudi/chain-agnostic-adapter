import React from "react";
import { Address, WalletConnector } from "../../types";
import { useAccount as useAccountWagmi } from "wagmi";
import { useWallet as useWalletSolana } from "@solana/wallet-adapter-react";
import { useContext } from '../../context'

export type Config = {
    // fetchEns is always set as false/null in grants/frontend. This is kept only to maintain
    // the same signature of useAccount.
    fetchEns?: boolean
}

type State = {
    data?: {
        address: Address,
        connector: WalletConnector,
    },
    error?: Error,
    loading: boolean,
}

export const useAccount = ({ fetchEns }: Config = {}) => {
    const [accountState, disconnectWagmi] = useAccountWagmi();
    const solanaInfo = useWalletSolana()

    const context = useContext()

    const state = React.useMemo(() => {
        if (accountState.data?.address)
            return {
                data: {
                    address: accountState.data.address,
                    connector: accountState.data.connector
                },
                error: accountState.error,
                loading: accountState.loading
            } as State

        if (solanaInfo.connected && solanaInfo.wallet?.adapter)
            return {
                data: {
                    address: solanaInfo.publicKey,
                    connector: solanaInfo.wallet.adapter
                },
                loading: solanaInfo.connecting || solanaInfo.disconnecting
            } as State
        
            return null
    }, [solanaInfo, accountState])

    const disconnect = React.useCallback(async () => {
        disconnectWagmi()
        await solanaInfo.disconnect()
    }, [solanaInfo.disconnect, disconnectWagmi])

    return [
        state,

        // Disconnect function, not needed for grants frontend.
        disconnect
    ]
};