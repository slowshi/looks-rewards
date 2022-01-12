import { Component } from 'react';
import avatar from '../../assets/avatar.png';
import {DEV_ADDRESS} from '../../utils/constants';
import './Footer.css';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
  }
  copyClipboard() {
    this.setState({
      copied: true
    });
    navigator.clipboard.writeText(DEV_ADDRESS);
    setTimeout(()=>{
      this.setState({
        copied: false
      });
    }, 2000);
  }
  render() {
    return  <div className="w-100">
            <hr className="text-light"></hr>
              <div className="container-fluid">
                <div className="row">
                  <div id="leftNav" className="col-md-6 mb-3 col-sm-12">
                    <div className="p-2">
                      <img src={avatar} alt="Slowshi.eth" width="22" height="22"/>
                    </div>
                    <a id="discord" className="btn text-light" target="__blank" title="Discord" href="https://discord.gg/Tq3bTFkURb">
                      <i className="bi bi-discord"></i>
                    </a>
                    <a id="twitter" className="btn text-light" target="__blank" title="Twitter" href="https://twitter.com/slowshi">
                      <i className="bi bi-twitter"></i>
                    </a>
                  </div>
                  <div id="rightNav" className="col-md-6 mb-3 col-sm-12">
                  <div id="donate" className="input-group input-group-sm">
                    <span className="input-group-text">Donate</span>
                    <input type="text" className="form-control" disabled value={DEV_ADDRESS} aria-label="Dev Address"/>
                      <button className="btn btn-dark" type="button" id="button-addon2"
                      onClick={this.copyClipboard.bind(this)}>
                      {this.state.copied ?
                      <i className="bi bi-clipboard-check"></i>
                      :
                      <i className="bi bi-clipboard"></i>
                      }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  }
}
export default Footer;