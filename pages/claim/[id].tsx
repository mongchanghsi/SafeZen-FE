/* eslint-disable @next/next/no-img-element */
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import styles from '../../styles/Claim.module.scss';
import { useRouter } from 'next/router';
import usePolicy from '../../hooks/usePolicy';
import useGovernance from '../../hooks/useGovernance';
import { create } from 'ipfs-http-client';

const Claim = () => {
  const router = useRouter();
  const { account } = useWeb3React();
  const [tokenId, setTokenId] = useState<number>(0);

  const { data } = usePolicy(account);
  const { transactionHash, error, loading, submitClaim } = useGovernance();

  const [dateOfIncident, setDateOfIncident] = useState<string>();
  const [fullName, setFullName] = useState<string>('');
  const [claimAmount, setClaimAmount] = useState<string>('0');
  const [proof, setProof] = useState<File>();

  useEffect(() => {
    if (router && router.query && router.query.id) {
      const _tokenId = (router.query.id as string) || '0';
      const _tokenIdNum = Number(_tokenId);
      setTokenId(_tokenIdNum);
    }
  }, [router]);

  const saveFileToInfuraIPFS = async (_file: any) => {
    try {
      const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
      const added = await client.add(_file as any);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log('IPFS URL:', url);
      return url;
    } catch (error) {
      console.log('Error uploading file: ', error);
      return '';
    }
  };

  const handleClaim = async () => {
    if (!account) return; // No account
    if (tokenId <= 0) return; // Invalid tokenId
    if (!dateOfIncident || !fullName || !proof || !claimAmount) return; // No Details
    if (!data.isPolicyActive) return; // Policy is inactive

    const ipfsUrl = await saveFileToInfuraIPFS(proof);
    if (!ipfsUrl) return;
    await submitClaim(account, tokenId, ipfsUrl, Number(claimAmount));
  };

  const handleFileUpload = async (e: any) => {
    // Assuming that user only uploads ONE file
    setProof(e.target.files[0]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h3>Claim for: Policy {tokenId}</h3>
        <div className={styles.content}>
          <div>
            <img src={data.tokenPolicyImage} alt={`Policy_${data.tokenId}`} />
          </div>
          <div className={styles.content_details}>
            <div>
              <p>Date of Incident:</p>
              <input
                type='text'
                value={dateOfIncident}
                placeholder='Format of YYYY-MM-DD'
                onChange={(e) => setDateOfIncident(e.target.value)}
              />
            </div>
            <div>
              <p>Full Name:</p>
              <input
                type='text'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <p>Claim Amount:</p>
              <input
                type='number'
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
              />
            </div>
            <div>
              <p>Upload file:</p>
              <input type='file' onChange={(e) => handleFileUpload(e)} />
            </div>

            <div className={styles.action}>
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
                  <button type='button' onClick={handleClaim}>
                    Claim
                  </button>
                )}
              </>
            </div>

            {error && <p>An error happened while claiming: {error}</p>}
            {!loading && transactionHash && !error && (
              <p
                style={{
                  fontSize: '1.5rem',
                  width: '50rem',
                  wordBreak: 'break-word',
                }}
              >
                Your claim txn url:{' '}
                <a
                  href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  https://mumbai.polygonscan.com/tx/${transactionHash}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Claim;
