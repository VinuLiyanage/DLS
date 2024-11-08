import React, { useState, useCallback, useEffect, memo } from 'react';
import axios from 'axios';
import invoiceConstants from '../Invoices/InvoiceConstants';
import '../../Assests/css/CustomCss/Invoice.css';

import DataGrid, { Column, Scrolling, Paging, FilterRow, Selection } from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';
import { isEmptyObject } from 'jquery';
import authentication from "react-azure-b2c";

const itemURL = invoiceConstants.getItemURL();

function GetItemsList(props) {

  const token = authentication.getAccessToken().accessToken; //get token

  let [item, setItem] = useState({
    //itemValue: [0],
    isitemDDOpend: false
  });

  let [responseData, setResponseData] = useState('');
  const fetchData = useCallback(() => {
      getItems(setResponseData)
    }, [])
    useEffect(() => {
      fetchData()
    }, [fetchData])

  //let itemID = (props.data !== undefined || props.data !== null ? props.data.value : item.itemValue[0].id);

  //Get list of items
  const getItems = useCallback((setResponseData) => {
    return(
      axios({
        "method": "GET",
        "url": itemURL+'/GetAllItems/',
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
  }, []);

  function OnValueChanged(e) {
    setItem({
      ...item,
      isitemDDOpend: e.value,
      isitemDDOpend: false,
    });
  }

  function dpOnValueChanged(e){
    setItem({
      ...item,
      //itemValue: e.selectedRowKeys,
      isitemDDOpend: false,
    });
  }

  function itemOnSelectionChanged(e){
    props.data.value = e.selectedRowsData[0]['id'];
    if(props.data.data.item !== undefined){
      props.data.data.item.goldPrecentage = e.selectedRowsData[0]['goldPrecentage'];
    }
    
    if(!isEmptyObject(props.data.data)){
      props.data.data.itemId = e.selectedRowsData[0]['id'];
      if(props.data.data.item !==  undefined){
        props.data.data.item.id = e.selectedRowsData[0]['id'];
      }
    }
    if(props.data.value !== undefined && props.data.setValue !== undefined){
      props.data.setValue(props.data.value);
    }

    setItem({
      ...item,
      //itemValue: e.selectedRowKeys[0].id,
      isitemDDOpend: false,
    }); 
  }

  function onOptionChanged(e){
    if (e.name === 'opened') {
      setItem({
        ...item,
        isitemDDOpend: e.value,
      });
    }
  }

  function customerDDDisplayExpr(c) {
    return c && `${c.itemName}` ;
  }

  function itemDataGridRender(){
    return (
      <DataGrid
        dataSource={responseData}
        hoverStateEnabled={true} allowColumnResizing={true} 
        onSelectionChanged={itemOnSelectionChanged}
        onValueChanged={dpOnValueChanged}>

        <Column dataField="id" visible={false} showInColumnChooser={false}/> 
        <Column dataField="itemCode" caption="Item Code" />
        <Column dataField="itemName" caption="Item Name" />
        <Column dataField="category" showInColumnChooser={false}/>
        <Column dataField="karat" caption="Karat"/>
        <Column dataField="goldPrecentage" visible={false} showInColumnChooser={false}/>
        
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <Paging enabled={true} pageSize={10} />
        <FilterRow visible={true} />
      </DataGrid>
    );
  }

    return(
      <>
      <DropDownBox
        value={props.data.value}
        opened={item.isitemDDOpend}
        valueExpr="id"
        displayExpr={customerDDDisplayExpr}
        deferRendering={false}
        placeholder="Select a value..."
        dataSource={responseData}
        contentRender={itemDataGridRender}
        onOptionChanged={onOptionChanged}
        />
        </>
    );
}

export default memo(GetItemsList);