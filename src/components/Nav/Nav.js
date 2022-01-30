import pageLoad from '../../utils/pageLoad';
import {useSelector, useDispatch} from "react-redux";
import { useState } from "react";
import {fiatCurrencyMap} from '../../utils/constants'
import { Link, useMatch } from "react-router-dom";

function Nav() {
  const dispatch = useDispatch();
  const [address, setAddresses] = useState('');
  const isCompare = useMatch({ path: '/compare', end: true });
  const onClickSearch = ()=> {
    const searchForm = document.getElementById('search');
    if(searchForm) {
      finishSumitForm(searchForm);
    } else {
      pageLoad(true);
    }
  };
  const currency = useSelector((state)=>state.app.fiatCurrency);
  const updateFiatCurrency = (e) => {
    dispatch({
      type: 'updateAppKey',
      payload: {
        key: 'fiatCurrency',
        value: e.target.value
      }
    });
    pageLoad();
  }
  const submitForm = event => {
    event.preventDefault();
    event.stopPropagation();
    const searchForm = event.target;
    finishSumitForm(searchForm);
  };

  const finishSumitForm = (searchForm) => {
    searchForm.classList.add('was-validated');
    if (searchForm.checkValidity()) {
      dispatch({
        type: 'updateAppKey',
        payload: {
          key: 'address',
          value: address
        }
      });
      pageLoad(true);
    }
  }
  return (
    <div className="sticky-top">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand mb-0 h1" href="/">
            LooksRewards
          </a>
          <div className="flex-1">
            {isCompare === null ?
            <div>
              <form id="search" className="needs-validation flex-1 me-2"
                      onSubmit={submitForm}>
                  <input
                  value={address}
                  onInput={(e)=>setAddresses(e.target.value)}
                  className="form-control me-2"
                  placeholder="Wallet Address or ENS"
                  name="address"/>
              </form>
            </div>
            :<div></div>}
          </div>
          <div>
            <button className="btn btn-outline-light me-2" onClick={onClickSearch}>
              <span className="bi bi-search"></span>
            </button>
          </div>
          <select value={currency} title="Currency" className="btn btn-dark me-2" aria-label="Currency"
            onChange={updateFiatCurrency}>
              {Object.keys(fiatCurrencyMap).map((currencyKey, index)=>
              <option key={index} value={currencyKey}>{fiatCurrencyMap[currencyKey].label}</option>
              )}
          </select>
        </div>
      </nav>
      <div className="p-2">
        <Link className="btn btn-sm btn-outline-light" to="/compare">Compare</Link>
      </div>
    </div>
  );
}
export default Nav;