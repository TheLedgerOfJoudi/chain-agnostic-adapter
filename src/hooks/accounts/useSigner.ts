
import { useSigner as useSignerWagmi } from "wagmi"
import { useWallet as useWalletSolana } from "@solana/wallet-adapter-react";
import { PublicKey as SolanaPublicKey } from '@solana/web3.js'
import React from "react";

type Address = SolanaPublicKey | string

type State = {
    data?: {
        getAddress: () => (Promise<Address> | Address)
    }
    error?: Error
    loading?: boolean
}

export const useSigner = () => {
    const [wamgiSignerState, getSignerWagmi] = useSignerWagmi()
    const solanaInfo = useWalletSolana();

    const state = React.useMemo(() => {
        if (wamgiSignerState && wamgiSignerState.data)
            return {
                data: {
                    getAddress: wamgiSignerState.data.getAddress
                },
                error: wamgiSignerState.error,
                loading: wamgiSignerState.loading
            } as State

        if (solanaInfo.connected) {
            return {
                data: {
                    getAddress: () => solanaInfo.wallet?.adapter.publicKey
                },
                loading: solanaInfo.connecting || solanaInfo.disconnecting
            } as State
        }
        return null;
    }, [wamgiSignerState, solanaInfo.connected, solanaInfo.wallet])

    const getSigner = React.useCallback(() => {
        if (wamgiSignerState)
            return getSignerWagmi;

        // TODO: change this to get the Solana signer (if it exists). This 
        // was not implemented yet because it's not needed in grants frontend.
        return () => {}
    }, [wamgiSignerState, solanaInfo])

    return [state, getSigner] as const
}
