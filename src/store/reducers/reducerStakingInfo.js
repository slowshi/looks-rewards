const initialState = Object.freeze({
  price: 0,
  ethPrice: 0,
  totalSupply: 0,
  totalShares: 0,
  ethRewardsPerBlock: 0,
  blocksLeft: 0,
  nextRewardCalculation: 0,
  totalRewardsToDistribute: 0,
  tomorrowsRewards: 0,
  totalLooksToDistribute: 0,
  tomorrowsLooks: 0,
  loading: false
});

const stakingInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "clearStakingInfo":
      return initialState;
    case "updateStakingInfoKey":
      return {
        ...state,
        [action.payload.key]: action.payload.value
      }
    case "updateStakingInfo":
      return {
        ...action.payload
      }
    default:
    return state
  }
}

export default stakingInfoReducer;