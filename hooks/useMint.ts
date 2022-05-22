import { useContext, useState } from 'react';
import envConfig from '../utils/envConfig';
import { ethers, Contract } from 'ethers';
import { getMainContract } from '../utils/contracts';

import responseCodeEnum from '../utils/constants/responseCode';
import useNetwork from './useNetwork';
import { Web3Context } from '../context/web3Context';

const INSUFFICIENT_FUNDS_ERROR_CODE = 'INSUFFICIENT_FUNDS';

const useMint = () => {
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

  const prepareTransactionOptionMint = async (
    contract: Contract,
    account: string,
    policyDetails: IPolicy
  ) => {
    return {
      from: account,
      value: ethers.utils.parseEther(String(policyDetails.baseAmount)).mul(1),
    };
  };

  const mint = async (account: string, policyDetails: IPolicy) => {
    setLoading(true);
    setError('');

    if (!policyDetails || !account) {
      setTransactionHash('');
      setResponseCode(responseCodeEnum.BAD_REQUEST);
      setError('Please ensure that you are minting at least one.');

      return;
    }

    // Prepare contract
    const chainId = checkNetworkName();
    const NFTContract = getMainContract(chainId);

    if (!NFTContract) {
      setError('Contract does not exist.');
      return;
    }
    const signer = Web3State.provider.getSigner();
    const contract = NFTContract.connect(signer);

    if (!Web3State.address) {
      setTransactionHash('');
      setResponseCode(responseCodeEnum.BAD_REQUEST);
      setError('User has yet to connect wallet.');
    }

    // Prepare transaction options
    const transactionOptions = await prepareTransactionOptionMint(
      contract,
      account,
      policyDetails
    );

    try {
      const tx = await contract.mint(
        policyDetails.policyType,
        policyDetails.coverageAmount,
        policyDetails.merchant,
        policyDetails.minFlowRate,
        ethers.utils.parseEther(String(policyDetails.baseAmount)).mul(1),
        transactionOptions
      );

      const receipt = await tx.wait();
      const txnHash = await receipt.transactionHash;

      console.log('TransactionHash from useMint', txnHash);

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

  const clearData = () => {
    setTransactionHash('');
    setError('');
    setResponseCode(0);
  };

  return {
    transactionHash,
    responseCode,
    error,
    loading,
    mint,
    clearData,
  };
};

export default useMint;
