import pageLoad from '../../utils/pageLoad';
import {useDispatch} from "react-redux";
import { useState } from "react";

function Nav() {
  const dispatch = useDispatch();
  const [address, setAddresses] = useState('');
  const onClickSearch = ()=> {
    const searchForm = document.getElementById('search');
    if(searchForm) {
      finishSumitForm(searchForm);
    } else {
      pageLoad(true);
    }
  };

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
            <form id="search" className="needs-validation flex-1"
                    onSubmit={submitForm}>
                <input
                onInput={(e)=>setAddresses(e.target.value)}
                className="form-control me-2"
                placeholder="Wallet Address or ENS"
                name="address"/>
            </form>
          </div>
          <div>
            <button className="btn btn-outline-light" onClick={onClickSearch}>
              <span className="bi bi-search"></span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
export default Nav;