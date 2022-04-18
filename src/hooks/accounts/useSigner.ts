
import { useSigner as useSignerWagmi } from "wagmi"
import { useWallet as useWalletSolana } from "@solana/wallet-adapter-react";
import React from "react";


export const useSigner = () => {
    const [wamgiSignerState, getSignerWagmi] = useSignerWagmi()
    const solanaInfo = useWalletSolana();
    
    const state = React.useMemo(() => {
        if (wamgiSignerState) 
            return wamgiSignerState
        
        // TODO: return a Solana signer (or create a new type?). It's only used to get the signer's data (to be used in useContract).
        return null;
    }, [wamgiSignerState, solanaInfo])

    const getSigner = React.useCallback(() => {
        if (wamgiSignerState)
            return getSignerWagmi;
        
        // TODO: change this to get the Solana signer (if it exists). This 
        // was not implemented yet because it's not needed in grants frontend.
        return () => {}
    }, [wamgiSignerState, solanaInfo])

    return [state, getSigner] as const
}