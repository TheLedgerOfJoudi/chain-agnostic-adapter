

import {
    SolanaProgramProvider,
    ContractProvider,
    Address,
    ContractInterface,
    GenericContract,
    EvmContract,
    SolanaProgram,
    EvmContractProvider,
    EvmContractSigner
} from '../../types'

export type ContractFunction<T = any> = (...args: Array<any>) => Promise<T>;

function defineReadOnly<T, K extends keyof T>(object: T, name: K, value: T[K]): void {
    Object.defineProperty(object, name, {
        enumerable: true,
        value: value,
        writable: false,
    });
}

export class Contract {
    addressOrName: Address
    contractInterface: ContractInterface
    provider: ContractProvider
    contract_: GenericContract | null
    functions: { [functionName: string]: ContractFunction }

    readonly [key: string]: ContractFunction<any> | any;

    constructor(addressOrName: Address, contractInterface: ContractInterface, provider: ContractProvider) {
        this.addressOrName = addressOrName
        this.contractInterface = contractInterface
        this.provider = provider
        this.functions = {}

        // Wagmi EVM contracts.
        if (provider instanceof EvmContractProvider || provider instanceof EvmContractSigner) {
            this.contract_ = new EvmContract(addressOrName as string, contractInterface.abi, provider)
            if (!this.contract_) return
            Object(this.contract_.functions).keys.forEach((functionName: string) => {
                if (this.contract_ instanceof EvmContract && this.contract_.hasOwnProperty(functionName)) {
                    const value = this.contract_[functionName]
                    defineReadOnly(this, functionName, value);
                    this.functions[functionName] = value
                }
            });
        }

        // Solana programs.
        else if (provider instanceof SolanaProgramProvider) {
            this.contract_ = new SolanaProgram(contractInterface.idl, addressOrName, provider)
            Object(this.contract_.methods).keys.forEach((functionName: string) => {
                if (this.contract_ instanceof SolanaProgram && this.contract_.hasOwnProperty(functionName)) {
                    const value: any = (...args: Array<any>) => {

                        // TODO: Need to add support for creating accounts. 
                        const solanaInstruction: Promise<any> = this.contract_?.state.rpc[functionName](...args, {
                            accounts: {
                                authority: provider.wallet.publicKey
                            }
                        })
                        return solanaInstruction
                    }
                    defineReadOnly(this, functionName, value);
                    this.functions[functionName] = value
                }
            });

            // TODO: Need to add support for decimals and other ERC20 related functions (if the program is SPL).
        }
        else {
            // Add other blockchain types.
            this.contract_ = null
        }
    }
}
