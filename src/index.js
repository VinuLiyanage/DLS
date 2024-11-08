import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import './global';
import reportWebVitals from './reportWebVitals';
import authentication from 'react-azure-b2c';
import store from "../src/Components/Claim/Store/ClaimStore";
import { Provider } from "react-redux";

authentication.initialize({
  // optional, will default to this
  instance: 'https://digitallendingsystem.b2clogin.com', 
  // your B2C tenant
  tenant: 'digitallendingsystem.onmicrosoft.com',
  // the policy to use to sign in, can also be a sign up or sign in policy
  signInPolicy: 'B2C_1_Signin',
  // the the B2C application you want to authenticate with (that's just a random GUID - get yours from the portal)
  clientId: '##################################',
  // where MSAL will store state - localStorage or sessionStorage
  cacheLocation: 'localStorage',
  // the scopes you want included in the access token
  scopes: ['https://digitallendingsystem.onmicrosoft.com/dls-api/task.All'],
  // optional, the redirect URI - if not specified MSAL will pick up the location from window.href
  redirectUri: '{{REDIRECT_URL}}',
  postLogoutRedirectUri: window.location.origin,
});

authentication.run(() => {
  // const root = ReactDOM.createRoot(document.getElementById('root'));
  // root.render(<App />);
  ReactDOM.render(<React.StrictMode><Provider store={store}><App /></Provider></React.StrictMode>, document.getElementById('root'));
});


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
