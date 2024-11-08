import React, { useState, useCallback, useEffect, memo, useRef, useMemo } from 'react';
import axios from 'axios';
import '../../Assests/css/CustomCss/Receipt.css';

import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import $, { isEmptyObject } from 'jquery';

import { EmptyItem, Form, Item } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { Toolbar as TB, Item as TBItem } from 'devextreme-react/toolbar';

import dxTextArea from 'devextreme/ui/text_area';
import dxDropDownBox from 'devextreme/ui/drop_down_box';
import dxTextBox from 'devextreme/ui/text_box';
import dxNumberBox from 'devextreme/ui/number_box';
import { custom } from 'devextreme/ui/dialog';

import ReceiptList from './ReceiptsList';
import useGetNextCode from '../Common/useGetNextCode';
import GetInvoicesList from '../Common/GetInvoicesList'
import useGetCustomersList from '../Common/getCustomersList'

import CommonConstants from '../Common/CommonConstants';
import receiptConstants from './ReceiptConstants';
import { Link } from 'react-router-dom';
import dxDateBox from 'devextreme/ui/date_box';

const formRef = React.createRef();
const invoiceRef = React.createRef();

const receiptURL = receiptConstants.getReceiptURL();

function ReceiptForm(props) {
    const _popUpToggle = props._popUpToggle;
    const currentReceipt = props.currentReceipt;
    const _setToastConfig = props._setToastConfig;
    const _isNewRecord = props._isNewRecord;
    const token = props.token;

    const nextCode = useGetNextCode('Receipt', token);

    //--------Set Customer--------
    const loadCustomer = (isEmptyObject(currentReceipt) || currentReceipt.customerId === undefined || currentReceipt.customerId === null || _isNewRecord ? '' : currentReceipt.customerId);

    //--------Set Invoice--------
    const loadInvoice = (isEmptyObject(currentReceipt) || currentReceipt.invoiceId === undefined || currentReceipt.invoiceId === null || _isNewRecord ? '' : currentReceipt.invoiceId);

    //--------Get Receipt Stages List--------
    const loadReceiptStage = (isEmptyObject(currentReceipt) || currentReceipt.receiptStage === null || _isNewRecord ? 'WaitingForApproval' : currentReceipt.receiptStage);

    //--------Get Receipt Stages List--------
    const loadPaymentDate = (isEmptyObject(currentReceipt) || currentReceipt.paymentDate === undefined || currentReceipt.paymentDate === null || _isNewRecord ? new Date($.now()) : currentReceipt.paymentDate);

    const loadNextCode = (isEmptyObject(currentReceipt) || currentReceipt.receiptCode === undefined || currentReceipt.receiptCode === null || currentReceipt.receiptCode === '' || _isNewRecord ? nextCode : currentReceipt.receiptCode);

    const loadInterestRate = (isEmptyObject(currentReceipt) || currentReceipt.interestRate === undefined || currentReceipt.interestRate === null || _isNewRecord ? 0 : currentReceipt.interestRate);

    const loadInvoiceTotal = (isEmptyObject(currentReceipt) || currentReceipt.invoiceTotal === undefined || currentReceipt.invoiceTotal === null || _isNewRecord ? 0 : currentReceipt.invoiceTotal);
    
    const loadCumulativeInterest = (isEmptyObject(currentReceipt) || currentReceipt.cumulativeInterest === undefined || currentReceipt.cumulativeInterest === null || _isNewRecord ? 0 : currentReceipt.cumulativeInterest);

    const loadInvoiceDate = (isEmptyObject(currentReceipt) || currentReceipt.invoiceDate === undefined || currentReceipt.invoiceDate === null || _isNewRecord ? '' : currentReceipt.invoiceDate);

    const loadReceiptTotal = (isEmptyObject(currentReceipt) || currentReceipt.receiptTotal === undefined || currentReceipt.receiptTotal === null || _isNewRecord ? 0 : currentReceipt.receiptTotal);

    // const daysUptoNow = (_isNewRecord ? 0 : Math.round(Math.abs(new Date(loadPaymentDate) - new Date(loadInvoiceDate)) / (1000 * 60 * 60 * 24)) + 1);

    const [selectedCustomer, setselectedCustomer] = useState(loadCustomer);
    function onValueChange_selectedCustomer(e){
        setselectedCustomer(e);
    };

    const [selectedInvoice, setselectedInvoice] = useState(loadInvoice);
    function onValueChange_selectedInvoice(e){
        setselectedInvoice(e);
    };
    
    const [paymentDate, setPaymentDate] = useState(loadPaymentDate);
    function onValueChange_paymentDate(e){
        setPaymentDate(e);
    };

    const [interestRate, setInterestRate] = useState(loadInterestRate);
    function onValueChange_interestRate(e){
        setInterestRate(e);
    };

    const [cumulativeInterest, setCumulativeInterest] = useState(loadCumulativeInterest);
    function onValueChange_cumulativeInterest(e){      
        setCumulativeInterest(e);
    };

    const [invTotal, setInvTotal] = useState(loadInvoiceTotal);
    function onValueChange_invTotal(e){  
        setInvTotal(e);
    };

    const [invDate, setInvDate] = useState(loadInvoiceDate);
    function onValueChange_invDate(e){  
        setInvDate(e);
    };

    // const [cumulativeDays, setCumulativeDays] = useState(daysUptoNow);
    // function onValueChange_cumulativeDays(e){  
    //     setCumulativeDays(e);
    // };

    const [receiptTotal, setReceiptTotal] = useState(loadReceiptTotal);
    const onValueChange_receiptTotal = (e) => {  
        setReceiptTotal(e);
    };

    const customerEditorOption = {
        onFieldDataChanged: function (e) {
            formRef.current.props.formData.customerId = e;
            currentReceipt.customerId = e;
            onValueChange_selectedCustomer(e);           
            filterInvoices(e);
        }
    }

    const invoiceEditorOption = {
        onFieldDataChanged: function (e) {
            formRef.current.props.formData.invoiceId = e.id;      

            onValueChange_interestRate(e.interestRate);
            currentReceipt.interestRate = e.interestRate;

            const daysUptoNow = Math.round(Math.abs(new Date(Date.now()) - new Date(e.invoiceDate)) / (1000 * 60 * 60 * 24)) + 1;
            const interest = (e.invoiceTotal * e.interestRate * daysUptoNow) / (100 * 365); 

            onValueChange_cumulativeInterest(interest.toFixed(2));
            currentReceipt.cumulativeInterest = interest.toFixed(2);

            // onValueChange_cumulativeDays(daysUptoNow);
            // formRef.current.props.formData.cumulativeDays = daysUptoNow;

            onValueChange_invTotal(e.invoiceTotal);
            currentReceipt.invoiceTotal = e.invoiceTotal;

            formRef.current.props.formData.paymentDate = paymentDate;

            onValueChange_invDate(e.invoiceDate);
            currentReceipt.invoiceDate = e.invoiceDate;
        }
    }

    const paymentDateEditorOption = {
        value: (!_isNewRecord ? loadPaymentDate : paymentDate),
        displayFormat: "dd/MM/yyyy",
        readOnly: true,
        onValueChanged: {onValueChange_paymentDate},
        onFieldDataChanged: function (e) {
            formRef.current.props.formData.paymentDate = e;
            currentReceipt.paymentDate = e;

            formRef.current.props.formData.customerId = currentReceipt.customerId;
            formRef.current.props.formData.invoiceId = currentReceipt.invoiceId;
            filterInvoices(currentReceipt.customerId);

            onValueChange_interestRate(e.interestRate);
            currentReceipt.interestRate = e.interestRate;

            const daysUptoNow = Math.round(Math.abs(new Date(Date.now()) - new Date(e)) / (1000 * 60 * 60 * 24)) + 1;
            const interest = (e.invoiceTotal * e.interestRate * daysUptoNow) / (100 * 365); 

            onValueChange_cumulativeInterest(interest.toFixed(2));
            currentReceipt.cumulativeInterest = interest.toFixed(2);

            onValueChange_invTotal(e.invoiceTotal);
            currentReceipt.invoiceTotal = e.invoiceTotal;
        }
    }

    const receiptCodeEditorOption = {
        readOnly: true,
        value: loadNextCode,
    }

    const invInterestRateEditorOptions = {
        format: "#0.##'%'",
        readOnly: true,
        // valueChangeEvent:"input",
        value: (!_isNewRecord ? loadInterestRate : interestRate),
        onValueChange: {onValueChange_interestRate}
    }

    const cumulativeInterestEditorOptions = {
        format: "'Rs. ',##0.##",
        //readOnly: true,
        value: (!_isNewRecord ? loadCumulativeInterest : cumulativeInterest),
        onValueChange: {onValueChange_cumulativeInterest}
    }

    const invTotalEditorOption = {
        format: "'Rs. ',##0.##",
        readOnly: true,
        value: (!_isNewRecord ? loadInvoiceTotal : invTotal),
        onValueChange: {onValueChange_invTotal}
    }

    const invDateEditorOption = {
        displayFormat: "dd/MM/yyyy",
        readOnly: true,
        value: (!_isNewRecord ? loadInvoiceDate : invDate),
        onValueChange: {onValueChange_invDate}
    }

    // const cumulativeDaysEditorOption = {
    //     readOnly: true,
    //     value: cumulativeDays,
    //     onValueChange: {onValueChange_cumulativeDays}
    // }

    const paymentEditorOptions = {
        onValueChanged: function(e){
            const calcReceiptTotal = e.value - parseFloat((currentReceipt.cumulativeInterest === null ? 0 : currentReceipt.cumulativeInterest));
            formRef.current.props.formData.receiptTotal = calcReceiptTotal.toFixed(2);
            onValueChange_receiptTotal(calcReceiptTotal.toFixed(2));
            currentReceipt.receiptTotal = calcReceiptTotal.toFixed(2);
        }
    }

    const receiptTotalEditorOptions = {
        format: "'Rs. ',##0.##",
        readOnly: true,
        value: receiptTotal,
        //onValueChange: {onValueChange_receiptTotal}
    }

    const currentInteresetRateEditorOptions = {
        format: "#0.##'%'",
    }

    function onContentReady(){
        // if(_isNewRecord){
        //     return formRef.current.instance.resetValues();
        // }
    }
    

    function filterInvoices(selected_Customer) {
        if(selected_Customer !== undefined && selected_Customer !== ''){
        return (
            <React.Fragment>
                <GetInvoicesList invoiceRef={invoiceRef} stage={currentReceipt.receiptStage} newRecord={_isNewRecord} cusId={selected_Customer}/>
            </React.Fragment>
        );
        }
    }

    function refreshPage(){
        setTimeout(function(){
            window.location.reload(1);
        }, 2005)
    }
    function handleSubmit(e) {
        const { isValid } = e.validationGroup.validate();
        if (isValid) {
            if (_isNewRecord) {
                insertItem();
            }
            else {
                updateItem();
            }
            _popUpToggle();
            return (
                <React.Fragment>
                    <ReceiptList />
                </React.Fragment>
            );
        }
    }

    //New record's data will be inserted to the database
    function insertItem() {
        try {
            axios.post(receiptURL, receiptConstants.insertAndUpdateData(currentReceipt, 'Insert'), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    _setToastConfig(true, 'success', 'Data saved Successfully');
                })
                .catch(function (error) {
                    _setToastConfig(true, 'error', 'Data NOT saved Successfully. ERROR: ' + error.response.data);
                })
            refreshPage();
        } catch (error) {
            _setToastConfig(true, 'error', 'Data NOT updated Successfully. ERROR:' + error);
            refreshPage();
        }
    }

    //All the record's data will be updated in the database
    function updateItem() {
        try {
            axios.put(receiptURL, receiptConstants.insertAndUpdateData(currentReceipt, 'Update'), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    _setToastConfig(true, 'success', 'Data updated Successfully');
                })
                .catch(function (error) {
                    _setToastConfig(true, 'error', 'Data NOT updated Successfully. ERROR: ' + error.response.titile + '\n' + error.response.data);
                })
            refreshPage();
        } catch (error) {
            _setToastConfig(true, 'error', 'Data NOT updated Successfully. ERROR:' + error);
            refreshPage();
        }
    }

    function handleApprove(e) {
        let myDialog = custom({
            title: "Confirm changes",
            messageHtml: "Are you sure you want to approve this receipt?",
            buttons: [{
                text: "Yes",
                onClick: (e) => {
                    return { buttonText: e.component.option("text") }
                }
            },
            {
                text: "No",
                onClick: (e) => {
                    return { buttonText: e.component.option("text") }
                }
            },
            ]
        });

        myDialog.show().then((dialogResult) => {
            try {
                if (dialogResult.buttonText === "Yes") {
                    currentReceipt.receiptStage = 'Approved';
                    axios.put(receiptURL + '/ApproveReceipt', receiptConstants.insertAndUpdateData(currentReceipt, 'Update'), {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    })
                        .then(response => {
                            _setToastConfig(true, 'success', 'Receipt has been approved');
                        })
                        .catch(function (error) {
                            _setToastConfig(true, 'error', 'Receipt has NOT been approved. ERROR: ' + error.response.data);
                        })
                    refreshPage();
                }
            } catch (error) {
                _setToastConfig(true, 'error', 'Receipt has NOT been approved. ERROR:' + error);
                refreshPage();
            }
        });
    }

    const invoiceListRender = (props) => {
        return (
            <React.Fragment>
                <GetInvoicesList invoiceProps={props} stage={currentReceipt.receiptStage} newRecord={_isNewRecord} cusId={currentReceipt.customerId} />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <TB id='TB'>
                <TBItem location="before">
                    <Button icon='close' text='Cancel' onClick={() => { _popUpToggle(); }} type='danger' />
                </TBItem>
                <TBItem location="before">
                    <Button icon='save' text='Save' onClick={e => { handleSubmit(e, _setToastConfig, _isNewRecord, _popUpToggle); }} type='success' validationGroup="receiptValidation" disabled={((_isNewRecord === false && (loadReceiptStage === 'Approved' || loadReceiptStage === 'Claimed')) ? true : false)} />
                </TBItem>
                <TBItem location="before">
                    <Button icon='check' text='Approve' onClick={e => { handleApprove(e, _setToastConfig); }} type='normal' disabled={((_isNewRecord === false && (loadReceiptStage === 'WaitingForApproval')) ? false : true)} />
                </TBItem>
                <TBItem location="before">
                    <Button icon='check' text='Print' type='normal' className='printBtn' disabled={((_isNewRecord === true || loadReceiptStage === 'WaitingForApproval') ? true : false)} >
                        <i class="dx-icon dx-icon-doc"></i>
                        <span>
                            <Link to={{
                                pathname: "/Receipt/Print/" + currentReceipt.receiptCode,
                                id: { id: currentReceipt.receiptCode },
                                state: { fromDashboard: true }
                            }} target={'_blank'}>Print</Link>
                        </span>
                    </Button>
                </TBItem>
            </TB>
            <br />
            <div className='divider'></div>
            <br />
            <Form formData={currentReceipt} ref={formRef} validationGroup="receiptValidation" scrollingEnabled={true} onContentReady={onContentReady} readOnly={loadReceiptStage === 'Approved' ? true : false}>
                <Item itemType="group" colCount={2}>
                    <Item dataField="receiptCode" editorType={dxTextBox} caption="Receipt Code" editorOptions={receiptCodeEditorOption} />
                    <Item dataField="paymentDate" label={{ text: "Payment Date" }} editorType={dxDateBox} editorOptions={paymentDateEditorOption} isRequired={true}/>
                </Item>
                <Item itemType="group" >
                    <Item dataField="customerId" isRequired={true} label={{ text: "Customer" }} editorType={dxDropDownBox} editorOptions={customerEditorOption} component={useGetCustomersList} validationGroup="receiptValidation" />
                </Item>
                <Item itemType="group" caption="Invoice Details" cssClass="rptInvSection">
                    <Item itemType="group" colCount={3}>
                        <Item dataField="invoiceId" isRequired={true} label={{ text: "Invoice" }} editorType={dxDropDownBox} render={invoiceListRender} colSpan={2} editorOptions={invoiceEditorOption} ref={invoiceRef} validationGroup="receiptValidation" />
                        <Item dataField="invoiceDate" label={{ text: "Invoice Date" }} editorType={dxDateBox} editorOptions={invDateEditorOption} />
                    </Item>
                    <Item itemType="group" colCount={3}>
                        <Item dataField="interestRate" label={{ text: "Interest Rate" }} helpText="*annual rate" editorType={dxNumberBox} editorOptions={invInterestRateEditorOptions} />
                        <Item dataField="cumulativeInterest" label={{ text: "Cumulative Interest" }} editorType={dxNumberBox} editorOptions={cumulativeInterestEditorOptions} />
                        <Item dataField="invoiceTotal" label={{ text: "Invoice Total" }} editorType={dxNumberBox} editorOptions={invTotalEditorOption} />
                        {/* <Item dataField="cumulativeDays" label={{ text: "Cumulative Days" }} editorType={dxNumberBox} editorOptions={cumulativeDaysEditorOption} /> */}
                    </Item>
                </Item>
                <Item itemType="group">
                    <Item dataField="description" label={{ text: "Description" }} editorType={dxTextArea} />
                </Item>
                <Item itemType="group" colCount={3}>
                    <Item dataField="payment" label={{ text: "Payment (Rs.)" }} editorType={dxNumberBox} editorOptions={paymentEditorOptions} isRequired={true} />
                    {/* <Item dataField="receiptTotal" label={{ text: "Receipt Total" }} editorType={dxNumberBox} editorOptions={receiptTotalEditorOptions} /> */}
                </Item>
                <Item itemType="group" colCount={3}> 
                    <Item dataField="currentInterestRate" label={{ text: "Current Int. Rate" }} editorType={dxNumberBox} helpText="*annual rate" editorOptions={currentInteresetRateEditorOptions}/>
                </Item>

                {/* <Item itemType="group" colCount={3}>
            <EmptyItem/>
            <EmptyItem/>
            <Item dataField="receiptTotal" label={{ text: "Receipt Total" }} editorType={dxNumberBox} />
          </Item> */}

                {/* <Item itemType="group" colCount={2} colSpan={2}>
          <Item dataField="createdDate" editorOptions={recordUserDetails} />
          <Item dataField="createdDate" editorOptions={recordUserDetails} />
          <Item dataField="lastModifiedDate" editorOptions={recordUserDetails} />
          <Item dataField="lastModifiedBy" editorOptions={recordUserDetails} />
        </Item> */}

            </Form>
       </React.Fragment>
    );

}


export default ReceiptForm;