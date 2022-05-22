/* eslint-disable @next/next/no-img-element */
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import styles from '../../styles/Policy.module.scss';
import { useRouter } from 'next/router';
import useSuperFluid from '../../hooks/useSuperfluid';
import usePolicy from '../../hooks/usePolicy';
import { getDisplayAddress } from '../../utils';
import useStaking from '../../hooks/useStaking';
import { ethers } from 'ethers';
import useGovernance from '../../hooks/useGovernance';
import { WeiPerSecondToEthPerDay } from '../../utils/constants/policyCostCalculations';

enum CLAIM_STATUS {
  YET_TO_SUBMIT,
  SUBMITTED,
  SUCCESSFUL,
}

const Policy = () => {
  const { account, active } = useWeb3React();
  const router = useRouter();
  const [tokenId, setTokenId] = useState<number>(0);
  const [policyDetails, setPolicyDetails] = useState<any>({
    policyHolder: '',
    policyId: 0,
    policyType: '',
    coverageAmount: 0,
    merchant: '',
    minFlowRate: 0,
    purchaseTime: 0,
    isActive: false,
    hasClaimed: false,
    amountPaid: 0,
    baseAmount: 0,
  });
  const [hasClaimedYield, setHasClaimedYield] = useState<boolean>(false);
  const [yieldTokenCount, setYieldTokenCount] = useState<string>('0');
  const [claimStatus, setClaimStatus] = useState<CLAIM_STATUS>(
    CLAIM_STATUS.YET_TO_SUBMIT
  );
  const [streamHash, setStreamHash] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<number>(0);

  const { data, fetchActivationStartTime } = usePolicy(account);
  const {
    transactionHash,
    loading,
    error,
    redeemRewards,
    checkClaimYieldStatus,
  } = useStaking();
  const { checkClaimStatus } = useGovernance();

  const { MATICxContract, fUSDCxContract, createNewFlow, deleteFlow } =
    useSuperFluid();

  const fetchPolicyMetadata = async (url: any) => {
    try {
      const response = await fetch(url);
      const result = await response.json();
      console.log('fetchPolicyMetadata', result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router && router.query && router.query.id) {
      const _tokenId = (router.query.id as string) || '0';
      const _tokenIdNum = Number(_tokenId);
      setTokenId(_tokenIdNum);
    }
  }, [router]);

  const checkClaimYieldFunction = async (_tokenId: number) => {
    if (_tokenId <= 0) return;
    const yieldClaimStatus = await checkClaimYieldStatus(_tokenId);
    setHasClaimedYield(yieldClaimStatus?.claimed);
    setYieldTokenCount(
      yieldClaimStatus?.yieldTokenCount
        ? (Number(yieldClaimStatus?.yieldTokenCount) * 10 ** -18).toFixed(5)
        : '0'
    );
  };

  const checkClaimStatusFunction = async (_tokenId: number) => {
    const claimDetails = await checkClaimStatus(data.tokenId);
    if (Number(claimDetails.Policy_ID) === 0) {
      setClaimStatus(CLAIM_STATUS.YET_TO_SUBMIT);
    } else if (claimDetails.claimSuccessful) {
      setClaimStatus(CLAIM_STATUS.SUCCESSFUL);
    } else {
      setClaimStatus(CLAIM_STATUS.SUBMITTED);
    }
  };

  const renderClaimText = (_claimStatus: CLAIM_STATUS) => {
    switch (_claimStatus) {
      case CLAIM_STATUS.YET_TO_SUBMIT:
        return 'Yet to submit';
      case CLAIM_STATUS.SUBMITTED:
        return 'Submitted';
      case CLAIM_STATUS.SUCCESSFUL:
        return 'Successful';
      default:
        return 'Yet to submit';
    }
  };

  const calculateBaseAmountPaid = async (_tokenId: number) => {
    if (!_tokenId || _tokenId === 0) return 0;
    if (!policyDetails.isActive) return 0;

    const _startTime = await fetchActivationStartTime(_tokenId);
    if (_startTime === 0 || !_startTime) return 0;

    const _currentTime = new Date().getTime();
    const _timeDifferenceInSeconds = (_currentTime - _startTime) / 1000;
    const amountPaidInWei =
      policyDetails.minFlowRate * _timeDifferenceInSeconds;
    setAmountPaid(amountPaidInWei * 10 ** -18);
    return amountPaidInWei * 10 ** -18;
  };

  useEffect(() => {
    if (data.tokenPolicy && policyDetails.policyHolder == '') {
      setPolicyDetails({
        ...policyDetails,
        policyHolder: data.tokenPolicy[0],
        policyId: Number(data.tokenPolicy[1]),
        policyType: data.tokenPolicy[2],
        coverageAmount: Number(data.tokenPolicy[3]),
        merchant: data.tokenPolicy[4],
        minFlowRate: Number(data.tokenPolicy[5]),
        purchaseTime: Number(data.tokenPolicy[6]) * 1000,
        isActive: data.isPolicyActive,
        hasClaimed: data.tokenPolicy[8],
        amountPaid: Number(data.tokenPolicy[9]),
        baseAmount: (Number(data.tokenPolicy[10]) * 10 ** -18).toFixed(2),
      });
    }

    if (data.tokenId) {
      checkClaimStatusFunction(data.tokenId);
      checkClaimYieldFunction(data.tokenId);
    }
  }, [data.tokenPolicy, data.tokenId, data.isPolicyActive]);

  useEffect(() => {
    if (policyDetails.isActive && data.tokenId) {
      calculateBaseAmountPaid(data.tokenId);
      setInterval(() => {
        setAmountPaid(
          (prevState) => prevState + policyDetails.minFlowRate * 10 ** -18
        );
      }, 100);
    }
  }, [policyDetails.isActive]);

  useEffect(() => {
    if (data.tokenPolicyMetadata) {
      fetchPolicyMetadata(data.tokenPolicyMetadata);
    }
  }, [data.tokenPolicyMetadata, streamHash]);

  const formatTime = (_timestamp: number) => {
    const _date = new Date(_timestamp);
    return `${_date.getDate()}-${_date.getMonth() + 1}-${_date.getFullYear()}`;
  };

  const activatePolicy = async () => {
    if (policyDetails.minFlowRate > 0) {
      const result = await createNewFlow(String(policyDetails.minFlowRate));
      console.log('Activated Stream: ', result.hash);
      setStreamHash(`Activated Superfluid streamhash: ${result.hash}`);
    }
  };

  const deactivatePolicy = async () => {
    if (!policyDetails.isActive) return;
    const result = await deleteFlow();
    console.log('Deactivated Stream: ', result);
    setStreamHash(`Deactivated Superfluid streamhash: ${result.hash}`);
  };

  const handleYieldReward = async () => {
    if (!account || !tokenId || tokenId === 0) return;
    await redeemRewards(account, tokenId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h3>Policy {tokenId}</h3>
        <div className={styles.content}>
          <div>
            <img src={data.tokenPolicyImage} alt={`Policy_${data.tokenId}`} />
          </div>
          <div className={styles.content_details}>
            <p>
              <b>Policy Holder Address: </b>
              {getDisplayAddress(policyDetails.policyHolder)}
            </p>
            <p>
              <b>Policy Id:</b> {policyDetails.policyId}
            </p>
            <p>
              <b>Policy Type:</b> {policyDetails.policyType}
            </p>
            <p>
              <b>Coverage Amount:</b> {policyDetails.coverageAmount} USD
            </p>
            <p>
              <b>Merchant:</b> {policyDetails.merchant}
            </p>
            <p>
              <b>Flow Rate: </b>
              {WeiPerSecondToEthPerDay(policyDetails.minFlowRate)} DAIx/day
            </p>
            <p>
              <b>Purchase Time: </b> {formatTime(policyDetails.purchaseTime)}
            </p>
            <p>
              <b>Is policy active?: </b>

              {policyDetails.isActive ? 'Active' : 'Inactive'}
            </p>
            <p>
              <b>Has policy claimed?: </b>
              {renderClaimText(claimStatus)}
              {/* {policyDetails.hasClaimed ? 'Claimed' : 'Yet to be claimed'} */}
            </p>

            <p>
              <b>Stream Amount Paid: </b>
              {amountPaid.toFixed(5)} DAIx
            </p>
            <p>
              <b>Policy Cost: </b>
              {policyDetails.baseAmount} MATIC
            </p>
            <p>
              <b>Yield Amount: </b>
              {yieldTokenCount} $SZT
            </p>
            <p>
              <b>Has claimed yield?: </b>
              {hasClaimedYield ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        <div className={styles.action}>
          {policyDetails.isActive ? (
            <button type='button' onClick={deactivatePolicy}>
              Deactivate
            </button>
          ) : (
            <button type='button' onClick={activatePolicy}>
              Activate
            </button>
          )}

          {policyDetails.isActive && (
            <>
              {claimStatus === CLAIM_STATUS.YET_TO_SUBMIT && (
                <button
                  type='button'
                  onClick={() => router.push(`/claim/${tokenId}`)}
                >
                  Claim Insurance
                </button>
              )}
            </>
          )}

          {!hasClaimedYield && (
            <>
              {loading ? (
                <button
                  type='button'
                  className={styles.loading}
                  disabled={true}
                >
                  Claiming
                </button>
              ) : (
                <button type='button' onClick={handleYieldReward}>
                  Claim Yield
                </button>
              )}
            </>
          )}
        </div>

        {error && <p>Error while claiming yield: {error}</p>}
        {!loading && transactionHash && !error && (
          <p
            style={{
              fontSize: '1.5rem',
              width: '50rem',
              wordBreak: 'break-word',
            }}
          >
            Your yield transaction hash:{' '}
            <a
              href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
              target='_blank'
              rel='noreferrer'
            >
              https://mumbai.polygonscan.com/tx/${transactionHash}
            </a>
          </p>
        )}
        {streamHash && (
          <p
            style={{
              fontSize: '1.5rem',
              width: '50rem',
              wordBreak: 'break-word',
            }}
          >
            {streamHash}
          </p>
        )}
      </div>
    </div>
  );
};

export default Policy;
