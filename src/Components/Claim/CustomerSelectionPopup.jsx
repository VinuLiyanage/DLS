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

function CustomerSelectionPopup(props) {

  const token = authentication.getAccessToken().accessToken; //get token

  let [customer, setCustomer] = useState({
    customerValue: props.cCode,
    iscustomerDDOpend: false
  });

  let [responseData, setResponseData] = useState('');
  const fetchData = useCallback(() => {
    getCustomers(setResponseData, token)
  }, [])
  useEffect(() => {
    fetchData()
  }, [fetchData])

  function dpOnValueChanged(e) {
    setCustomer({
      ...customer,
      iscustomerDDOpend: false,
    });
  }

  function customerOnSelectionChanged(e) {
    // props.data.editorOptions.value = e.selectedRowsData[0]['id'];
    // props.data.editorOptions.onFieldDataChanged(e.selectedRowsData[0]['id']);
    setCustomer({
      ...customer,
      customerValue: e.selectedRowKeys[0].customerCode,
      iscustomerDDOpend: false,
    });

    props.Payments(props.setRD, token, e.selectedRowKeys[0].customerCode);
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
        value={customer.customerValue}
        opened={customer.iscustomerDDOpend}
        valueExpr="customerCode"
        deferRendering={false}
        displayExpr={customerDDDisplayExpr}
        placeholder="Select a value..."
        dataSource={responseData}
        contentRender={customerDataGridRender}
        onOptionChanged={onOptionChanged}
      />
    </React.Fragment>
  );
}

export default CustomerSelectionPopup;