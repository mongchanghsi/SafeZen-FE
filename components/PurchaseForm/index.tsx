/* eslint-disable @next/next/no-img-element */
import { useWeb3React } from '@web3-react/core';
import { useContext, useEffect, useState } from 'react';
import styles from './index.module.scss';
import useMint from '../../hooks/useMint';
import { Web3Context } from '../../context/web3Context';
import Select from 'react-select';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import calculation, {
  WeiPerSecondToEthPerDay,
} from '../../utils/constants/policyCostCalculations';
interface IOption {
  value: string;
  label: string;
}

const coverageOptions = [
  { value: '100000', label: '100,000USD' },
  { value: '500000', label: '500,000USD' },
  { value: '1000000', label: '1,000,000USD' },
];

const merchantOptions = [
  { value: 'AIA', label: 'AIA' },
  { value: 'Prudential', label: 'PRUDENTIAL' },
  { value: 'AVIVA', label: 'AVIVA' },
];

const PurchaseForm = ({
  selectedInsuranceType,
  selectedSubInsuranceType,
}: {
  selectedInsuranceType: any;
  selectedSubInsuranceType: any;
}) => {
  const { appState: Web3State } = useContext(Web3Context);
  const { account, active } = useWeb3React();

  const [selectedCoverage, setSelectedCoverage] = useState<IOption>(
    coverageOptions[0]
  );
  const [selectedMerchant, setSelectedMerchant] = useState<IOption>(
    merchantOptions[0]
  );
  const [flowRate, setFlowRate] = useState<string>('');
  const [baseAmount, setBaseAmount] = useState<string>('');

  const handleCoverageChange = (e: any) => {
    setSelectedCoverage(e);
  };

  const handleMerchantChange = (e: any) => {
    setSelectedMerchant(e);
  };

  const { transactionHash, responseCode, error, loading, mint, clearData } =
    useMint();

  const handleCalculations = () => {
    if (
      !selectedInsuranceType ||
      !selectedSubInsuranceType ||
      !selectedCoverage.value ||
      !selectedMerchant.value
    )
      return;

    const _costPair = calculation(
      String(selectedInsuranceType).toUpperCase(),
      String(selectedSubInsuranceType).toUpperCase(),
      selectedCoverage.value,
      selectedMerchant.value
    );
    setFlowRate(_costPair.flowRate);
    setBaseAmount(_costPair.baseAmount);
  };

  const handlePurchase = async () => {
    if (!Web3State.provider || !account) return;
    if (!selectedInsuranceType || !selectedSubInsuranceType) return;

    const constructedPolicyDetails = {
      policyType: `${String(selectedInsuranceType).toUpperCase()}_${String(
        selectedSubInsuranceType
      ).toUpperCase()}`,
      coverageAmount: Number(selectedCoverage.value),
      merchant: selectedMerchant.value,
      minFlowRate: Number(flowRate),
      baseAmount: Number(baseAmount),
    };
    await mint(account, constructedPolicyDetails);
  };

  useEffect(() => {
    handleCalculations();
  }, [
    selectedCoverage,
    selectedMerchant,
    selectedInsuranceType,
    selectedSubInsuranceType,
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.content}>
          <div>
            <p>Coverage Amount:</p>
            <Dropdown
              value={selectedCoverage}
              options={coverageOptions}
              onChange={(e) => handleCoverageChange(e)}
            />
          </div>
          <div>
            <p>Merchant:</p>
            <Dropdown
              value={selectedMerchant}
              options={merchantOptions}
              onChange={(e) => handleMerchantChange(e)}
            />
          </div>
          <div>
            <p>Flow Rate:</p>
            <p>{WeiPerSecondToEthPerDay(flowRate)} DAIx/day</p>
          </div>
          <div>
            <p>Base Price:</p>
            <p>{baseAmount} MATIC</p>
          </div>

          {!loading && transactionHash && !error ? (
            <p
              style={{
                fontSize: '1.5rem',
                width: '50rem',
                wordBreak: 'break-word',
              }}
            >
              Your purchase transaction url is:{' '}
              <a
                href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
                target='_blank'
                rel='noreferrer'
              >
                https://mumbai.polygonscan.com/tx/${transactionHash}
              </a>
            </p>
          ) : (
            <>
              {loading ? (
                <button
                  type='button'
                  className={styles.loading}
                  disabled={true}
                >
                  Buying
                </button>
              ) : (
                <button type='button' onClick={handlePurchase}>
                  Buy
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseForm;
