
import store from '../store/store';
import { rewards } from './rewards';
const formatURL = (state) => {
  let params = {};
  params = {
    address: state.app.address
  }

  if(Object.keys(params).length === 0) return '/';
  const searchParams = new URLSearchParams(params);
  const url = `/?${searchParams}`;
  return url;
};

const pageLoad = (clearCache = false)=> {
  const state = store.getState();
  const url = formatURL(state);
  window.history.replaceState(null, null, url);
  rewards.init(clearCache);
};

export default pageLoad;
