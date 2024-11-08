import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { isEmptyObject } from 'jquery';

import DataGrid, { Column, Editing, Scrolling, ColumnChooser, ColumnFixing, StateStoring, Toolbar, Item as DGItem, Summary, TotalItem } from 'devextreme-react/data-grid';
import Form, { Item, Label } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { Toolbar as TB, Item as TBItem } from 'devextreme-react/toolbar';

import dxTextArea from 'devextreme/ui/text_area';
import dxDropDownBox from 'devextreme/ui/drop_down_box';
import dxTextBox from 'devextreme/ui/text_box';
import dxNumberBox from 'devextreme/ui/number_box';
import { custom } from 'devextreme/ui/dialog';

import useGetCustomersList from '../Common/getCustomersList'
import getItemsList from '../Common/getItemsList';
import InvoicesList from './InvoicesList';
import CommonConstants from '../Common/CommonConstants';
import invoiceConstants from './InvoiceConstants';
import useGetNextCode from '../Common/useGetNextCode';
import useGetMasterData from '../MasterData/getMasterData';

const formRef = React.createRef();
const dataGridRef = React.createRef();

const invoiceURL = invoiceConstants.getInvoiceURL();

function addNewRow() {
    return (
        dataGridRef.current.instance.addRow()
    );
}

