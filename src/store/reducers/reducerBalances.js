const initialState = {
  looksBalance: 0,
  looksShares: 0,
  ethRewards: 0,
  loading: true
};
const balancesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "clearBalance":
      return initialState;
    case "updateBalanceKey":
      return {
        ...state,
        [action.payload.key]: action.payload.value
      }
    case "updateBalance":
      return {
        ...state,
        ...action.payload
      }
    default:
    return state
  }
}

export default balancesReducer;