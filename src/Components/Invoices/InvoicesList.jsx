import React, { useState, memo } from 'react';
import axios from 'axios';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import DataGrid, {
    Column, MasterDetail, Editing, Lookup, Scrolling, Pager, Paging, FilterRow, HeaderFilter, FilterPanel, FilterBuilderPopup, Sorting, ColumnChooser, ColumnFixing,
    StateStoring, Button as DGButton, Toolbar, Item, Summary, TotalItem
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';

import commonConstants from '../Common/CommonConstants';
import invoiceConstants from './InvoiceConstants';
import Invoice from './Invoice';
import InvoiceLines from './InvoiceLines';
import authentication from "react-azure-b2c";

const filterBuilder = commonConstants.getfilterBuilder();
const filterBuilderPopupPosition = commonConstants.getfilterBuilderPopupPosition();
const allowedPageSizes = commonConstants.getallowedPageSizes();

const invoiceURL = invoiceConstants.getInvoiceURL(); //Base URL of the Invoice
const invoiceStatus = invoiceConstants.getInvoiceStatuses();
const invoiceStage = invoiceConstants.getInvoiceStages();
const paymentMethods = invoiceConstants.getPaymentMethods();

const displayMode = 'full';
const showPageSizeSelector = true;
const showInfo = true;
const showNavButtons = true;

const dataGrid = React.createRef();

let getCurrentInvoiceData = {};

//Display the list of invoices
// function getInvoices(setResponseData,token) {
//     return (
//         axios({
//             "method": "GET",
//             "url": invoiceURL + '/GetAll',
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

//This function will be occured after confirm delete and then the relevant record's data will be deleted from the database
function onRowRemoved(e) {
    axios.delete(invoiceURL + '/' + e.data.id)
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
    if(e.row.data.invoiceStage == 'WaitingForApproval'){
        return true;
    }
    else{
        return false;
    }
}

function InvoicesList() {
    const [_isNewRecord, setIsNewRecord] = useState(false);
    // let [responseData, setResponseData] = useState('');
    const token = authentication.getAccessToken().accessToken; //get token
    const responseData = createStore({
        key: 'id',
        loadUrl: invoiceURL + '/GetAll',
        onBeforeSend: (method, ajaxOptions) => {
            // ajaxOptions.xhrFields = { withCredentials: true };      
            ajaxOptions.headers = { Authorization: 'Bearer ' + token }
        },
    });
    // const fetchData = useCallback(() => {
    //     getInvoices(setResponseData, token)
    //   }, [])
    //   useEffect(() => {
    //     fetchData()
    //   }, [fetchData])

    const [_isPopupVisible, setPopupVisibility] = useState(false);

    const _togglePopup = () => {
        setPopupVisibility(!_isPopupVisible);
        getCurrentInvoiceData = null;
        dataGrid.current.instance.state(null);
    };

    return (
        <div className='section mg-20'>
            <div id='dgInvoiceList'>
                <div class="col s12 m2">
                    <h4 class="z-depth-2 p-15 center">INVOICES</h4>
                </div>
                <DataGrid
                    id="InvoicesGrid"
                    dataSource={responseData}
                    // keyExpr="id"
                    showBorders={true}
                    allowColumnReordering={true}
                    allowColumnResizing={true}
                    columnAutoWidth={true}
                    filterBuilder={filterBuilder}
                    showColumnLines={true}
                    showRowLines={true}
                    hoverStateEnabled={true}
                    ref={dataGrid}
                    onRowRemoved={onRowRemoved}>

                    <Editing mode="popup" useIcons={true} />
                    <StateStoring enabled={true} type="localStorage" storageKey="InvoicesListStorage" />
                    <FilterRow visible={true} />
                    <FilterPanel visible={true} />
                    <FilterBuilderPopup position={filterBuilderPopupPosition} />
                    <HeaderFilter visible={true} />
                    <Sorting mode="multiple" />
                    <ColumnChooser enabled={true} />
                    <ColumnFixing enabled={true} />

                    <Column dataField="id" visible={false} showInColumnChooser={false}/>
                    <Column dataField="customerId" visible={false} showInColumnChooser={false} />
                    <Column dataField="invoiceNumber" caption="Invoice Number" defaultSortOrder="desc" width="100px"/>
                    <Column dataField="invoiceType" caption="Invoice Type"/>
                    <Column caption="Customer" alignment="center">
                        <Column dataField="customer.customerCode" caption="Customer Code"/>
                        <Column dataField="customer.fname" caption="First Name"/>
                        <Column dataField="customer.lName" caption="Last Name"/>
                        <Column dataField="customer.nic" caption="NIC" visible={false}/>
                    </Column>
                    <Column dataField="description" caption="Description" />
                    <Column dataField="invoiceDate" dataType="date" format="dd/MM/yyyy"/>
                    <Column dataField="invoiceStatus" caption="Invoice Status">
                        <Lookup dataSource={invoiceStatus} valueExpr="ID" displayExpr="Status" />
                    </Column>
                    <Column dataField="invoiceStage" caption="Invoice Stage">
                        <Lookup dataSource={invoiceStage} valueExpr="ID" displayExpr="Stage" />
                    </Column>
                    <Column dataField="creditPeriod" caption="Credit Period (Months)" width="100px" format="00 Months"/>
                    <Column dataField="paymentMethod" caption="Payment Method" width="100px">
                        <Lookup dataSource={paymentMethods} valueExpr="ID" displayExpr="Method" />
                    </Column>                   
                    <Column dataField="creditPeriodDays" caption="Credit Period Days"/>
                    <Column dataField="totalWeight" caption="Total Weight (g)" />
                    <Column dataField="totalNetWeight" caption="Total Net Weight (g)" />
                    <Column dataField="totalInterest" caption="Total Interest" format="'Rs. ',##0.###" width="160px"/>
                    <Column dataField="invoiceTotal" caption="Invoice Total" format="'Rs. ',##0.###"/>

                    <Column dataField="user.firstName" caption="Created User" visible={false} />
                    <Column dataField="modifiedUserName" visible={false} caption="Modified User" />
                    <Column dataField="approvedUserName" caption="Approved User" visible={false} />

                    <Column dataField="estimatedValue" caption="Total Estimated Value" format="'Rs. ',##0.###" />
                    <Column dataField="marketValue" caption="Total Market Value" format="'Rs. ',##0.###" />
                    <Column dataField="advance" caption="Total Advance" format="'Rs. ',##0.###" />

                    <MasterDetail enabled={true} component={InvoiceLines} />  {/* ------- Invoice Lines ------ */}

                    <Column type="buttons" minWidth={75}>
                        <DGButton text="Edit" icon="edit" onClick={
                            e => {
                                getCurrentInvoiceData = e.row.data;
                                setIsNewRecord(false);
                                setPopupVisibility(true);
                            }
                        } />
                        <DGButton text="Print" icon="print" onClick={
                            e => {
                                window.open("/Invoice/Print/" + e.row.data.id)
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
                                        getCurrentInvoiceData = null;
                                        setIsNewRecord(true);
                                        setPopupVisibility(true);
                                    }
                                } />
                        </Item>
                        <Item name="columnChooserButton" />
                    </Toolbar>
                    <Summary>
                        <TotalItem
                            column="customerId"
                            summaryType="count" />
                        <TotalItem
                            column="totalInterest"
                            summaryType="sum"
                            displayFormat="Total: {0}" 
                            valueFormat="'Rs. ',##0.###"/>
                        <TotalItem
                            column="invoiceTotal"
                            summaryType="sum"
                            displayFormat="Total: {0}" 
                            valueFormat="'Rs. ',##0.###"/>
                    </Summary>
                </DataGrid>
                {/* Pop up form to Add new invoice or Edit invoice */}
                <Invoice isPopupVisible={_isPopupVisible} togglePopup={_togglePopup} currentInvoiceData={getCurrentInvoiceData} isNewRecord={_isNewRecord} />
            </div>
        </div>
    );
}

export default memo(InvoicesList);