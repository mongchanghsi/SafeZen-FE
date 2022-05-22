import { useEffect, useState, useContext } from 'react';
import envConfig from '../utils/envConfig';
import { Web3Context } from '../context/web3Context/index';
import useWeb3Hook from './useWeb3Hook';

const useNetwork = () => {
  const { appState: Web3State } = useContext(Web3Context);
  const [rightNetwork, setRightNetwork] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const { onConnect } = useWeb3Hook();

  const checkNetworkName = () => {
    if (
      typeof window !== 'undefined' &&
      window.location.hostname &&
      window.location.hostname === 'localhost'
    ) {
      return 80001;
    } else if (envConfig.MAINNET) {
      return 137;
    } else {
      return 80001;
    }
  };

  // Used for displaying what network to connect
  const chainNetworkName = {
    1: 'Ethereum mainnet',
    4: 'Rinkeby testnet',
    31337: 'Localhost',
    137: 'Polygon network',
    80001: 'Mumbai testnet',
  };

  const checkNetwork = async () => {
    const { ethereum } = window;
    const ChainIdToConnect = checkNetworkName();

    if (!ethereum) {
      setError('Please have either Metamask extension installed');
      return;
    }

    setLoading(true);
    if (Web3State.userOnChainId !== ChainIdToConnect) {
      setError(`Please connect to the ${chainNetworkName[ChainIdToConnect]}`);
      setRightNetwork(false);
    } else {
      setError('');
      setRightNetwork(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    checkNetwork();

    const handleAccountsChanged = () => {
      // When user changes their account, it will trigger an connection
      onConnect(Web3State.web3ReactLibrary);
    };

    const handleChainChanged = () => {
      // When user changes the chain, it will trigger a refresh. Said to be the best practice
      window.location.reload();
    };
    if (window.ethereum) {
      // window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      // window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [Web3State.userOnChainId]);

  return { rightNetwork, loading, error, checkNetworkName };
};

export default useNetwork;
