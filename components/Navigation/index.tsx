/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import Link from 'next/link';

import { useWeb3React } from '@web3-react/core';
import { getDisplayAddress } from '../../utils';

import { activateInjectedProvider, ProviderType } from '../../utils/injected';
import {
  injected as MetaMaskConnector,
  coinbaseWallet as CoinbaseConnector,
  walletConnect as WalletConnectConnector,
} from '../../connectors';
import useWeb3Hook from '../../hooks/useWeb3Hook';

import MetamaskIcon from '../../public/assets/wallets/metamask.png';
import CoinbaseIcon from '../../public/assets/wallets/coinbase.png';
import WalletConnectIcon from '../../public/assets/wallets/walletconnect.png';

import MainIcon from '../../public/assets/misc/main_icon.png';
import useWindowDimensions from '../../hooks/useWindowDimension';

const ActionBar = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { windowDimensions, LARGE_SCREEN_SIZE } = useWindowDimensions();

  const { library, account, active, activate } = useWeb3React();
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
    <>
      {windowDimensions.width < LARGE_SCREEN_SIZE ? (
        <nav id='Navigation' className={styles.container}>
          <div
            className={`${styles.main_mobile} ${
              expanded ? styles.main_mobile_expanded : ''
            }`}
          >
            <div className={styles.main_mobile_nav}>
              <div className={styles.connectContainer}>
                {account && active ? (
                  <button className={styles.address}>
                    {getDisplayAddress(account)}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleConnectMetamask}
                      className={styles.connect}
                    >
                      <img src={MetamaskIcon.src} alt='Metamask Icon' />{' '}
                      Metamask
                    </button>
                    <button
                      onClick={handleConnectCoinbase}
                      className={styles.connect}
                    >
                      <img src={CoinbaseIcon.src} alt='Coinbase Icon' />
                      Coinbase
                    </button>
                    <button
                      onClick={handleConnectWalletConnect}
                      className={styles.connect}
                    >
                      <img
                        src={WalletConnectIcon.src}
                        alt='WalletConnect Icon'
                      />
                      WalletConnect
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={styles.main_mobile_title}>
              <Link href='/' style={{ cursor: 'pointer' }}>
                <div className={styles.main_sub}>
                  <img src={MainIcon.src} alt='Main Icon' />
                  <h2>SafeZen</h2>
                </div>
              </Link>
              <div
                id='BurgerMenu'
                className={styles.burger}
                onClick={() => setExpanded((prevState) => !prevState)}
              >
                <i className={!expanded ? styles.close : styles.open}></i>
                <i className={!expanded ? styles.close : styles.open}></i>
                <i className={!expanded ? styles.close : styles.open}></i>
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <nav id='Navigation' className={styles.container}>
          <div className={styles.main}>
            <Link href='/' style={{ cursor: 'pointer' }}>
              <div className={styles.main_sub}>
                <img src={MainIcon.src} alt='Main Icon' />
                <h2>SafeZen</h2>
              </div>
            </Link>
            {account && active ? (
              <button className={styles.address}>
                {getDisplayAddress(account)}
              </button>
            ) : (
              <div className={styles.connectContainer}>
                <button
                  onClick={handleConnectMetamask}
                  className={styles.connect}
                >
                  <img src={MetamaskIcon.src} alt='Metamask Icon' /> Metamask
                </button>
                <button
                  onClick={handleConnectCoinbase}
                  className={styles.connect}
                >
                  <img src={CoinbaseIcon.src} alt='Coinbase Icon' />
                  Coinbase
                </button>
                <button
                  onClick={handleConnectWalletConnect}
                  className={styles.connect}
                >
                  <img src={WalletConnectIcon.src} alt='WalletConnect Icon' />
                  WalletConnect
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

export default ActionBar;
