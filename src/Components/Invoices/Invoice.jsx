import React, { useState, memo } from 'react';
import { Popup } from 'devextreme-react/popup';
import { isEmptyObject } from 'jquery';
import '../../Assests/css/CustomCss/Invoice.css';

import NotificationPanel from '../Main/NotificationPanel';
import InvoiceformRender from './InvoiceForm';
import authentication from "react-azure-b2c";

var currentInvoice;

function Invoice(props) {

  const token = authentication.getAccessToken().accessToken; //get token
  const _isNewRecord = props.isNewRecord;
  const _popUpToggle = props.togglePopup;
  currentInvoice = (!isEmptyObject(props.currentInvoiceData) ? props.currentInvoiceData : {});
  
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

const invoiceRender = () => {
  return(
    <InvoiceformRender token = {token} currentInvoice = {currentInvoice} _isNewRecord = {_isNewRecord} _setToastConfig = {_setToastConfig} _popUpToggle = {_popUpToggle}/>
  )
}
return (
    <React.Fragment>
        <Popup
            width={1290}
            height={670}
            visible={props.isPopupVisible}
            onHiding={props.togglePopup}
            position="center"
            title="Invoice Info"
            contentRender={invoiceRender}
            dragEnabled={true} />
        <NotificationPanel isVisible={toastConfig.isVisible} message={toastConfig.message} type={toastConfig.type} onHiding={onHiding} />
    </React.Fragment>
);
}

export default memo(Invoice);



  

  // const PriceFormat = {
  //    style: 'currency', 
  //    currency: 'LKR', 
  //    minimumSignificantDigits: 2 
  // }

  
//   function onChangesChange(e) {
//     //invoiceCalculations(e);
//   }

//   function onRowInserted(e) {
//     // if (!_isNewRecord) {
//     //   var linesCount = dataGridRef.current.instance.totalCount();
//     //   formRef.current.props.formData.invoiceLines[linesCount - 1].invoiceId = currentInvoice.id;
//     // }
//     // invoiceCalculations(e);
//   }

//   function onRowUpdated() {
//     //invoiceCalculations();
//   }

  


  
