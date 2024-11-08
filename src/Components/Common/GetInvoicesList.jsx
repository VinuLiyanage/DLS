import React, { useState, useCallback, useEffect, memo } from 'react';
import axios from 'axios';
import receiptConstants from '../Receipts/ReceiptConstants';

import DataGrid, { Column, Scrolling, Paging, FilterRow, Selection, MasterDetail } from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';
import authentication from "react-azure-b2c";

const invoiceURL = receiptConstants.getInvoiceURL();

//Get list of invoices
function getInvoices(setResponseData, token, passedProps) {

  return (
    axios({
      "method": "GET",
      "url": invoiceURL + '/GetAll/',
      "headers": {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        const res = response.data;

        const selectedCustomersInvoices = (res).filter(function (res) {
          return res.customerId == passedProps.cusId;
        });

        if (passedProps.newRecord === true || passedProps.stage === "WaitingForApproval") {
          const approvedInvoices = (selectedCustomersInvoices).filter(function (res) {
            return res.invoiceStage == "Approved" && (res.receipts.length === 0 || passedProps.stage === "WaitingForApproval");
          });
          setResponseData(approvedInvoices);
        }
        else {
          const approvedNClaimedInvoices = (selectedCustomersInvoices).filter(function (res) {
            return res.invoiceStage == "Approved" || res.invoiceStage == "Claimed";
          });
          setResponseData(approvedNClaimedInvoices);
        }
      })
      .catch((error) => {
        console.log(error)
      })
  );
}

function GetInvoicesList(props) {

  let [invoice, setInvoice] = useState({
    invoiceValue: '',
    isinvoiceDDOpend: false
  });

  const token = authentication.getAccessToken().accessToken; //get token

  let [responseData, setResponseData] = useState('');

  const fetchData = useCallback(() => {
    getInvoices(setResponseData, token, props)
  }, [])
  useEffect(() => {
    fetchData()
  }, [fetchData])
   

  // let cusID = (props.data.editorOptions.value !== undefined ? props.data.editorOptions.value : invoice.invoiceValue[0].id);

  function OnValueChanged(e) {
    setInvoice({
      ...invoice,
      isinvoiceDDOpend: e.value,
      isinvoiceDDOpend: false,
    });
  }

  function dpOnValueChanged(e) {
    setInvoice({
      ...invoice,
      invoiceValue: e.selectedRowKeys,
      isinvoiceDDOpend: false,
    });
  }

  function invoiceOnSelectionChanged(e) {
    props.invoiceProps.editorOptions.value = e.selectedRowsData[0]['id'];
    props.invoiceProps.editorOptions.onFieldDataChanged(e.selectedRowsData[0]);
    setInvoice({
      ...invoice,
      //invoiceValue: e.selectedRowKeys,
      isinvoiceDDOpend: false,
    });
  }

  function invoiceDDDisplayExpr(c) {
    return c && `${c.invoiceNumber} - ${c.customer.fname} ${c.customer.lName}`;
  }

  function onOptionChanged(e) {
    if (e.name === 'opened') {
      setInvoice({
        ...invoice,
        isinvoiceDDOpend: e.value,
      });
    }
  }

  function invoiceDataGridRender() {
    return (
      <React.Fragment>
        <DataGrid
          dataSource={responseData}
          hoverStateEnabled={true} allowColumnResizing={true}
          onSelectionChanged={invoiceOnSelectionChanged}
          onValueChanged={dpOnValueChanged}>

          <Column dataField="invoiceNumber" caption="Invoice Number" defaultSortOrder="desc" />
          <Column dataField="description" caption="Description" />
          <Column dataField="invoiceType"  caption="Invoice Type" />
          <Column dataField="invoiceDate"  caption="Invoice Date" dataType="date" format="dd/MM/yyyy" />
          <Column dataField="invoiceTotal"  />
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
        value={props.invoiceProps.editorOptions.value}
        opened={invoice.isinvoiceDDOpend}
        valueExpr="id"
        deferRendering={false}
        displayExpr={invoiceDDDisplayExpr}
        placeholder="Select a value..."
        //showClearButton={true}
        dataSource={responseData}
        contentRender={invoiceDataGridRender}
        onOptionChanged={onOptionChanged}
      />
    </React.Fragment>
  );

}

export default memo(GetInvoicesList);