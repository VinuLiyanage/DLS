import React, { useState, memo } from 'react';
import { Popup } from 'devextreme-react/popup';
import { isEmptyObject } from 'jquery';
import '../../Assests/css/CustomCss/Invoice.css';

import NotificationPanel from '../Main/NotificationPanel';
import ReceiptFormRender from './ReceiptForm';
import authentication from "react-azure-b2c";

function Receipt(props) {

  const token = authentication.getAccessToken().accessToken; //get token
  const _isNewRecord = props.isNewRecord;
  const _popUpToggle = props.togglePopup;
  const currentReceipt = (!isEmptyObject(props.currentReceiptData) ? props.currentReceiptData : {});
  
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    type: 'info',
    message: 'data success'
  });
 
  function _setToastConfig(_isVisible, _type, _message) {
    setToastConfig({
      ...toastConfig,
      isVisible: _isVisible,
      type: _type,
      message: _message,
    });
  }

  function onHiding() {
    setToastConfig({
        ...toastConfig,
        isVisible: false,
    });
}


const receiptRender = () => {
  return(
    <ReceiptFormRender token = {token} currentReceipt = {currentReceipt} _isNewRecord = {_isNewRecord} _setToastConfig = {_setToastConfig} _popUpToggle = {_popUpToggle}/>
  )
}
return (
    <>
        <Popup
            width={1000}
            height={650}
            visible={props.isPopupVisible}
            onHiding={props.togglePopup}
            position="center"
            title="Receipt Info"
            contentRender={receiptRender}
            resizeEnabled={true}
            dragEnabled={true} />
        <NotificationPanel isVisible={toastConfig.isVisible} message={toastConfig.message} type={toastConfig.type} onHiding={onHiding} />
    </>
);
}

export default memo(Receipt);
