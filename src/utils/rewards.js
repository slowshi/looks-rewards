import {ethers} from 'ethers';
import {cacheEthers} from './cacheEthersService';
import ERC20ABI from '../abis/ERC20.json';
import CurrencyABI from '../abis/Currency.json';
import TokenDistributorABI from '../abis/TokenDistributor.json';
import FeeSharingSystemABI from '../abis/FeeSharingSystem.json';
import PairContractABI from '../abis/PairContract.json';
import {addresses, decimals, fiatCurrencyMap, network} from '../utils/constants';
import store from '../store/store';

/* eslint-disable */
class Rewards {
  async init(clearCache=false) {
    const state = store.getState();
    const currencyConversion = await this.getCurrencyConversion(state.app.fiatCurrency, clearCache);
    store.dispatch({
      type: 'updateAppKey',
      payload: {
        key: 'currencyConversion',
        value: currencyConversion
      }
    });
    this.getStakingInfo(clearCache)
    .then(async (stakingInfo)=> {
      store.dispatch({
        type: 'updateStakingInfo',
        payload: stakingInfo
      });
      store.dispatch({
        type: 'updateStakingInfoKey',
        payload: {
          key: 'loading',
          value: false
        }
      });
      if(state.app.address !== '') {
        this.getBalances(state.app.address, clearCache)
        .then((balance)=>{
          store.dispatch({
            type: 'updateBalance',
            payload: {
              ...balance,
              loading: false
            }
          });
        })
      }
    })
  }
  async getStakingInfo(clearCache=false) {
    const looksContract = cacheEthers.contract(addresses.LOOKS, ERC20ABI, network.rpcURL);
    const wethContract = cacheEthers.contract(addresses.WETH, ERC20ABI, network.rpcURL);
    const feeSharingContract = cacheEthers.contract(addresses.feeSharingSystem, FeeSharingSystemABI, network.rpcURL);
    const tokenDistributorContract = cacheEthers.contract(addresses.distributor, TokenDistributorABI, network.rpcURL);
    const blockInterval = 6500;
    let looksPerBlock = await cacheEthers.contractCall(
      tokenDistributorContract,
      'rewardPerBlockForStaking',
      [],
      clearCache
    );
    looksPerBlock = ethers.utils.formatUnits(looksPerBlock, decimals.LOOKS);
    const tomorrowsLooks = looksPerBlock * blockInterval;
    let totalSupply = await cacheEthers.contractCall(
      looksContract,
      'totalSupply',
      [],
      clearCache
    );
    totalSupply = ethers.utils.formatUnits(totalSupply, decimals.LOOKS);
    const price = await this.getLooksPrice(clearCache);
    const ethPrice = await this.getEthPrice(clearCache);
    const currentBlock = await cacheEthers.blockNumber(network.rpcURL, true);
    let periodEndBlock = await cacheEthers.contractCall(
      feeSharingContract,
      'periodEndBlock',
      [],
      clearCache
    );
    let totalShares = await cacheEthers.contractCall(
      feeSharingContract,
      'totalShares',
      [],
      clearCache
    );
    totalShares = ethers.utils.formatUnits(totalShares, decimals.LOOKS);
    let ethRewardsPerBlock = await cacheEthers.contractCall(
      feeSharingContract,
      'currentRewardPerBlock',
      [],
      clearCache
    );
    ethRewardsPerBlock = ethers.utils.formatUnits(ethRewardsPerBlock, decimals.LOOKS);
    const blocksLeft = periodEndBlock - currentBlock;
    const secondsLeft = this.secondsUntilBlock(currentBlock, periodEndBlock, network.blockRateSeconds);
    const nextRewardCalculation = this.prettifySeconds(secondsLeft);
    let tomorrowsRewards = await cacheEthers.contractCall(
      wethContract,
      'balanceOf',
      [addresses.feeSetting],
      clearCache
    );

    tomorrowsRewards = ethers.utils.formatUnits(tomorrowsRewards, decimals.WETH) / 2;
    return {
      price,
      ethPrice,
      totalSupply,
      totalShares,
      ethRewardsPerBlock,
      blocksLeft,
      nextRewardCalculation,
      totalLooksToDistribute: blocksLeft * looksPerBlock,
      tomorrowsLooks,
      totalRewardsToDistribute: blocksLeft * ethRewardsPerBlock,
      tomorrowsRewards
    }
  }
  async getBalances(userAddress, clearCache=false) {
    const looksContract = cacheEthers.contract(addresses.LOOKS, ERC20ABI, network.rpcURL);
    let looksBalance = await cacheEthers.contractCall(
      looksContract,
      'balanceOf',
      [userAddress],
      clearCache
    );
    looksBalance = ethers.utils.formatUnits(looksBalance, decimals.LOOKS);

    const feeSharingContract = cacheEthers.contract(addresses.feeSharingSystem, FeeSharingSystemABI, network.rpcURL);
    let looksShares = await cacheEthers.contractCall(
      feeSharingContract,
      'calculateSharesValueInLOOKS',
      [userAddress],
      clearCache
    );
    looksShares = ethers.utils.formatUnits(looksShares, decimals.LOOKS);

    let ethRewards = await cacheEthers.contractCall(
      feeSharingContract,
      'calculatePendingRewards',
      [userAddress],
      clearCache
    );
    ethRewards = ethers.utils.formatUnits(ethRewards, decimals.WETH);
    return {
      looksBalance,
      looksShares,
      ethRewards,
    }
  }

