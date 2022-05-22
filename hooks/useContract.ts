/**
 * Get an initialized contract
 * @returns Contract
 */
import { useEffect, useState } from 'react';
import envConfig from '../utils/envConfig';
import { Contract } from 'ethers';
import { getMainContract } from '../utils/contracts';

import useNetwork from './useNetwork';

const useContract = () => {
  const { rightNetwork, checkNetworkName } = useNetwork();
  const [contract, setContract] = useState<Contract>();

  const initialFunc = () => {
    const networkName = checkNetworkName();
    const NFTContract = getMainContract(networkName);
    setContract(NFTContract);
  };

  useEffect(() => {
    initialFunc();
  }, []);

  return { contract };
};

export default useContract;
