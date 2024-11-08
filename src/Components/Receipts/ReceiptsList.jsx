import React, { useState, memo } from 'react';
import axios from 'axios';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import DataGrid, {
    Column, Editing, Lookup, Scrolling, Pager, Paging, FilterRow, HeaderFilter, FilterPanel, FilterBuilderPopup, Sorting, ColumnChooser, ColumnFixing,
    StateStoring, Button as DGButton, Toolbar, Item, Summary, TotalItem
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';

import commonConstants from '../Common/CommonConstants';
import receiptConstants from './ReceiptConstants';
import Receipt from './Receipt';
import authentication from "react-azure-b2c";
// import ReceiptLines from './ReceiptLines';

const filterBuilder = commonConstants.getfilterBuilder();
const filterBuilderPopupPosition = commonConstants.getfilterBuilderPopupPosition();
const allowedPageSizes = commonConstants.getallowedPageSizes();

const receiptURL = receiptConstants.getReceiptURL(); //Base URL of the Receipt
const invoiceURL = receiptConstants.getInvoiceURL(); //Base URL of the Receipt
const receiptStatus = receiptConstants.getReceiptStatuses();
const receiptStage = receiptConstants.getReceiptStages();
const paymentMethods = receiptConstants.getPaymentMethods();

const displayMode = 'full';
const showPageSizeSelector = true;
const showInfo = true;
const showNavButtons = true;

const dataGrid = React.createRef();

let getCurrentReceiptData = {};

//Display the list of receipts
// function getReceipts(setResponseData,token) {
//     return (
//         axios({
//             "method": "GET",
//             "url": receiptURL,
//             "headers": {
//                 'Authorization': `Bearer ${token}`
//               }
//         })
//             .then((response) => {
//                 setResponseData(response.data)
//             })
//             .catch((error) => {
//                 console.log(error)
//             })
//     );
// }

//Display the list of receipts
function getInvoices(setinvoiceResponseData) {
    return (
        axios({
            "method": "GET",
            "url": invoiceURL + '/GetAll'       
        })
            .then((response) => {
                setinvoiceResponseData(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    );
}

//This function will be occured after confirm delete and then the relevant record's data will be deleted from the database
function onRowRemoved(e) {
    axios.delete(receiptURL + '/' + e.data.id)
        .then(response => {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    commonConstants.refreshPage();
}

function onStateResetClick() {
    dataGrid.current.instance.state(null);
}

function isPrintIconDisabled(e) {
    if(e.row.data.receiptStage == 'WaitingForApproval'){
        return true;
    }
    else{
        return false;
    }
}

function ReceiptsList() {
    const [_isNewRecord, setIsNewRecord] = useState(false);
    // let [responseData, setResponseData] = useState('');
    // let [invoiceResponseData, setinvoiceResponseData] = useState('');
    const token = authentication.getAccessToken().accessToken; //get token
    const responseData = createStore({
        key: 'id',
        loadUrl: receiptURL,
        onBeforeSend: (method, ajaxOptions) => {
         // ajaxOptions.xhrFields = { withCredentials: true };      
          ajaxOptions.headers = { Authorization: 'Bearer ' + token }
        },
      });

    // var inv;
    // for (var i = 0; i < invoiceResponseData.length; i++) {
    //     inv = invoiceResponseData[i].receipts.find(item => item.invoiceId === responseData[0].id).pa; 
    // }

    const [_isPopupVisible, setPopupVisibility] = useState(false);

    const _togglePopup = () => {
        setPopupVisibility(!_isPopupVisible);
        getCurrentReceiptData = null;
        dataGrid.current.instance.state(null);
    };

    return (
        <div className='section mg-20'>
            <div id='dgReceiptList'>
                <div class="col s12 m2">
                    <h4 class="z-depth-2 p-15 center">RECEIPTS</h4>
                </div>
                <DataGrid
                    id="ReceiptsGrid"
                    dataSource={responseData}
                    showBorders={true}
                    allowColumnReordering={true}
                    allowColumnResizing={true}
                    columnAutoWidth={true}
                    columnsAutoWidth="true"
                    filterBuilder={filterBuilder}
                    showColumnLines={true}
                    showRowLines={true}
                    hoverStateEnabled={true}
                    ref={dataGrid}
                    onRowRemoved={onRowRemoved}>

                    <Editing mode="popup" useIcons={true} />
                    <StateStoring enabled={true} type="localStorage" storageKey="ReceiptsListStorage" />
                    <FilterRow visible={true} />
                    <FilterPanel visible={true} />
                    <FilterBuilderPopup position={filterBuilderPopupPosition} />
                    <HeaderFilter visible={true} />
                    <Sorting mode="multiple" />
                    <ColumnChooser enabled={true} />
                    <ColumnFixing enabled={true} />

                    <Column dataField="id" visible={false} showInColumnChooser={false} />
                    {/* <Column dataField="invoiceId" visible={false} showInColumnChooser={false} /> */}
                    {/* <Column caption="Customer" alignment="center">
                        <Column dataField="customer.fname" caption="First Name"/>
                        <Column dataField="customer.lName" caption="Last Name"/>
                        <Column dataField="customer.nic" caption="NIC"/>
                    </Column> */}                    
                    <Column dataField="receiptCode" caption="Receipt Code" sortOrder="desc"/>
                    <Column dataField="invoiceCode" caption="Invoice Number"/>
                    <Column caption="Customer" alignment="center">
                        <Column dataField="customerCode" caption="Code"/>
                        <Column dataField="customerName" caption="Name"/>
                        <Column dataField="customerId" visible={false} showInColumnChooser={false}/>
                    </Column>
                    <Column dataField="description" caption="Description" />
                    <Column dataField="paymentDate" caption="Payment Date" width = "150px" dataType="date" format="dd/MM/yyyy"/>
                    <Column dataField="receiptStage" caption="Receipt Stage">
                        <Lookup dataSource={receiptStage} valueExpr="ID" displayExpr="Stage" />
                    </Column>
                    <Column dataField="payment" caption="Payment" format="'Rs. ',##0.###" />
                    {/* <Column dataField="discount" caption="Discount" format="'Rs. ',##0.###" />
                    <Column dataField="fine" caption="fine" format="'Rs. ',##0.###" /> */}
                    <Column dataField="receiptTotal" caption="Receipt Total" format="'Rs. ',##0.###" />
                    <Column dataField="interestRate" visible={false} showInColumnChooser={false}/>
                    <Column dataField="invoiceDate" visible={false} showInColumnChooser={false}/>
                    <Column dataField="invoiceTotal" visible={false} showInColumnChooser={false} format="'Rs. ',##0.###"/>
                    <Column dataField="cumulativeInterest" visible={false} showInColumnChooser={false} format="'Rs. ',##0.###"/>
                    
                    <Column dataField="createdUserId" visible={false} showInColumnChooser={false}/>
                    <Column dataField="createdUserName" visible={false} allowEditing={false} />
                    <Column dataField="modifiedUserID" visible={false} showInColumnChooser={false}/>
                    <Column dataField="modifiedUserName" caption="Modified User" visible={false} />
                    <Column dataField="approveUserID"  visible={false} showInColumnChooser={false}/>
                    <Column dataField="approveUserName" caption="Approved User" visible={false} />

                    {/* <MasterDetail enabled={true} component={ReceiptLines} />  ------- Receipt Lines ------ */}

                    <Column type="buttons" minWidth={75}>
                        <DGButton text="Edit" icon="edit" onClick={
                            e => {
                                getCurrentReceiptData = e.row.data;
                                setIsNewRecord(false);
                                setPopupVisibility(true);
                            }
                        } />
                        <DGButton text="Print" icon="print" onClick={
                            e => {
                                window.open("/Receipt/Print/" + e.row.data.receiptCode)
                            }
                        } disabled={isPrintIconDisabled}/>
                    </Column>

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
                        <Item location="before">
                            <Button icon='revert' onClick={onStateResetClick} />
                        </Item>
                        <Item location="after">
                            <Button icon='add'
                                onClick={
                                    () => {
                                        getCurrentReceiptData = null;
                                        setIsNewRecord(true);
                                        setPopupVisibility(true);
                                    }
                                } />
                        </Item>
                        <Item name="columnChooserButton" />
                    </Toolbar>
                    <Summary>
                        <TotalItem
                            column="invoiceId"
                            summaryType="count" />
                        <TotalItem
                            column="discount"
                            summaryType="sum"
                            displayFormat="Discount Total: {0}" 
                            valueFormat="'Rs. ',##0.###"/>
                        <TotalItem
                            column="fine"
                            summaryType="sum"
                            displayFormat="Fine Total: {0}" 
                            valueFormat="'Rs. ',##0.###"/>
                        <TotalItem
                            column="receiptTotal"
                            summaryType="sum"
                            displayFormat="Receipts Total: {0}" 
                            valueFormat="'Rs. ',##0.###"/>
                    </Summary>
                </DataGrid>
                {/* Pop up form to Add new receipt or Edit receipt */}
                <Receipt isPopupVisible={_isPopupVisible} togglePopup={_togglePopup} currentReceiptData={getCurrentReceiptData} isNewRecord={_isNewRecord} />
            </div>
        </div>
    );
}

export default ReceiptsList;