  async getLooksPrice(clearCache=false) {
    const pairContract = cacheEthers.contract(addresses['LOOKS-WETH'], PairContractABI, network.rpcURL);
    let reserves = await cacheEthers.contractCall(
      pairContract,
      'getReserves',
      [],
      clearCache
    );
    const ethPrice = await this.getEthPrice(clearCache);
    const token0 = ethers.utils.formatUnits(reserves.reserve0, decimals.WETH) * ethPrice;
    const token1 = ethers.utils.formatUnits(reserves.reserve1, decimals.LOOKS);
    return token0 / token1;
  }

  async getEthPrice(clearCache=false) {
    const ethContract = cacheEthers.contract(addresses['WETH-USDC'], PairContractABI, network.rpcURL);
    const ethReserves = await cacheEthers.contractCall(
      ethContract,
      'getReserves',
      [],
      clearCache
    );
    return ethers.utils.formatUnits(ethReserves.reserve0, decimals.USDC) /
    ethers.utils.formatUnits(ethReserves.reserve1, decimals.WETH);
  }

  async getCurrencyConversion(currencyKey='usd', clearCache=false) {
    if(currencyKey === 'usd') return 1;
    if(currencyKey === 'aed') return 0.27;
    const currencyAddress = fiatCurrencyMap[currencyKey].address;
    const currenyContract = cacheEthers.contract(currencyAddress, CurrencyABI, network.rpcURL);
    let latestAnswer = await cacheEthers.contractCall(
      currenyContract,
      'latestAnswer',
      [],
      clearCache
    );
    latestAnswer = Number(ethers.utils.formatUnits(latestAnswer, 8));
    return latestAnswer;
  }

  secondsUntilBlock(startBlock, endBlock, blockRateSeconds) {
    const blocksAway = endBlock - startBlock;
    const secondsAway = blocksAway * blockRateSeconds;
    return secondsAway;
  }

  prettifySeconds(seconds, resolution) {
    if (seconds !== 0 && !seconds || seconds < 0) {
      return 'SOON';
    }
    const absSeconds = Math.abs(seconds);
    const d = Math.floor(absSeconds / (3600 * 24));
    const h = Math.floor((absSeconds % (3600 * 24)) / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);

    if (resolution === 'day') {
      return d + (d == 1 ? ' day' : ' days');
    }

    const dDisplay = d > 0 ? d + (d === 1 ? ' day, ' : ' days, ') : '';
    const hDisplay = h > 0 ? h + (h === 1 ? ' hr, ' : ' hrs, ') : '';
    const mDisplay = m > 0 ? m + (m === 1 ? ' min' : ' mins') : '';

    let result = dDisplay + hDisplay + mDisplay;
    if (mDisplay === '') {
      result = result.slice(0, result.length - 2);
    }
    let neg = '';
    if(seconds < 0){
      neg = '-'
    }
    return `${neg} ${result}`;
  }
}

const rewards = new Rewards();
export {
  rewards
};