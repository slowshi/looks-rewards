
import {useEffect} from 'react';
import {useSelector} from "react-redux";
import './App.css';
import 'bootstrap-dark-5/dist/css/bootstrap-night.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import {rewards} from './utils/rewards';

function App() {
  const ETHChart = 'https://dexscreener.com/ethereum/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640';
  const LOOKSChart = 'https://dexscreener.com/ethereum/0x4b5ab61593a2401b1075b90c04cbcdd3f87ce011';

  // I dunno...
  const hackyBool = true;
  useEffect(()=>{
    if(hackyBool) {
      console.log('do')
      rewards.init();
    }
  },[hackyBool]);
  const stakingInfoLoading = useSelector(state=>state.stakingInfo.loading);
  const balanceLoading = useSelector(state=>state.balance.loading);
  const hasAddress = useSelector(state=>state.app.address!=='')
  const stakingInfo = useSelector(state=> {
    const stateStakingInfo = state.stakingInfo;
    let fractionDigits = 2;
    if(state.app.fiatCurrency === 'eth' || state.app.fiatCurrency === 'btc') {
      fractionDigits = 8;
    }
    return {
      ...stateStakingInfo,
      totalShares: Number(stateStakingInfo.totalShares).toFixed(6),
      ethPriceInUSD: Number(stateStakingInfo.ethPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      }),
      looksPriceInUSD: Number(stateStakingInfo.price).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      }),
      tomorrowsRewardsInETH: Number(stateStakingInfo.tomorrowsRewards).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      tomorrowsRewardsInUSD: Number(stateStakingInfo.tomorrowsRewards * stateStakingInfo.ethPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      }),
      totalRewardsToDistributeInETH: Number(stateStakingInfo.totalRewardsToDistribute).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      totalRewardsToDistributeInUSD: Number(stateStakingInfo.totalRewardsToDistribute * stateStakingInfo.ethPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      }),
      tomorrowsLooksInLOOKS: Number(stateStakingInfo.tomorrowsLooks).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      tomorrowsLooksInETH: Number(stateStakingInfo.tomorrowsLooks * stateStakingInfo.price / stateStakingInfo.ethPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      tomorrowsLooksInUSD: Number(stateStakingInfo.tomorrowsLooks * stateStakingInfo.price).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      }),
      totalLooksToDistributeInLOOKS: Number(stateStakingInfo.totalLooksToDistribute).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      totalLooksToDistributeInETH: Number(stateStakingInfo.totalLooksToDistribute * stateStakingInfo.price / stateStakingInfo.ethPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      totalLooksToDistributeInUSD: Number(stateStakingInfo.totalLooksToDistribute * stateStakingInfo.price).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      })
    }
  });
  console.log(stakingInfo);
  const balance = useSelector(state=> {
    const stateBalance = state.balance;
    const stateStakingInfo = state.stakingInfo;
    let fractionDigits = 2;
    if(state.app.fiatCurrency === 'eth' || state.app.fiatCurrency === 'btc') {
      fractionDigits = 8;
    }
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
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      }),
      looksSharesInUSD: Number(price * looksShares).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      }),
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
      ethRewardsInUSD: Number(ethPrice * ethRewards).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      }),
      percenateOfStake: Number(percentOfStake).toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      ethRewardsTodayInUSD: Number(ethPrice * ethRewardsToday).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      }),
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
      ethRewardsTomorrowInUSD: Number(tomorrowsRewards * ethPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      }),
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
      looksRewardsTomorrowInUSD: Number(tomorrowsLooks * price).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      }),
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
      looksRewardsTodayInUSD: Number(looksRewardsToday * price).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      })
    }
  });
  // console.log(balance);

  /*
    Looks Rewards Today
    Looks Rewards Tomorrow
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
                  <div>Daily Reset</div>
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
      <Footer></Footer>
    </div>
  );
}

export default App;
