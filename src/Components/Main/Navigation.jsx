import React from 'react';
import '../../Assests/css/CustomCss/Navigation.css';
import '../../Assests/js/CustomJs/Navigation.js';
import authentication from 'react-azure-b2c';

function LogOut() {
    authentication.signOut();
}
function Navigation() {
    return (
        <nav>
            <div className="nav-wrapper">
                <div className="row">
                    <div className="col s12">
                        <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
                        <a class="waves-effect waves-light btn right" onClick={LogOut}>Log Out</a>
                        {/* <div class="fixed-action-btn">
                            <a class="btn-floating btn-large dodger blue">
                                <i class="large material-icons">account_circle</i>
                            </a>
                            <ul>
                                <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
                                <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
                                <li><a class="btn-floating red" onClick={LogOut}><i class="material-icons">directions_run</i></a></li>
                                <li><a class="btn-floating grey"><i class="material-icons">settings</i></a></li>
                            </ul>
                        </div> */}
                        <a class="waves-effect waves-light btn left" style={{ background:'crimson'}}>Trial version (Valid for 30 days)</a>
                        <a href="https://codepen.io/collection/nbBqgY" target="_blank" className="brand-logo">DLS</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;