import {createStore} from 'redux';
import rootReducer from './reducers/rootReducer';

const searchParams = (new URL(document.location)).searchParams;
let addressParams = '';
let address = '';
let fiatCurrency = 'usd';
if (searchParams.has('currency')) {
  fiatCurrency = searchParams.get('currency');
}
if (searchParams.has('address')) {
  address = searchParams.get('address');
}
const store = createStore(rootReducer,
{
  app: {
    address,
    addressParams,
    fiatCurrency,
    listingPrice: 1,
    royalties: 5
  }
});


export default store;