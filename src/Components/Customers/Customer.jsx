import React, { useState, useEffect, memo, useRef } from 'react';
import { isEmptyObject } from 'jquery';

import { Popup } from 'devextreme-react/popup';

import NotificationPanel from '../Main/NotificationPanel';
import CustomerFormRender from './CustomerForm';
import authentication from "react-azure-b2c";

function Customer(props){
  const token = authentication.getAccessToken().accessToken; //get token
  let currentCustomer = (!isEmptyObject(props.currentCustomerData) ? props.currentCustomerData : {});
  let _isNewRecord = props.isNewRecord;
  let _popUpToggle = props.togglePopup;

  const [toastConfig, setToastConfig] = useState({});
  const extToastConfig = useRef({
    isVisible: false,
    type: 'info',
    message: 'data success'
  });

  useEffect(() => {
    extToastConfig.current = toastConfig;
  }, [toastConfig]);

  function onHiding() {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  }

  function _setToastConfig(_isVisible, _type, _message) {
    setToastConfig({
      ...toastConfig,
      isVisible: _isVisible,
      type: _type,
      message: _message,
    });
  }

  const CustomerformRender = () => {
    return(
      <CustomerFormRender token = {token} currentCustomer = {currentCustomer} _isNewRecord = {_isNewRecord} _setToastConfig = {_setToastConfig} _popUpToggle = {_popUpToggle}/>
    )
  }
 
  return (
    <>
      <Popup
        width={900}
        height={650}
        visible={props.isPopupVisible}
        onHiding={props.togglePopup}
        position="center"
        title="Customer Info"
        contentRender={CustomerformRender}
        resizeEnabled={true}
        dragEnabled={true}/>
      <NotificationPanel isVisible={toastConfig.isVisible} message={toastConfig.message} type={toastConfig.type} onHiding={onHiding} />
    </>
  );
}

export default memo(Customer);