import * as React from 'react'
import { Contract } from 'ethers'
import { Program } from '@project-serum/anchor';
import { AbstractContractInterface } from '../../types';
import { SignerOrProvider } from '../../types';

export type Config = {
    /** Ex: Ethereum : 1, Solana : 2 ... */
    env: number
    /** Contract address or ID */
    addressOrName: string
    /** Contract interface*/
    Interface: AbstractContractInterface
    /** Signer or provider to attach to contract */
    signerOrProvider?: SignerOrProvider
}

const getContract = ({
    env,
    addressOrName,
    Interface,
    signerOrProvider,
}: Config) => {
    if (env === 1) {
        (new Contract(addressOrName, Interface.contractInterface, signerOrProvider.evmSignerOrProvider))
    }
    else if (env === 2) {
        return new Program(Interface.idl, addressOrName, signerOrProvider.solanaProvider);
    }
}

export const useContract = ({
    env,
    addressOrName,
    Interface,
    signerOrProvider,
}: Config) => {
    return React.useMemo(() => {
        return getContract({
            env,
            addressOrName,
            Interface,
            signerOrProvider,
        })
    }, [addressOrName, Interface, signerOrProvider])
}