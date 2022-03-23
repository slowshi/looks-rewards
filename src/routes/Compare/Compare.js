import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from '../../components/Footer/Footer';
import {useEffect} from 'react';
import { useSelector } from "react-redux";
import store from '../../store/store';
import {rewards} from '../../utils/rewards';
import { fiatCurrencyMap, DEX_SCREENER, addresses } from '../../utils/constants';
import Nav from '../../components/Nav/Nav';

function Compare() {
  const ETHChart = `${DEX_SCREENER}${addresses['WETH-USDC']}`;
  const LOOKSChart = `${DEX_SCREENER}${addresses['LOOKS-WETH']}`;
  //this will change
  // const dailyLooksTradingRewards = 2866500.00;
  const dailyLooksTradingRewards = 1361587.50;
  // const dailyLooksTradingRewards = 537468.75;
  // const dailyLooksTradingRewards = 286650.00;
  useEffect(() => {
    store.dispatch({
      type: 'updateStakingInfoKey',
      payload: {
        key: 'loading',
        value: true
      }
    });
    rewards.init(false);
    setInterval(() => {
      rewards.init(true);
    }, 15000);
  }, []);
  const listingPrice = useSelector(state=>state.app.listingPrice);
  const listingPriceInETH = useSelector(state=>Number(state.app.listingPrice).toLocaleString(undefined, {
    style: 'currency',
    currency: 'ETH',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  }));

  const royalties = useSelector(state=>state.app.royalties);
  const royaltiesString = useSelector((state)=> {
    return Number(state.app.royalties / 100)
    .toLocaleString(undefined,
      {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      });
  });
  const stakingInfoLoading = useSelector(state=>state.stakingInfo.loading);
  const currencyConversion = useSelector(state=>state.app.currencyConversion);
  const fiatCurrency = useSelector(state=>state.app.fiatCurrency);
  const currencyLabel = useSelector(state=>fiatCurrencyMap[state.app.fiatCurrency].label);

  const convertPrice = (value) => {
    const currencyInfo = fiatCurrencyMap[fiatCurrency];
    return Number(value / currencyConversion).toLocaleString(undefined, {
      style: 'currency',
      currency: currencyInfo.label,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  };
  const osProfit = useSelector((state)=> {
    const royalty = Number(state.app.royalties / 100);
    const tradingFee = .025;
    const totalFee = royalty + tradingFee;
    const profitEth = Number(state.app.listingPrice * (1 - totalFee));
    return {
      USD: convertPrice(state.stakingInfo.ethPrice * profitEth),
      ETH: (profitEth).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      })
    }
  });
  const lrProfit = useSelector((state)=> {
    const royalty = Number(state.app.royalties / 100);
    const tradingFee = .02;
    const totalFee = royalty + tradingFee;
    const listingPrice = Number(state.app.listingPrice);
    const profitEth = Number((listingPrice * (1 - totalFee)));

    const volume = (state.stakingInfo.tomorrowsRewards + state.stakingInfo.totalRewardsToDistribute) * 100;
    const rewardRatio = listingPrice / (volume + listingPrice);
    let looksRewards = 0;
    if(state.stakingInfo.loading === false) {
       looksRewards = dailyLooksTradingRewards * rewardRatio / 2;
    }

    const looksRewardsToUSD = convertPrice(looksRewards * state.stakingInfo.price)
    const totalUSD = Number((profitEth * state.stakingInfo.ethPrice) + (looksRewards * state.stakingInfo.price))
    return {
      USD: convertPrice(totalUSD),
      ETH: (profitEth).toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      }),
      looksRewards: (looksRewards).toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      }),
      looksRewardsToUSD
    }
  });

  const listingPriceInUSD = useSelector(state=>convertPrice(
    Number(state.stakingInfo.ethPrice * state.app.listingPrice)
  ))
  const stakingInfo = useSelector((state)=>{
    const volume = (state.stakingInfo.tomorrowsRewards + state.stakingInfo.totalRewardsToDistribute) * 100;
    return {
      ethPriceInUSD: convertPrice(Number(state.stakingInfo.ethPrice)),
      looksPriceInUSD: convertPrice(Number(state.stakingInfo.price)),
      volumeInUSD: volume.toLocaleString(undefined, {
        style: 'currency',
        currency: 'ETH',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      volumeInETH: convertPrice(Number(volume * state.stakingInfo.ethPrice))
    }
  });
  const updateListingPrice = (e) => {
    store.dispatch({
      type: 'updateAppKey',
      payload: {
        key: 'listingPrice',
        value: e.target.value
      }
    });
  };
  const updateRoyalties = (e) => {
    store.dispatch({
      type: 'updateAppKey',
      payload: {
        key: 'royalties',
        value: e.target.value
      }
    });
  };

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
                    Estimated 24H Volume
                  </div>
                  {stakingInfoLoading ?
                    <div className="placeholder w-100"></div>
                      :
                    <div>
                      <div>{stakingInfo.volumeInETH}</div>
                      <div className="txt-smol">({stakingInfo.volumeInUSD})</div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">
                        Listing Amount (ETH)
                      </label>
                      <input type="number" className="form-control" id="ETHlistingPrice" placeholder="4.2069" value={listingPrice} onChange={updateListingPrice}/>
                      <div className="txt-smol text-end">({listingPriceInUSD})</div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Royalties %
                      </label>
                      <input type="number" className="form-control" id="royalties" placeholder="5" value={royalties} onChange={updateRoyalties}/>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">OpenSea</th>
                        <th scope="col">LooksRare</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">Listed Price</th>
                        <td>{listingPriceInETH}</td>
                        <td>{listingPriceInETH}</td>
                      </tr>
                      <tr>
                        <th scope="row">Listed Price ({currencyLabel})</th>
                        <td>{listingPriceInUSD}</td>
                        <td>{listingPriceInUSD}</td>
                      </tr>
                      <tr>
                        <th scope="row">Trading Fee</th>
                        <td>2.5%</td>
                        <td>2%</td>
                      </tr>
                      <tr>
                        <th scope="row">Royalties</th>
                        <td>{royaltiesString}</td>
                        <td>{royaltiesString}</td>
                      </tr>
                      <tr>
                        <th scope="row">Trading Rewards (LOOKS)</th>
                        <td>0</td>
                        <td>{lrProfit.looksRewards}</td>
                      </tr>
                      <tr>
                        <th scope="row">Trading Rewards ({currencyLabel})</th>
                        <td>0</td>
                        <td>{lrProfit.looksRewardsToUSD}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th scope="row">Profit</th>
                        <td>{osProfit.ETH}</td>
                        <td>
                          <div>{lrProfit.ETH}</div>
                          <div>LOOKS {lrProfit.looksRewards}</div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Profit ({currencyLabel})</th>
                        <td>{osProfit.USD}</td>
                        <td>{lrProfit.USD}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
export default Compare;