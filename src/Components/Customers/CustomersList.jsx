import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { createStore } from 'devextreme-aspnet-data-nojquery';

import commonConstants from '../Common/CommonConstants';
import custConstants from './CustomerConstants';
import '../../Assests/css/CustomCss/Customer.css';
import Customer from './Customer';
import Claim from '../Claim/Claim';

import DataGrid, { Column, Editing, Lookup, Scrolling, Pager, Paging, FilterRow, HeaderFilter, FilterPanel, FilterBuilderPopup, Sorting, ColumnChooser, ColumnFixing, StateStoring, Button as DGButton, Toolbar, Item, Summary, TotalItem }
  from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import { Link } from "react-router-dom";
import authentication from "react-azure-b2c";

const filterBuilder = commonConstants.getfilterBuilder();
const filterBuilderPopupPosition = commonConstants.getfilterBuilderPopupPosition();
const allowedPageSizes = commonConstants.getallowedPageSizes();

const customerURL = custConstants.getCustomerURL(); //Base URL of the Customer
const customerStatus = custConstants.getCustomerStatuses();

const displayMode = 'full';
const showPageSizeSelector = true;
const showInfo = true;
const showNavButtons = true;

const dataGrid = React.createRef();

let getCurrentCustomerData = {};

//Display the list of customers
// function getCustomers(setResponseData,token){
//   return(
//     axios({
//       "method": "GET",
//       "url": customerURL+'/GetAllCustomers/',
//       "headers": {
//         'Authorization': `Bearer ${token}`
//       }
//     })
//     .then((response) => {
//       setResponseData(response.data)
//     })
//     .catch((error) => {
//       console.log(error)
//     })
//   );
// }

//This function will be occured after confirm delete and then the relevant record's data will be deleted from the database
function onRowRemoved(e) {
  axios.delete(customerURL + '/' + e.data.id)
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

function CustomersList() {
  const [_isNewRecord, setIsNewRecord] = useState(false);
  //let [responseData, setResponseData] = useState('');
  const token = authentication.getAccessToken().accessToken; //get token
  //var paramCustomerCode = useRef('');

  const responseData = createStore({
    key: 'id',
    loadUrl: customerURL + '/GetAllCustomers/',
    onBeforeSend: (method, ajaxOptions) => {
      // ajaxOptions.xhrFields = { withCredentials: true };      
      ajaxOptions.headers = { Authorization: 'Bearer ' + token }
    },
  });
  // const fetchData = useCallback(() => {
  //     getCustomers(setResponseData,token)
  //   }, [])
  //   useEffect(() => {
  //     fetchData()
  //   }, [fetchData])

  const [_isPopupVisible, setPopupVisibility] = useState(false);

  const _togglePopup = () => {
    setPopupVisibility(!_isPopupVisible);
    getCurrentCustomerData = null;
    dataGrid.current.instance.state(null);
  };

  return (
    <div className='section mg-20'>
      <div class="col s12 m2">
        <h4 class="z-depth-2 p-15 center">CUSTOMERS</h4>
      </div>
      <DataGrid
        id="CustomersGrid"
        dataSource={responseData}
        // keyExpr = "id"
        showBorders={true}
        allowColumnReordering={true}
        allowColumnResizing={true}
        columnAutoWidth={true}
        columnsAutoWidth="true"
        filterBuilder={filterBuilder}
        showColumnLines={true}
        showRowLines={true}
        rowAlternationEnabled={true}
        ref={dataGrid}
        onRowRemoved={onRowRemoved}>

        <Editing mode="popup" useIcons={true} />
        <StateStoring enabled={true} type="localStorage" storageKey="CustomersListStorage" />
        <FilterRow visible={true} />
        <FilterPanel visible={true} />
        <FilterBuilderPopup position={filterBuilderPopupPosition} />
        <HeaderFilter visible={true} />
        <Sorting mode="multiple" />
        <ColumnChooser enabled={true} />
        <ColumnFixing enabled={true} />

        <Column dataField="customerCode" caption="Customer Code" defaultSortOrder="desc" />
        <Column dataField="fname" caption="First Name" />
        <Column dataField="lName" caption="Last Name" />
        <Column dataField="nic" caption="NIC" />
        <Column dataField="customerStatus" caption="Customer Status">
          <Lookup dataSource={customerStatus} valueExpr="ID" displayExpr="Status" />
        </Column>
        <Column dataField="contact1" caption="Primary Contact" />
        <Column dataField="contact2" caption="Secondary Contact" />
        <Column dataField="email" dataType="email" caption="Email" />
        <Column dataField="addressLine1" caption="Address Line 1" visible={false} />
        <Column dataField="addressLine2" caption="Address Line 2" visible={false} />
        <Column dataField="addressLine3" caption="Address Line 3" />
        <Column dataField="additionalNote" caption="Additional Note" visible={false} />
        <Column dataField="updatedUserId" caption="updated User" visible={false} showInColumnChooser={false} />
        <Column dataField="user.id" caption="created user Id" visible={false} showInColumnChooser={false} />
        <Column dataField="user.firstName" caption="Created User" />
        <Column dataField="updatedUserName" caption="Updated User" />
        <Column dataField="nicfPath" visible={false} showInColumnChooser={false} />
        <Column dataField="nicbPath" visible={false} showInColumnChooser={false} />
        <Column type="buttons" minWidth={75}>
          <DGButton text="Edit" icon="edit" onClick={
            e => {
              getCurrentCustomerData = e.row.data;
              setIsNewRecord(false);
              setPopupVisibility(true);
            }
          } />
          <DGButton text="Claim" icon="chevrondoubleright" onClick={
            e => {
              window.open("/Claim/?code=" + e.row.data.customerCode)
                // <Link to={{
                //   pathname: "/Claim/" + e.row.data.customerCode,
                //   id: { id: this },
                // }} target={'_blank'}>Claim</Link>
              //)
            }
          }>
          
          </DGButton>
          {/* <DGButton text="delete" icon="trash"/> */}
          {/* <DGButton text="View More" icon="mediumiconslayout" onclick={viewMoreOnClick}/> */}
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
                  getCurrentCustomerData = null;
                  setIsNewRecord(true);
                  setPopupVisibility(true);
                }
              } />
          </Item>
          <Item name="columnChooserButton" />
        </Toolbar>
        <Summary>
          <TotalItem
            column="customerCode"
            summaryType="count" />
        </Summary>
      </DataGrid>
      {/* Pop up form to Add new customer or Edit customer */}
      <Customer isPopupVisible={_isPopupVisible} togglePopup={_togglePopup} currentCustomerData={getCurrentCustomerData} isNewRecord={_isNewRecord} />
    </div>
  );
}

export default CustomersList;