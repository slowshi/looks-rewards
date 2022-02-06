
import {useEffect} from 'react';
import {useSelector} from "react-redux";
import './App.css';
import 'bootstrap-dark-5/dist/css/bootstrap-night.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import {rewards} from './utils/rewards';
import { fiatCurrencyMap, DEX_SCREENER, addresses } from './utils/constants';
import store from './store/store';

function App() {
  const ETHChart = `${DEX_SCREENER}${addresses['WETH-USDC']}`;
  const LOOKSChart = `${DEX_SCREENER}${addresses['LOOKS-WETH']}`;

  useEffect(() => {
    store.dispatch({
      type: 'updateStakingInfoKey',
      payload: {
        key: 'loading',
        value: true
      }
    });
    store.dispatch({
      type: 'updateBalanceKey',
      payload: {
        key: 'loading',
        value: true
      }
    });
    rewards.init(true);
    setInterval(() => {
      rewards.init(true);
    }, 15000);
  }, []);
  const stakingInfoLoading = useSelector(state=>state.stakingInfo.loading);
  const balanceLoading = useSelector(state=>state.balance.loading);
  const hasAddress = useSelector(state=>state.app.address!=='');
  const currencyConversion = useSelector(state=>state.app.currencyConversion);
  const fiatCurrency = useSelector(state=>state.app.fiatCurrency);
  const convertPrice = (value) => {
    const currencyInfo = fiatCurrencyMap[fiatCurrency];
    return Number(value / currencyConversion).toLocaleString(undefined, {
      style: 'currency',
      currency: currencyInfo.label,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  };
  const stakingInfo = useSelector(state=> {
    const stateStakingInfo = state.stakingInfo;
    const price = stateStakingInfo.price;
    document.title = `LooksRewards - ${convertPrice(Number(price))}`
    return {
      ...stateStakingInfo,
      totalShares: Number(stateStakingInfo.totalShares).toFixed(6),
      ethPriceInUSD: convertPrice(Number(stateStakingInfo.ethPrice)),
      looksPriceInUSD: convertPrice(Number(price)),
      tomorrowsRewardsInETH: Number(stateStakingInfo.tomorrowsRewards).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      tomorrowsRewardsInUSD: convertPrice(Number(stateStakingInfo.tomorrowsRewards * stateStakingInfo.ethPrice)),
      totalRewardsToDistributeInETH: Number(stateStakingInfo.totalRewardsToDistribute).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      totalRewardsToDistributeInUSD: convertPrice(Number(stateStakingInfo.totalRewardsToDistribute * stateStakingInfo.ethPrice)),
      tomorrowsLooksInLOOKS: Number(stateStakingInfo.tomorrowsLooks).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      tomorrowsLooksInETH: Number(stateStakingInfo.tomorrowsLooks * price / stateStakingInfo.ethPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      tomorrowsLooksInUSD: convertPrice(Number(stateStakingInfo.tomorrowsLooks * price)),
      totalLooksToDistributeInLOOKS: Number(stateStakingInfo.totalLooksToDistribute).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      totalLooksToDistributeInETH: Number(stateStakingInfo.totalLooksToDistribute * price / stateStakingInfo.ethPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      totalLooksToDistributeInUSD: convertPrice(Number(stateStakingInfo.totalLooksToDistribute * price))
    }
  });
  const balance = useSelector(state=> {
    const stateBalance = state.balance;
    const stateStakingInfo = state.stakingInfo;
    const looksShares = stateBalance.looksShares;
    const totalShares = stateStakingInfo.totalShares;
    const percentOfStake = (looksShares / totalShares);
    const ethRewards = stateBalance.ethRewards;
    const price = stateStakingInfo.price;
    const ethPrice = stateStakingInfo.ethPrice;
    const tomorrowsRewards = stateStakingInfo.tomorrowsRewards * percentOfStake;
    const ethRewardsToday = stateStakingInfo.totalRewardsToDistribute * percentOfStake;
    const tomorrowsLooks = stateStakingInfo.tomorrowsLooks * percentOfStake;
    const looksRewardsToday = stateStakingInfo.totalLooksToDistribute * percentOfStake;
    return {
      ...stateBalance,
      looksShares: Number(looksShares).toLocaleString(undefined, {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      looksSharesInUSD: convertPrice(Number(price * looksShares)),
      looksSharesInETH: Number(price * looksShares / ethPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      ethRewardsInETH: Number(ethRewards).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      ethRewardsInUSD: convertPrice(Number(ethPrice * ethRewards)),
      percenateOfStake: Number(percentOfStake).toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      ethRewardsTodayInUSD: convertPrice(Number(ethPrice * ethRewardsToday)),
      ethRewardsTodayInETH: Number(ethRewardsToday).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      ethRewardsTomorrowInETH: Number(tomorrowsRewards).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      ethRewardsTomorrowInUSD: convertPrice(Number(tomorrowsRewards * ethPrice)),
      looksRewardsTomorrowInLOOKS: Number(tomorrowsLooks).toLocaleString(undefined, {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      looksRewardsTomorrowInETH: Number(tomorrowsLooks * price / ethPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      looksRewardsTomorrowInUSD: convertPrice(Number(tomorrowsLooks * price)),
      looksRewardsTodayInLOOKS: Number(looksRewardsToday).toLocaleString(undefined, {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      looksRewardsTodayInETH: Number(looksRewardsToday * price / ethPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      looksRewardsTodayInUSD: convertPrice(Number(looksRewardsToday * price))
    }
  });
  /*
    Percentage of Staking?
  */
  return (
    <div className="h-100 d-flex flex-column">
      <Nav></Nav>
      <div className="flex-1">
        <div className="container pt-3">
          <div className="row">
            <div className="col-sm-12 col-md-4">
              <div className="card mb-3">
                <div className="card-body text-center">
                  <div className="d-flex align-items-center justify-content-center">
                    LOOKS Price
                    <a className="btn text-dark btn-sm" target="_blank" rel="noreferrer"
                    href={LOOKSChart}>
                      <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  </div>
                  {stakingInfoLoading ?
                    <div className="placeholder w-100"></div>
                      :
                    <div>{stakingInfo.looksPriceInUSD}</div>
                  }
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="card mb-3">
                <div className="card-body text-center">
                  <div className="d-flex align-items-center justify-content-center">
                    ETH Price
                    <a className="btn text-dark btn-sm" target="_blank" rel="noreferrer"
                    href={ETHChart}>
                      <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  </div>
                  {stakingInfoLoading ?
                    <div className="placeholder w-100"></div>
                      :
                    <div>{stakingInfo.ethPriceInUSD}</div>
                  }
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="card mb-3">
                <div className="card-body text-center">
                  <div className="d-flex align-items-center justify-content-center">
                    Daily Reset
                    <a className="btn text-dark btn-sm" target="_blank" rel="noreferrer"
                    href={`https://etherscan.io/block/countdown/${stakingInfo.periodEndBlock}`}>
                      <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                    </div>
                  {stakingInfoLoading ?
                    <div className="placeholder w-100"></div>
                      :
                    <div>{stakingInfo.nextRewardCalculation}</div>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-4">
              <div className="card mb-3">
                <div className="card-body text-center">
                  <div>Daily LOOKS Rewards</div>
                  {stakingInfoLoading ?
                    <div className="placeholder w-100"></div>
                      :
                    <div>
                      <div>{stakingInfo.tomorrowsLooksInUSD}</div>
                      <div className="txt-smol">(LOOKS {stakingInfo.tomorrowsLooksInLOOKS})</div>
                      <div className="txt-smol">({stakingInfo.tomorrowsLooksInETH})</div>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="card mb-3">
                <div className="card-body text-center">
                  <div>Remaining Total ETH Payout Today</div>
                  {stakingInfoLoading ?
                    <div className="placeholder w-100"></div>
                      :
                    <div>
                      <div>{stakingInfo.totalRewardsToDistributeInUSD}</div>
                      <div className="txt-smol">({stakingInfo.totalRewardsToDistributeInETH})</div>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="card mb-3">
                <div className="card-body text-center">
                  <div>Total ETH Rewards Tomorrow</div>
                  {stakingInfoLoading ?
                    <div className="placeholder w-100"></div>
                      :
                    <div>
                      <div>{stakingInfo.tomorrowsRewardsInUSD}</div>
                      <div className="txt-smol">({stakingInfo.tomorrowsRewardsInETH})</div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          {hasAddress ?
          <div>
            <div className="row">
              <div className="col-sm-12 col-md-4">
                <div className="card mb-3">
                  <div className="card-body text-center">
                    <div>LOOKS Balance</div>
                    {balanceLoading ?
                      <div className="placeholder w-100"></div>
                        :
                      <div>
                        <div>{balance.looksSharesInUSD}</div>
                        <div className="txt-smol">(LOOKS {balance.looksShares})</div>
                        <div className="txt-smol">({balance.looksSharesInETH})</div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-4">
                <div className="card mb-3">
                  <div className="card-body text-center">
                    <div>Remaining LOOKS Payout Today</div>
                    {balanceLoading ?
                      <div className="placeholder w-100"></div>
                        :
                      <div>
                        <div>{balance.looksRewardsTodayInUSD}</div>
                        <div className="txt-smol">(LOOKS {balance.looksRewardsTodayInLOOKS})</div>
                        <div className="txt-smol">({balance.looksRewardsTodayInETH})</div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-4">
                <div className="card mb-3">
                  <div className="card-body text-center">
                    <div>LOOKS Rewards Tomorrow</div>
                    {balanceLoading ?
                      <div className="placeholder w-100"></div>
                        :
                      <div>
                        <div>{balance.looksRewardsTomorrowInUSD}</div>
                        <div className="txt-smol">(LOOKS {balance.looksRewardsTomorrowInLOOKS})</div>
                        <div className="txt-smol">({balance.looksRewardsTomorrowInETH})</div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-4">
                <div className="card mb-3">
                  <div className="card-body text-center">
                    <div>ETH Balance</div>
                    {balanceLoading ?
                      <div className="placeholder w-100"></div>
                        :
                      <div>
                        <div>{balance.ethRewardsInUSD}</div>
                        <div className="txt-smol">({balance.ethRewardsInETH})</div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-4">
                <div className="card mb-3">
                  <div className="card-body text-center">
                    <div>Remaining ETH Payout Today</div>
                    {balanceLoading ?
                      <div className="placeholder w-100"></div>
                        :
                      <div>
                        <div>{balance.ethRewardsTodayInUSD}</div>
                        <div className="txt-smol">({balance.ethRewardsTodayInETH})</div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-4">
                <div className="card mb-3">
                  <div className="card-body text-center">
                    <div>ETH Rewards Tomorrow</div>
                    {balanceLoading ?
                      <div className="placeholder w-100"></div>
                        :
                      <div>
                        <div>{balance.ethRewardsTomorrowInUSD}</div>
                        <div className="txt-smol">({balance.ethRewardsTomorrowInETH})</div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          : ''}
        </div>
      </div>
      <div className="ms-3 txt-smol">* Not affiliated with LooksRare.org. Buy me a beer, donate below!</div>
      <Footer></Footer>
    </div>
  );
}

export default App;
