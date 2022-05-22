/**
 * To process the connection and storing details to context
 * @returns string
 */
import { useContext } from 'react';
import { Web3Context } from '../context/web3Context/index';
import { ethers } from 'ethers';

import { SET_WEB3_PROVIDER } from '../context/actionType';

const useWeb3Hook = () => {
  const { appDispatch } = useContext(Web3Context);

  const onConnect = async (_web3library: any) => {
    try {
      // const _selectedProvider = window.ethereum.providers
      //   ? window.ethereum.selectedProvider
      //   : window.ethereum;
      // _web3library._provider

      const provider = new ethers.providers.Web3Provider(
        _web3library._provider
      );
      const { chainId } = await provider.getNetwork();
      const signer = provider.getSigner();
      appDispatch({
        type: SET_WEB3_PROVIDER,
        value: {
          userOnChainId: Number(chainId),
          provider,
          web3ReactLibrary: _web3library,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return { onConnect };
};

export default useWeb3Hook;
