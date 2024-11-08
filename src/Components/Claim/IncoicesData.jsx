import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import DataGrid, {
    Column, Lookup, Scrolling, Pager, Paging, FilterRow, HeaderFilter, FilterPanel, FilterBuilderPopup, Sorting, ColumnChooser, ColumnFixing,
    Button as DGButton, Toolbar, Item, MasterDetail, Summary, TotalItem, Selection
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import { custom } from 'devextreme/ui/dialog';
import axios from 'axios';
import claimConstants from './ClaimConstants'
import commonConstants from '../Common/CommonConstants';
import invoiceConstants from '../Invoices/InvoiceConstants';
import Receipts from './ReceiptsLines';
import authentication from "react-azure-b2c";
import { useSelector } from "react-redux";
import { selectReceipts } from './Slice/ClaimSlice'

const claimURL = claimConstants.getPaymentClaimURL();
const invoiceStatus = invoiceConstants.getInvoiceStatuses();
const invoiceStage = invoiceConstants.getInvoiceStages();
const paymentMethods = invoiceConstants.getPaymentMethods();

const filterBuilder = commonConstants.getfilterBuilder();
const filterBuilderPopupPosition = commonConstants.getfilterBuilderPopupPosition();
const allowedPageSizes = commonConstants.getallowedPageSizes();

const displayMode = 'full';
const showPageSizeSelector = true;
const showInfo = true;
const showNavButtons = true;

const refClaimInvoicesGrid = React.createRef();
const receiptsRef = React.createRef();

function InvoicesData(props) {
    const _SelectedReceipts = useSelector(selectReceipts);
    const selectedReceipts = useRef([]);
    const _setToastConfig = props.setToastConfig;

    selectedReceipts.current.value = _SelectedReceipts;

    const token = authentication.getAccessToken().accessToken; //get token

    function customizedDialogBox(title, message, confirmText, cancelText, eValue) {
        try {
            let myDialog = custom({
                title: title,
                messageHtml: message,
                buttons: [{
                    text: confirmText,
                    onClick: (e) => {
                        return { confirmText: e.component.option("text") }
                    }
                },
                {
                    text: cancelText,
                    onClick: (e) => {
                        return { cancelText: e.component.option("text") }
                    }
                },
                ]
            });

            const invoicesDS = refClaimInvoicesGrid.current.instance.getSelectedRowsData();

            if (invoicesDS.length == 0) {
                throw new Error('Please select the relevant invoice to be claimed.');
            }

            if (selectedReceipts.current.value == 0) {
                throw new Error('Please select all the receipts of the selected invoice to claim.');
            }

            if(selectedReceipts.current.value.length !== invoicesDS[0].invoice.receipts.length){
                throw new Error('Please select all the receipts of the selected invoice to claim.');
            }

            myDialog.show().then((dialogResult) => {
                try {
                    if (dialogResult.confirmText === 'Yes') {
                        axios.put(claimURL, claimConstants.UpdateData(invoicesDS, selectedReceipts.current.value), {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                            .then(response => {
                                _setToastConfig(true, 'success', 'Invoice has been claimed');
                            })
                            .catch(function (error) {
                                _setToastConfig(true, 'error', 'Invoice has NOT been claimed. ERROR: ' + error.response.data);
                            })
                    }
                } catch (error) {
                    _setToastConfig(true, 'error', 'Invoice has NOT been claimed. \n ERROR: ' + error);
                }
                refClaimInvoicesGrid.current.instance.refresh();
            });
        } catch (error) {
            _setToastConfig(true, 'error', 'Invoice has NOT been claimed.' + error);
        }
    }

    function isClaimDisabled(e){
        if(e.row.data.invoice.invoiceStage === 'Claimed'){
            return true;
        }
        else{
            return false;
        }
    }

    function onSelectionChanged(e){
        // var a = receiptsRef.current.props;
        // var parentKey = e.currentSelectedRowKeys[0];  
        // var parentGrid = e.component;  
        // if (parentGrid.isRowSelected(parentKey)) {  
        //     receiptsRef.current.instance.component.selectAll();  
        // }  
    }

    return (
        <React.Fragment>
            <DataGrid
                id = "ClaimInvoicesGrid"
                dataSource = {props.dataSource}
                // keyExpr="id"
                showBorders = {true}
                allowColumnReordering = {true}
                allowColumnResizing = {true}
                columnAutoWidth = {true}
                columnsAutoWidth = {true}
                filterBuilder = {filterBuilder}
                showColumnLines = {true}
                showRowLines = {true}
                hoverStateEnabled = {true}
                ref = {refClaimInvoicesGrid} 
                onSelectionChanged={onSelectionChanged}>

                {/* <StateStoring enabled={true} type="localStorage" storageKey="ClaimInvoiceStorage" /> */}
                <FilterRow visible={true} />
                {/* <FilterPanel visible={true} /> */}
                <FilterBuilderPopup position={filterBuilderPopupPosition} />
                <HeaderFilter visible={true} />
                <Sorting mode="multiple" />
                <ColumnChooser enabled={true} />
                <ColumnFixing enabled={true} />

                <Selection mode="multiple" showCheckBoxesMode='always' selectAllMode='allPages'/>
                <Column dataField="id" visible={false} showInColumnChooser={false} />
                <Column dataField="invoice.invoiceNumber" caption="Invoice Number" />
                <Column dataField="invoice.description" caption="Description" visible={false} />
                <Column dataField="invoice.invoiceDate" caption="Invoice Date" dataType="date" />
                <Column dataField="invoice.invoiceStatus" caption="Invoice Status" visible={false}>
                    <Lookup dataSource={invoiceStatus} valueExpr="ID" displayExpr="Status" />
                </Column>
                <Column dataField="invoice.invoiceStage" caption="Invoice Stage">
                    <Lookup dataSource={invoiceStage} valueExpr="ID" displayExpr="Stage" />
                </Column>
                <Column dataField="invoice.creditPeriod" caption="Credit Period" />
                <Column dataField="invoice.paymentMethod" caption="Payment Method" visible={false} >
                    <Lookup dataSource={paymentMethods} valueExpr="ID" displayExpr="Method" />
                </Column>
                <Column dataField="invoice.totalInterest" caption="Total Interest" format="'Rs. ',##0.###" />
                <Column dataField="invoice.invoiceTotal" caption="Invoice Total" format="'Rs. ',##0.###" />
                <Column dataField="totalCredit" caption="Total Credit" format="'Rs. ',##0.###" cssClass='totalCredit'/>
                <Column dataField="totalPaid" caption="Total Paid" format="'Rs. ',##0.###" cssClass='totalPaid'/>
                <Column dataField="totalDue" caption="Total Due" format="'Rs. ',##0.###" cssClass='totalDue'/>
                {/* <Column type="buttons" minWidth={75}>
                    <DGButton text="Claim" disabled={isClaimDisabled} cssClass='btn btn-success' onClick={
                        e => {
                            customizedDialogBox('Confirm Claim', 'Are you sure you want to claim this invoice?', 'Yes', 'No', e.value);
                        }
                    } />
                </Column> */}
                <MasterDetail enabled={true} component={Receipts} ref={receiptsRef} />  {/* ------- Invoice Lines ------ */}

                <Scrolling rowRenderingMode='virtual'></Scrolling>
                <Paging defaultPageSize={10} />
                <Pager
                    visible={true}
                    allowedPageSizes={allowedPageSizes}
                    displayMode={displayMode}
                    showPageSizeSelector={showPageSizeSelector}
                    showInfo={showInfo}
                    showNavigationButtons={showNavButtons} />
                <Toolbar>
                    <Item name="columnChooserButton" />
                </Toolbar>
                <Summary>
                    <TotalItem
                        column="invoice.id"
                        summaryType="count" />
                    <TotalItem
                        column="invoice.totalInterest"
                        summaryType="sum"
                        displayFormat="Interest Total: {0}"
                        valueFormat="'Rs. ',##0.###" />
                    <TotalItem
                        column="invoice.invoiceTotal"
                        summaryType="sum"
                        displayFormat="Invoices Total: {0}"
                        valueFormat="'Rs. ',##0.###" />
                </Summary>
            </DataGrid>
        </React.Fragment>
    );
}

function onStateResetClick() {
    refClaimInvoicesGrid.current.instance.state(null);
}

export default memo(InvoicesData);