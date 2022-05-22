/* eslint-disable @next/next/no-img-element */
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import styles from '../../styles/Purchase.module.scss';
import { useRouter } from 'next/router';
import SubCategories from '../../components/SubCategories';
import PurchaseForm from '../../components/PurchaseForm';

const Purchase = () => {
  const { account, active } = useWeb3React();
  const router = useRouter();
  const [insuranceType, setInsuranceType] = useState<string>('');
  const [subInsuranceType, setSubInsuranceType] = useState<string>('');

  const selectSubInsuranceType = (_subinsurancetype: string) => {
    setSubInsuranceType(_subinsurancetype);
  };

  useEffect(() => {
    if (router && router.query && router.query.type) {
      setInsuranceType(router.query.type as string);
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h3>PURCHASE {insuranceType.toUpperCase()} POLICIES</h3>
        <SubCategories
          type={insuranceType}
          selectedSubInsurance={subInsuranceType}
          handleSelect={selectSubInsuranceType}
        />
        {account && active ? (
          <>
            <PurchaseForm
              selectedInsuranceType={insuranceType}
              selectedSubInsuranceType={subInsuranceType}
            />
          </>
        ) : (
          <h4>Please connect your wallet to purchase the policies</h4>
        )}
      </div>
    </div>
  );
};

export default Purchase;