function InvoiceForm(props) {
    const _popUpToggle = props._popUpToggle;
    const currentInvoice = props.currentInvoice;
    const _setToastConfig = props._setToastConfig;
    const _isNewRecord = props._isNewRecord;
    const token = props.token;

    const invoiceLinesDataStore = new ArrayStore({
        data: (!isEmptyObject(currentInvoice) ? currentInvoice.invoiceLines : []),
        key: 'id',
    });

    const invoiceLinesData = new DataSource({
        store: invoiceLinesDataStore,
        reshapeOnPush: true
    });

    //-------- next Invoice Code--------
    const nextInvoiceNumber = useGetNextCode('Invoice', token);
    //--------Set Customer--------
    const loadCustomer = (isEmptyObject(currentInvoice) || currentInvoice.customerId === null || props.isNewRecord ? '' : currentInvoice.customerId);
    //--------Get Invoice Statuses List--------
    const loadInvoiceStatus = (isEmptyObject(currentInvoice) || currentInvoice.invoiceStatus === null || props.isNewRecord ? 'Active' : currentInvoice.invoiceStatus);
    //--------Get Invoice Statuses List--------
    const loadInvoiceStage = (isEmptyObject(currentInvoice) || currentInvoice.invoiceStage === null || props.isNewRecord ? 'WaitingForApproval' : currentInvoice.invoiceStage);
    //--------Get Payment Methods List--------
    const loadPaymentMethod = (isEmptyObject(currentInvoice) || currentInvoice.paymentMethod === null || props.isNewRecord ? 'Cash' : currentInvoice.paymentMethod);

    const loadNextCode = (isEmptyObject(currentInvoice) || currentInvoice.invoiceNumber === undefined || currentInvoice.invoiceNumber === null || props.isNewRecord ? nextInvoiceNumber : currentInvoice.invoiceNumber);

    //const loadTotalInterest = (isEmptyObject(currentInvoice) || currentInvoice.totalInterest === undefined ? 0 : currentInvoice.totalInterest);

    //const loadInvoiceTotal = (isEmptyObject(currentInvoice) || currentInvoice.invoiceTotal === undefined ? 0 : currentInvoice.invoiceTotal);

    const loadCreaditPeriod = (isEmptyObject(currentInvoice) || currentInvoice.creditPeriod === undefined ? 12: currentInvoice.creditPeriod);

    const loadCreditPeriodDays = (isEmptyObject(currentInvoice) || currentInvoice.creditPeriodDays === undefined || currentInvoice.creditPeriodDays === null ? 0 : currentInvoice.creditPeriodDays);

    const statusesList = useGetMasterData('InvoiceStatuses', token);
    const statuses = (statusesList !== '' ? statusesList.map(val => val.name) : statusesList);

    const paymentMethodsList = useGetMasterData('PaymentMethods', token);
    const paymentMethods = (paymentMethodsList !== '' ? paymentMethodsList.map(val => val.name) : paymentMethodsList);

    // const [goldPercentage, setGoldPercentage] = useState(0);
    // function onValueChanged_goldPercentage(e) {
    //     setGoldPercentage(e)
    // }

    const customerEditorOption = {
        value: loadCustomer,
        onFieldDataChanged: function (e) {
            formRef.current.props.formData.customerId = e;
            currentInvoice.customerId = e;
        }
    }

    const invoiceStatusEditorOption = {
        value: loadInvoiceStatus,
        readOnly: props.isNewRecord ? true : false,
        items: statuses,
        onFieldDataChanged: function (e) {
            formRef.current.props.formData.invoiceStatus = e;
            currentInvoice.invoiceStatus = e;
        }
    }

    const creditPeriodEditorOption = {
        showSpinButtons: true,
        useLargeSpinButtons: true,
        step: 6,
        min: 6,
        max: 12,
        format: "00",
        value: loadCreaditPeriod,
        onKeyUp: function(e){  
            if (!(e.component._parsedValue == 6 || e.component._parsedValue == 12)) {  
              e.preventDefault();
            }  
        },
        onValueChanged: function (e) {
            //confirmChangeCreditPeriod(e);
            if (dataGridRef.current.instance.getVisibleRows().length > 0) {
                formRef.current.props.formData.creditPeriod = e.value;
                currentInvoice.creditPeriod = e.value;
                CalculateTotalsWhenChangeCreaditPeriod();
                invoiceCalculations();
            }
            if (e.value !== null) {
                return true;
            }
        }
    }

    const paymentMethodEditorOptions = {
        value: loadPaymentMethod,
        items: paymentMethods,
        onFieldDataChanged: function (e) {
            formRef.current.props.formData.paymentMethod = e;
            currentInvoice.paymentMethod = e;
        }
    }

    const invoiceCodeEditorOption = {
        readOnly: true,
        value: loadNextCode
    }

    const itemEditorOption = {
        onFieldDataChanged: function (e) {
            e.quantity = 1;
        }
    }

    const quantityEditorOptions = {
        value: 1,
    }

    function confirmChangeCreditPeriod(e) {
        let myDialog = custom({
            title: "Change Credit Period",
            messageHtml: "Are you sure you want to change the credit period?",
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
                const invLinesDS = dataGridRef.current.instance.getDataSource();
                if (dialogResult.buttonText === "Yes") {
                    return true;
                }
                else{
                    return false;
                }
            } catch (error) {
                _setToastConfig(true, 'error', 'Credit Period can NOT change. ERROR:' + error);
                CommonConstants.refreshPage();
                return false;
            }
        });
    }

    function calculateNetWeight(e) {
        if (!isEmptyObject(e) && e !== {} && e !== undefined && e !== null) {
            if(e.item  === undefined){
                e.item = [];
            }
            const calcGoldPercentage = (e.item === undefined || e.item.goldPrecentage === undefined ? 0 : e.item.goldPrecentage);
            const calculateNetWeight = ((e.weight === undefined || e.weight === null ? 0 : e.weight) * calcGoldPercentage) / 100;

            e.netWeight = calculateNetWeight
            return calculateNetWeight;
        }
    }

    function calcInterest(e){
        if (currentInvoice.creditPeriod === null) {
            currentInvoice.creditPeriod = loadCreaditPeriod;
        }
        const _interestRate = (e.interestRate === undefined || e.interestRate === null) ? 0 : e.interestRate;
        var calcEndDate = new Date();
        calcEndDate.setMonth(calcEndDate.getMonth() + currentInvoice.creditPeriod);
        var difference = calcEndDate - new Date();
        var calcDays = (loadCreditPeriodDays === 0 ? Math.ceil(difference / (1000 * 3600 * 24)) : loadCreditPeriodDays);

        const remainCreditDaysInterrest = parseFloat(((_interestRate / (365 * 100)) * calcDays).toFixed(2));
        const _itemValue = (e.itemValue === undefined || e.itemValue === null) ? 0 : e.itemValue;
        const _quantity = (e.quantity === undefined || e.quantity === null) ? 1 : e.quantity;

        const interest = (_itemValue * _quantity * remainCreditDaysInterrest);

        return interest;
    }

    function CalculateTotalsWhenChangeCreaditPeriod() {
        const invLinesDS = dataGridRef.current.instance.getVisibleRows();

        for (let i = 0; i < invLinesDS.length; i++) {
            const _itemValue = invLinesDS[i].data.itemValue;
            const _quantity = invLinesDS[i].data.quantity;
            const _serviceCharge = invLinesDS[i].data.serviceCharge;
            const interest = calcInterest(invLinesDS[i].data);
            const exclPrice = (_itemValue * _quantity);
            const inclPrice = exclPrice + interest + _serviceCharge;

            const lineData = {
                interest: interest.toFixed(2),
                exclPrice: exclPrice.toFixed(2),
                inclPrice: inclPrice.toFixed(2),
            }

            invoiceLinesDataStore.push([{ type: 'update', key: invLinesDS[i].data.key, data: lineData }]);
        }
    }

    function calculateInterest(e) {
        const interest = calcInterest(e).toFixed(2);
        e.interest = interest;

        return interest;
    }

    function calculateExclPrice(e) {
        const _itemValue = (e.itemValue === undefined || e.itemValue === null) ? 0 : e.itemValue;
        const _quantity = (e.quantity === undefined || e.quantity === null) ? 0 : e.quantity;
        const exclPrice = ((_itemValue * _quantity)).toFixed(2);
        e.exclPrice = exclPrice;

        return exclPrice;
    }

    function calculateInclPrice(e) {
        const interest = calcInterest(e);

        const _serviceCharge = (e.serviceCharge === undefined || e.serviceCharge === null) ? 0 : e.serviceCharge;
        const _itemValue = (e.itemValue === undefined || e.itemValue === null) ? 0 : e.itemValue;
        const _quantity = (e.quantity === undefined || e.quantity === null) ? 0 : e.quantity;

        const inclPrice = ((_itemValue * _quantity) + interest + _serviceCharge).toFixed(2);
        e.inclPrice = inclPrice;

        return inclPrice;
    }
    
    // function qtyCellValue(e){
    //     if(e.quantity === undefined){
    //         e.quantity = 1;
    //         return 1;   
    //     }
    //     else{
    //         return e.quantity;
    //     }
    // }

    function handleSubmit(e, _setToastConfig, _isNewRecord, _popUpToggle) {
        const { isValid } = e.validationGroup.validate();
        if (isValid) {
            if (_isNewRecord) {
                insertItem(_setToastConfig);
            }
            else {
                updateItem(_setToastConfig);
            }
            _popUpToggle();
            return (
                <InvoicesList />
            );
        }
    }


    //New record's data will be inserted to the database
    function insertItem(_setToastConfig) {
        try {
            invoiceCalculations();
            const invLinesDS = dataGridRef.current.instance.getDataSource();

            axios.post(invoiceURL, invoiceConstants.insertAndUpdateData(currentInvoice, invLinesDS, 'Insert'), {
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
            CommonConstants.refreshPage();
        } catch (error) {
            _setToastConfig(true, 'error', 'Data NOT updated Successfully. ERROR:' + error);
            CommonConstants.refreshPage();
        }
    }

    //All the record's data will be updated in the database
    function updateItem(_setToastConfig) {
        try {
            invoiceCalculations();
            const invLinesDS = dataGridRef.current.instance.getDataSource();
            axios.put(invoiceURL, invoiceConstants.insertAndUpdateData(currentInvoice, invLinesDS, 'Update'), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    _setToastConfig(true, 'success', 'Data updated Successfully');
                })
                .catch(function (error) {
                    _setToastConfig(true, 'error', 'Data NOT updated Successfully. ERROR: ' + error.response.data.title);
                    console.log("Error: " + error.response.data.errors[0])
                })
            CommonConstants.refreshPage();
        } catch (error) {
            _setToastConfig(true, 'error', 'Data NOT updated Successfully. ERROR:' + error);
            CommonConstants.refreshPage();
        }
    }

    function handleApprove(e, _setToastConfig) {
        let myDialog = custom({
            title: "Confirm changes",
            messageHtml: "Are you sure you want to approve this invoice?",
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
                const invLinesDS = dataGridRef.current.instance.getDataSource();
                if (dialogResult.buttonText === "Yes") {
                    currentInvoice.invoiceStage = 'Approved';
                    axios.put(invoiceURL + '/ApproveInvoice', invoiceConstants.insertAndUpdateData(currentInvoice, invLinesDS, 'Update'), {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then(response => {
                            _setToastConfig(true, 'success', 'Invoice has been approved');
                            formRef.current.instance.readOnly = true;
                        })
                        .catch(function (error) {
                            _setToastConfig(true, 'error', 'Invoice has NOT been approved. ERROR: ' + error.response.data);
                        })
                    CommonConstants.refreshPage();
                }
            } catch (error) {
                _setToastConfig(true, 'error', 'Invoice has NOT been approved. ERROR:' + error);
                CommonConstants.refreshPage();
            }
        });
    }


    function onStateResetClick() {
        dataGridRef.current.instance.state(null);
    }

    function invoiceCalculations() {
        if (dataGridRef.current !== null) {
            var interest = dataGridRef.current.instance.getTotalSummaryValue('interest');
            var inclPrice = dataGridRef.current.instance.getTotalSummaryValue('inclPrice');
            var weight = dataGridRef.current.instance.getTotalSummaryValue('weight');
            var netWeight = dataGridRef.current.instance.getTotalSummaryValue('netWeight');
            var marketValue = dataGridRef.current.instance.getTotalSummaryValue('marketValue');
            var estimatedValue = dataGridRef.current.instance.getTotalSummaryValue('estimatedValue');
            var advance = dataGridRef.current.instance.getTotalSummaryValue('itemValue');
        }

        // totalInterestRef.current.props.editorOptions.onFieldDataChanged(interest);
        // invoicetota.current.props.editorOptions.onFieldDataChanged(inclPrice);
        formRef.current.props.formData.totalInterest = interest;
        currentInvoice.totalInterest = interest;
        formRef.current.props.formData.invoiceTotal = inclPrice;
        currentInvoice.invoiceTotal = inclPrice

        formRef.current.props.formData.totalWeight = weight;
        currentInvoice.totalWeight = weight;
        formRef.current.props.formData.totalNetWeight = netWeight;
        currentInvoice.totalNetWeight = netWeight;

        formRef.current.props.formData.estimatedValue = estimatedValue;
        currentInvoice.estimatedValue = estimatedValue;
        formRef.current.props.formData.marketValue = marketValue;
        currentInvoice.marketValue = marketValue;
        formRef.current.props.formData.advance = advance;
        currentInvoice.advance = advance;
    }

    function onSaved() {
        invoiceCalculations();
    }

    return (
        <React.Fragment>
            <div id="invoiceForm">
                <TB id='TB'>
                    <TBItem location="before">
                        <Button icon='close' text='Cancel' onClick={() => { _popUpToggle(); }} type='danger' />
                    </TBItem>
                    <TBItem location="before">
                        <Button icon='save' text='Save' onClick={e => { handleSubmit(e, _setToastConfig, _isNewRecord, _popUpToggle); }} type='success' validationGroup="invoiceValidation" disabled={((_isNewRecord === false && (loadInvoiceStage === 'Approved' || loadInvoiceStage === 'Claimed')) ? true : false)} />
                    </TBItem>
                    <TBItem location="before">
                        <Button icon='check' text='Approve' onClick={e => { handleApprove(e, _setToastConfig); }} type='normal' disabled={((_isNewRecord === false && (loadInvoiceStage === 'WaitingForApproval')) ? false : true)} />
                    </TBItem>
                    <TBItem location="before">
                        <Button icon='check' text='Print' type='normal' className='printBtn' disabled={((_isNewRecord === true || loadInvoiceStage === 'WaitingForApproval') ? true : false)}>
                            <i class="dx-icon dx-icon-doc"></i>
                            <span>
                                <Link to={{
                                    pathname: "/Invoice/Print/" + currentInvoice.id,
                                    id: { id: currentInvoice.id },
                                    state: { fromDashboard: true }
                                }} target={'_blank'}>Print</Link>
                            </span>
                        </Button>
                    </TBItem>

            </TB>
            <br />
            <div className='divider'></div>
            <br />
            <Form id='invForm' formData={currentInvoice} ref={formRef} validationGroup="invoiceValidation" scrollingEnabled={true} showColonAfterLabel={false}>
                <Item itemType="group" colCount={3}>
                    <Item dataField="invoiceCode" editorOptions={invoiceCodeEditorOption} caption="Invoice Code" editorType={dxTextBox} />
                    <Item dataField="invoiceStatus" isRequired={true} label={{ text: "Invoice Status" }} editorType="dxSelectBox" editorOptions={invoiceStatusEditorOption} />
                    {/* <Item dataField="invoiceStage" isRequired={true} label={{ text: "Invoice Stage" }} editorType={dxDropDownBox} editorOptions={invoiceStageEditorOption} component={statusSelectBox}/>           */}
                    <Item dataField="creditPeriod" label={{ text: "Credit Period (Months)" }} editorType={dxNumberBox} isRequired={true} editorOptions={creditPeriodEditorOption} />
                </Item>
                <Item itemType="group" colCount={3}>
                    <Item dataField="customerId" isRequired={true} label={{ text: "Customer" }} editorType={dxDropDownBox} colSpan={2} editorOptions={customerEditorOption} component={useGetCustomersList} validationGroup="invoiceValidation" />
                    <Item dataField="paymentMethod" editorType="dxSelectBox" editorOptions={paymentMethodEditorOptions} isRequired={true} />
                </Item>
                <Item itemType="group">
                    <Item dataField="description" label={{ text: "Description" }} editorType={dxTextArea} />
                </Item>

                    <Item itemType="group" cssClass="invoiceLinesItem" >
                        <DataGrid
                            id="InvoicesLinesGrid"
                            dataSource={invoiceLinesData}
                            //keyExpr="id"
                            repaintChangesOnly={true}
                            showBorders={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            //columnAutoWidth={true}
                            showColumnLines={true}
                            showRowLines={true}
                            rowAlternationEnabled={true}
                            ref={dataGridRef}
                            className="GridLines"
                            onSaved={onSaved}>

                            <Editing mode="cell"
                                useIcons={true}
                                allowDeleting={true}
                                allowUpdating={true}
                                allowAdding={true}
                                newRowPosition='last' />

                            <StateStoring enabled={true} type="localStorage" storageKey="InvoicesLineStorage" />
                            <ColumnChooser enabled={true} />
                            <ColumnFixing enabled={true} />
                            <Scrolling rowRenderingMode='virtual'></Scrolling>
                            <Column dataField="id" visible={false} showInColumnChooser={false} />
                            <Column dataField="invoiceId" visible={false} showInColumnChooser={false} />
                            <Column dataField="itemId" caption="Item" editCellComponent={getItemsList} minWidth={150} showEditorAlways={true} editorOptions={itemEditorOption} />
                            <Column dataField="description" caption="Description" />
                            {/* <Column dataField="creditPeriod"  setCellValue={setCreditPeriodCellValue}/> */}
                            <Column dataField="marketValue" dataType="number" caption="Market Val." format="'Rs. ',##0.###" />
                            <Column dataField="estimatedValue" dataType="number" caption="Est. Val." format="'Rs. ',##0.###" />
                            <Column dataField="itemValue" dataType="number" caption="Advance" format="'Rs. ',##0.###" />
                            <Column dataField="serviceCharge" caption="Service Charge" dataType="number" format="'Rs. ',##0.###" />
                            <Column dataField="weight" dataType="number" caption="Wgt (g)" width="60px" />
                            <Column dataField="netWeight" dataType="number" caption="Net Wgt (g)" width="85px" allowEditing={false} calculateCellValue={calculateNetWeight} />
                            <Column dataField="quantity" dataType="number" caption="Qty" width="40px" editorOptions={quantityEditorOptions}/>
                            <Column dataField="interestRate" dataType="number" caption="Interest Rate (p.a.%)" format="#0.##'%'" />
                            <Column dataField="interest" dataType="number" allowEditing={false} format="'Rs. ',##0.###" calculateCellValue={calculateInterest} />
                            <Column dataField="exclPrice" dataType="number" caption="Excl. Price" allowEditing={false} format="'Rs. ',##0.###" calculateCellValue={calculateExclPrice} />
                            <Column dataField="inclPrice" dataType="number" caption="Incl. Price" allowEditing={false} format="'Rs. ',##0.###" calculateCellValue={calculateInclPrice} />

                            <Scrolling rowRenderingMode='virtual'></Scrolling>
                            <Toolbar>
                                <DGItem location="before">
                                    <Button icon='revert' onClick={onStateResetClick} />
                                </DGItem>
                                <Item location="after">
                                    <Button icon='add' onClick={addNewRow} />
                                </Item>
                                <Item name="columnChooserButton" />
                            </Toolbar>
                            <Summary recalculateWhileEditing={true}>
                                <TotalItem
                                    column="invoiceId"
                                    summaryType="count" />
                                <TotalItem
                                    column="marketValue"
                                    summaryType="sum"
                                    displayFormat="Total: {0}" />
                                <TotalItem
                                    column="estimatedValue"
                                    summaryType="sum"
                                    displayFormat="Total: {0}" />
                                <TotalItem
                                    column="itemValue"
                                    summaryType="sum"
                                    displayFormat="Total: {0}" />
                                <TotalItem
                                    column="weight"
                                    summaryType="sum"
                                    displayFormat="Total Weight: {0}" />
                                <TotalItem
                                    column="netWeight"
                                    summaryType="sum"
                                    displayFormat="Total Net Weight: {0}" />
                                <TotalItem
                                    column="interest"
                                    summaryType="sum"
                                    displayFormat="Total Interest: {0}" />
                                <TotalItem
                                    column="exclPrice"
                                    summaryType="sum"
                                    displayFormat="Total Excl: {0}" />
                                <TotalItem
                                    column="inclPrice"
                                    summaryType="sum"
                                    displayFormat={"Total Incl: {0}"} />
                            </Summary>
                        </DataGrid>
                    </Item>
                    {/* <Item itemType="group" colSpan={3}> */}
                    <Item itemType="group" colSpan={3} cssClass="FooterText" >
                        <Label text="*Please enter the annual interest rate." />
                    </Item>
                    {/* </Item> */}
                    {/* <Item itemType="group" colCount={2} colSpan={2}>
                    <Item dataField="createdDate" editorOptions={recordUserDetails} />
                    <Item dataField="createdDate" editorOptions={recordUserDetails} />
                    <Item dataField="lastModifiedDate" editorOptions={recordUserDetails} />
                    <Item dataField="lastModifiedBy" editorOptions={recordUserDetails} />
                    </Item> */}

                </Form>
            </div>
        </React.Fragment>
    );
}

export default memo(InvoiceForm);