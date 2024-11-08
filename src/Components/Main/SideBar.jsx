import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../Assests/css/CustomCss/SideBar.css';
import '../../Assests/js/CustomJs/SideBar.js';
import logo from '../../Assests/images/CompanyLogo.png'
import Navigation from './Navigation';
import { Width } from 'devextreme-react/chart';

class SideBar extends Component {

  render() {
    return (
      <div>
        <header>
          <Navigation />
        </header>

        <ul id="slide-out" className="sidenav sidenav-fixed">
          <li><img src={logo} alt="Company Logo" style={{"height" : "200%", "width" : "50%",
          "marginTop":"20%","marginLeft":"10%"}}/></li>
          <li className="active"><Link to="/">Home</Link></li>
          <li><Link to="/Customers">Customers</Link></li>
          <li><Link to="/Invoices">Invoices</Link></li>
          <li><Link to="/Receipts">Receipts</Link></li>
          <li><Link to="/Claim">Claim</Link></li>
          <li><Link to="/Items">Items</Link></li>
          <li><Link to="/PrintConditions">Print Conditions</Link></li>
          {/* <li className="no-padding">
            <ul className="collapsible collapsible-accordion">
              <li>
                <a className="collapsible-header">Admin Options<i className="material-icons right">arrow_drop_down</i></a>
                <div className="collapsible-body">
                  <ul>
                    <li><Link to="/Items">Items</Link></li>
                    <li><a href="#!">Payment Types</a></li>
                  </ul>
                </div>
              </li>
            </ul>
          </li> */}
        </ul>
      </div>
    );
  }
}

export default SideBar;