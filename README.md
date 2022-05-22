# SafeZen Frontend Application

This repository contains all frontend code written for project SafeZen as part of the HackMoney2022 Hackathon organised by ETHGlobal. This application where the users interacts with to purchase, claim insurance and claim yield from their insurance policies.

## How to start

- Run `npm install` to install the necessary packages
- Run `cp .env.template .env.development` and fill in the required environmant variables
- Run `npm run dev`
- Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

NEXT_PUBLIC_INFURA_ID - Infura project id
NEXT_PUBLIC_MAINNET - True if the contract is deployed on Polygon Mainnet / False if the contract is deployed on Polygon Mumbai Testnet
NEXT_PUBLIC_SAFEZEN_CA - SafeZen Contract's Address
NEXT_PUBLIC_GOVERNANCE_CA - Governance Contract 'sAddress
NEXT_PUBLIC_STAKING_CA - Staking Contract's Address

## Deployment

This project has been deployed on both [Heroku](https://safezen-staging-ui.herokuapp.com/) and on [Vercel](https://safezen.vercel.app/)
