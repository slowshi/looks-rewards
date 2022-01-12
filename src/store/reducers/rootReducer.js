import {combineReducers} from 'redux';
import reducerApp from './reducerApp';
import reducerStakingInfo from './reducerStakingInfo';
import reducerBalances from './reducerBalances';

const rootReducer = combineReducers({
  app: reducerApp,
  stakingInfo: reducerStakingInfo,
  balance: reducerBalances
});

export default rootReducer;