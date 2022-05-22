/**
 * Get an initialized superfluid
 * @returns Contract
 */
import { useContext, useEffect, useState } from 'react';
import { Framework } from '@superfluid-finance/sdk-core';
import { SuperFluidContext } from '../context/superfluidContext';
import { Web3Context } from '../context/web3Context';
import { SET_SUPERFLUID_CONTRACT } from '../context/actionType';
import envConfig from '../utils/envConfig';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

const useSuperFluid = () => {
  const { account } = useWeb3React();
  const { appState: SuperFluidState, appDispatch: SuperFluidDispatch } =
    useContext(SuperFluidContext);
  const { appState: Web3State } = useContext(Web3Context);
  const [MATICxContract, setMATICxContract] = useState<any>();
  const [fUSDCxContract, setfUSDCxContract] = useState<any>();

  const initializeSuperFluidContract = async () => {
    try {
      const sf = await Framework.create({
        chainId: Web3State.userOnChainId,
        provider: Web3State.provider,
      });

      const _MATICxContract = await sf.loadSuperToken('MATICx');
      const _fDAIxContract = await sf.loadSuperToken('fDAIx');

      SuperFluidDispatch({
        type: SET_SUPERFLUID_CONTRACT,
        value: {
          MATICx: _MATICxContract,
          SF: sf,
          fDAIx: _fDAIxContract,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createNewFlow = async (_flowRate: string) => {
    const recipient = envConfig.SAFEZEN_CA;

    const _sf = SuperFluidState.SuperTokenFactory;

    try {
      if (_sf && Web3State.provider) {
        const signer = Web3State.provider.getSigner();

        const fDAIx = SuperFluidState.fDAIxContract.address;

        const createFlowOperation = _sf.cfaV1.createFlow({
          receiver: recipient,
          flowRate: _flowRate,
          superToken: fDAIx,
        });

        console.log('Creating stream...');

        return await createFlowOperation.exec(signer);
      }
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  };

  const deleteFlow = async () => {
    const recipient = envConfig.SAFEZEN_CA;

    const _sf = SuperFluidState.SuperTokenFactory;

    try {
      if (_sf && Web3State.provider && account) {
        const signer = Web3State.provider.getSigner();

        const fDAIx = await SuperFluidState.fDAIxContract.address;

        const deleteFlowOperation = _sf.cfaV1.deleteFlow({
          sender: account,
          receiver: recipient,
          superToken: fDAIx,
        });

        console.log('Deleting stream...');
        return await deleteFlowOperation.exec(signer);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (Web3State.provider && Web3State.userOnChainId) {
      initializeSuperFluidContract();
    }
  }, [Web3State.provider, Web3State.userOnChainId]);

  return { MATICxContract, fUSDCxContract, createNewFlow, deleteFlow };
};

export default useSuperFluid;
