import React, { useState, useCallback, useEffect, memo } from 'react';
import axios from 'axios';
import invoiceConstants from '../Invoices/InvoiceConstants';

import DataGrid, { Column, Scrolling, Paging, FilterRow, Selection } from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';
import authentication from "react-azure-b2c";

const customerURL = invoiceConstants.getCustomerURL();

function getCustomers(setResponseData, token) {
  return (
    axios({
      "method": "GET",
      "url": customerURL + '/GetAllCustomers/',
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

function useGetCustomersList(props) {

  const token = authentication.getAccessToken().accessToken; //get token

  let [customer, setCustomer] = useState({
    // customerValue: [0],
    iscustomerDDOpend: false
  });

  let [responseData, setResponseData] = useState('');
  const fetchData = useCallback(() => {
    getCustomers(setResponseData, token)
  }, [])
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // let cusID = (props.data.editorOptions.value !== undefined ? props.data.editorOptions.value : customer.customerValue[0].id);

  //Get list of customers


  function OnValueChanged(e) {
    setCustomer({
      ...customer,
      iscustomerDDOpend: e.value,
      //iscustomerDDOpend: false,
    });
  }

  function dpOnValueChanged(e) {
    setCustomer({
      ...customer,
      //customerValue: e.selectedRowKeys,
      iscustomerDDOpend: false,
    });
  }

  function customerOnSelectionChanged(e) {
    props.data.editorOptions.value = e.selectedRowsData[0]['id'];
    props.data.editorOptions.onFieldDataChanged(e.selectedRowsData[0]['id']);
    setCustomer({
      ...customer,
      //customerValue: e.selectedRowKeys,
      iscustomerDDOpend: false,
    });
  }

  function customerDDDisplayExpr(c) {
    return c && `${c.fname} ${c.lName}`;
  }

  function onOptionChanged(e) {
    if (e.name === 'opened') {
      setCustomer({
        ...customer,
        iscustomerDDOpend: e.value,
      });
    }
  }

  function customerDataGridRender() {
    return (
      <React.Fragment>
        <DataGrid
          dataSource={responseData}
          hoverStateEnabled={true} allowColumnResizing={true}
          onSelectionChanged={customerOnSelectionChanged}
          onValueChanged={dpOnValueChanged}>

          <Column dataField="fname" caption="First Name" />
          <Column dataField="lName" caption="Last Name" />
          <Column dataField="contact1" caption="Contact 1" />
          <Column dataField="nic" caption="NIC" />
          <Selection mode="single" />
          <Scrolling mode="virtual" />
          <Paging enabled={true} pageSize={10} />
          <FilterRow visible={true} />
        </DataGrid>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <DropDownBox
        value={props.data.editorOptions.value}
        opened={customer.iscustomerDDOpend}
        valueExpr="id"
        deferRendering={false}
        displayExpr={customerDDDisplayExpr}
        placeholder="Select a value..."
        //showClearButton={true}
        dataSource={responseData}
        contentRender={customerDataGridRender}
        onOptionChanged={onOptionChanged}
      />
    </React.Fragment>
  );
}

export default useGetCustomersList;