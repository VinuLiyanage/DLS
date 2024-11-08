import React, { useState, useCallback, useEffect, memo, useRef } from 'react';
import axios from 'axios';
import ClaimConstants from './ClaimConstants';
import CustomerData from './CustomerData';
import Invoices from './IncoicesData';
import authentication from "react-azure-b2c";
import CustomerSelectionPopup from '../Claim/CustomerSelectionPopup';
import NotificationPanel from '../Main/NotificationPanel';

import '../../Assests/css/CustomCss/Claim.css';

const paymentURL = ClaimConstants.getPaymentURL();
const customerURL = ClaimConstants.getCustomersURL();
const InvoiceURL = ClaimConstants.getInvoiceURL();
const ReceiptURL = ClaimConstants.getReceiptURL();

function Claim() {
    const token = authentication.getAccessToken().accessToken; //get token 
    const customerCode = window.location.href.split('=')[1];

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

    //Display the list of payments
    function getPayments(setResponseData, token, cCode) {
        return (
            axios({
                "method": "GET",
                "url": paymentURL + '/GetByCustomerCode/' + cCode,
                "headers": {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => {
                    setResponseData(response.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        );
    }

    let [responseData, setResponseData] = useState([]);
    const fetchData = useCallback(() => {
        getPayments(setResponseData, token, customerCode)
    }, [])
    useEffect(() => {
        fetchData()
    }, [fetchData])

    const totalCredit = useRef(0);
    var _totalCredit = 0
    const totalPaid = useRef(0);
    var _totalPaid = 0
    const totalDue = useRef(0);
    var _totalDue = 0

    for (var item of responseData) {
        _totalCredit = _totalCredit + item.totalCredit;
        _totalPaid = _totalPaid + item.totalPaid;
        _totalDue = _totalDue + item.totalDue;
    }  

        totalCredit.current = _totalCredit;
        totalPaid.current = _totalPaid;
        totalDue.current = _totalDue;
    
    return (
        <React.Fragment>
            <div className='section mg-20'>
                <h4 className="z-depth-2 p-15 center">INVOICE CLAIM</h4>
                <div id='divCustomer'>
                    <div className="dx-field-label">Select Customer</div>
                    <div className="dx-field-value">
                        <CustomerSelectionPopup Payments={getPayments} setRD={setResponseData} cCode={customerCode} />
                    </div>
                </div>
                <div id='divClaimCustomer'>
                    <div className='row'>
                        <div className="col s4">
                            <div id="totalCredit" className="z-depth-2 p-15 center">
                                <h5>Total Credit</h5>
                                <h6>Rs. {(responseData === '' ? 0 : (totalCredit.current.toLocaleString()))}</h6>
                            </div>
                        </div>

                        <div className="col s4">
                            <div id="totalPaid" className="z-depth-2 p-15 center">
                                <h5>Total Paid</h5>
                                <h6>Rs. {(responseData === '' ? 0 : (totalPaid.current.toLocaleString()))}</h6>
                            </div>
                        </div>

                        <div className="col s4">
                            <div id="totalDue" className="z-depth-2 p-15 center">
                                <h5>Total Due</h5>
                                <h6>Rs. {(responseData === '' ? 0 : (totalDue.current.toLocaleString()))}</h6>
                            </div>
                        </div>

                    </div>
                    <CustomerData dataSource={(responseData === '' ? {} : responseData)} />
                    <div id='grids'>
                        <Invoices dataSource={(responseData === '' ? {} : responseData)} setToastConfig={_setToastConfig}/>
                    </div>
                </div>
            </div>
            <NotificationPanel isVisible={toastConfig.isVisible} message={toastConfig.message} type={toastConfig.type} onHiding={onHiding} />
        </React.Fragment>
    );
}

export default memo(Claim);