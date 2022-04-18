import { ContractInterface, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { Idl , Provider as SolanaProvider} from '@project-serum/anchor';

export type AbstractContractInterface = {
    contractInterface: ContractInterface | any,
    idl: Idl | any
}

export type SignerOrProvider = {
evmSignerOrProvider: Signer | Provider,
solanaProvider: SolanaProvider
}