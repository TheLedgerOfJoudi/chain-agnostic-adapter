import React from 'react'
import { Contract } from './contract'
import { useContext } from '../../context'
import { ContractInterface, Address, ContractProvider } from '../../types';


export type Config = {
  /** Contract address */
  addressOrName: Address
  /** Contract interface and Program's IDL */
  contractInterface: ContractInterface

  /** Signer or provider to attach to contract */
  provider: ContractProvider
}

const getContract = <T = Contract>({
  addressOrName,
  contractInterface,
  provider,
}: Config) =>
  <T>(<unknown>new Contract(addressOrName, contractInterface, provider))

export const useContract = <Contract = any>({
  addressOrName,
  contractInterface,
  provider,
}: Config) => {
  const context = useContext()
  return React.useMemo(() => {
    return getContract<Contract>({
      addressOrName,
      contractInterface,
      provider,
    })
  }, [addressOrName, contractInterface, provider])
}