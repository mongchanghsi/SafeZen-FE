/* eslint-disable @next/next/no-img-element */
import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';
import { useEffect } from 'react';
import usePolicy from '../../hooks/usePolicy';
import styles from './index.module.scss';

const Policies = () => {
  const { account, active } = useWeb3React();

  const { data } = usePolicy(account);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h3>Your Policies</h3>
        {account && active ? (
          <div>
            {data.tokenId && (
              <Link href={`/policy/${data.tokenId}`}>
                <img
                  src={data.tokenPolicyImage}
                  alt={`Policy_${data.tokenId}`}
                />
              </Link>
            )}
          </div>
        ) : (
          <h4>Please connect your wallet to view your existing policies</h4>
        )}
      </div>
    </div>
  );
};

export default Policies;
