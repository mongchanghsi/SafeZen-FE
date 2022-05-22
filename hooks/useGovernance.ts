import { useContext, useState } from 'react';
import { ethers } from 'ethers';
import { getGovernanceContract } from '../utils/contracts';

import responseCodeEnum from '../utils/constants/responseCode';
import useNetwork from './useNetwork';
import { Web3Context } from '../context/web3Context';

const useGovernance = () => {
  const { checkNetworkName } = useNetwork();

  const { appState: Web3State } = useContext(Web3Context);

  const [transactionHash, setTransactionHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [responseCode, setResponseCode] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  interface IPolicy {
    policyType: string;
    coverageAmount: number;
    merchant: string;
    minFlowRate: number;
    baseAmount: Number;
  }

  const prepareTransactionOptionMint = async (account: string) => {
    return {
      from: account,
    };
  };

  const submitClaim = async (
    account: string,
    _policyId: number,
    _proof: string,
    _claimAmount: number
  ) => {
    setLoading(true);
    setError('');

    if (!_policyId || !account || !_proof || !_claimAmount) {
      setTransactionHash('');
      setResponseCode(responseCodeEnum.BAD_REQUEST);
      setError(
        'Please ensure that you are providing the required information.'
      );

      return;
    }

    // Prepare contract
    const chainId = checkNetworkName();
    const NFTContract = getGovernanceContract(chainId);

    if (!NFTContract) {
      setError('Contract does not exist.');
      return;
    }
    const signer = Web3State.provider.getSigner();
    const contract = NFTContract.connect(signer);

    // Prepare transaction options
    const transactionOptions = await prepareTransactionOptionMint(account);

    try {
      const tx = await contract.ApplyClaim(
        _policyId,
        _proof,
        ethers.utils.parseEther(String(_claimAmount)),
        transactionOptions
      );

      const receipt = await tx.wait();
      const txnHash = await receipt.transactionHash;

      console.log('TransactionHash from useGovernance', txnHash);

      setTransactionHash(txnHash);
      setResponseCode(responseCodeEnum.SUCCESS);
      setError('');
    } catch (error: any) {
      console.log('Minting Error', error.message);
      console.log(error);
      if (error.reason === 'transaction failed') {
        setTransactionHash('');
        setResponseCode(4001);
        setError('The transaction has failed');
      } else if (error.code === 4001) {
        // User rejected the transaction
        setTransactionHash('');
        setResponseCode(4001);
        setError('Please approve the transaction.');
      } else if (error.error && error.error.code === -32603) {
        // Internal Error Code from Smart Contract
        // Error use Smart Contract error messages
        let filteredMessage =
          'Minting went wrong. Please refresh and try again.';
        if (error.message.length > 20) {
          filteredMessage = error.error.message.substring(30);
        }
        setTransactionHash('');
        setResponseCode(-32603);
        setError(filteredMessage);
      } else {
        setTransactionHash('');
        setError('Minting went wrong. Please refresh and try again.');
      }
    }

    setLoading(false);
  };

  const checkClaimStatus = async (_claimId: number) => {
    setLoading(true);
    setError('');

    if (!_claimId) {
      setTransactionHash('');
      setResponseCode(responseCodeEnum.BAD_REQUEST);
      setError('Please ensure that you are providing a valid claim id.');

      return;
    }

    // Prepare contract
    const chainId = checkNetworkName();
    const NFTContract = getGovernanceContract(chainId);
    if (!NFTContract) {
      setError('Contract does not exist.');
      return;
    }

    if (!Web3State.provider) {
      setError('Provider does not exist.');
      return;
    }

    const contract = NFTContract.connect(Web3State.provider);
    const claimDetails = await contract.claims(_claimId);
    setLoading(false);

    return claimDetails;
  };

  return {
    transactionHash,
    responseCode,
    error,
    loading,
    submitClaim,
    checkClaimStatus,
  };
};

export default useGovernance;
