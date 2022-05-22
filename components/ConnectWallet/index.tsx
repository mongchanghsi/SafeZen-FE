/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect } from 'react';
import styles from './index.module.scss';

import { activateInjectedProvider, ProviderType } from '../../utils/injected';
import { useWeb3React } from '@web3-react/core';
import {
  injected as MetaMaskConnector,
  coinbaseWallet as CoinbaseConnector,
  walletConnect as WalletConnectConnector,
} from '../../connectors';
import useWeb3Hook from '../../hooks/useWeb3Hook';

import MetamaskIcon from '../../public/assets/wallets/metamask.png';
import CoinbaseIcon from '../../public/assets/wallets/coinbase.png';
import WalletConnectIcon from '../../public/assets/wallets/walletconnect.png';

import { getDisplayAddress } from '../../utils';

const ConnectWallet = () => {
  const { library, account, active, activate, deactivate } = useWeb3React();
  const { onConnect } = useWeb3Hook();

  const handleConnectMetamask = async () => {
    try {
      activateInjectedProvider(ProviderType.METAMASK);
      await activate(MetaMaskConnector);
    } catch (error) {
      console.log('Error from connecting to Metamask', error);
    }
  };

  const handleConnectCoinbase = async () => {
    try {
      activateInjectedProvider(ProviderType.COINBASE);
      await activate(CoinbaseConnector);
    } catch (error) {
      console.log('Error from connecting to Coinbase', error);
    }
  };

  const handleConnectWalletConnect = async () => {
    try {
      await activate(WalletConnectConnector);
    } catch (error) {
      console.log('Error from connecting to WalletConnect', error);
    }
  };

  useEffect(() => {
    if (!library) return;
    onConnect(library);
  }, [account, active]);

  return (
    <div className={styles.container}>
      {account && active ? (
        <>
          <p>
            Address:
            {getDisplayAddress(account)}
          </p>
          <button onClick={deactivate}>Disconnect</button>
        </>
      ) : (
        <>
          <button onClick={handleConnectMetamask}>
            <img src={MetamaskIcon.src} alt='Metamask Icon' /> Metamask
          </button>
          <button onClick={handleConnectCoinbase}>
            <img src={CoinbaseIcon.src} alt='Coinbase Icon' />
            Coinbase
          </button>
          <button onClick={handleConnectWalletConnect}>
            <img src={WalletConnectIcon.src} alt='WalletConnect Icon' />
            WalletConnect
          </button>
        </>
      )}
    </div>
  );
};

export default ConnectWallet;
