import React, {useState, useCallback, useEffect} from 'react';
import axios from 'axios';
import { createStore } from 'devextreme-aspnet-data-nojquery';

import commonConstants from '../Common/CommonConstants';
import itemConstants from './ItemConstants';
import LendingItem from './LendingItem';

import DataGrid, { Column, Editing, Scrolling, Lookup, Pager, Paging, FilterRow, HeaderFilter, FilterPanel, FilterBuilderPopup, Sorting, ColumnChooser, ColumnFixing, StateStoring, Button as DGButton, Toolbar, Item, Summary, TotalItem } 
  from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import authentication from "react-azure-b2c";

const filterBuilder = commonConstants.getfilterBuilder();
const filterBuilderPopupPosition = commonConstants.getfilterBuilderPopupPosition();
const allowedPageSizes = commonConstants.getallowedPageSizes();

const itemURL = itemConstants.getItemURL(); //Base URL of the item

const displayMode = 'full'; 
const showPageSizeSelector = true;
const showInfo = true;
const showNavButtons = true;

const dataGrid = React.createRef();

let getCurrentItemData = {};
const KaratList = itemConstants.getKaratList();

//Display the list of items
// function getitems(setResponseData,token){
//   return(
//     axios({
//       "method": "GET",
//       "url": itemURL+'/GetAllItems/',
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
function onRowRemoved(e){
    axios.delete(itemURL+'/'+e.data.id)
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

function ItemsList(){
  const [_isNewRecord, setIsNewRecord] = useState(false);
  //let [responseData, setResponseData] = useState('');
  const token = authentication.getAccessToken().accessToken; //get token
  const responseData = createStore({
    key: 'id',
    loadUrl: itemURL + '/GetAllItems/',
    onBeforeSend: (method, ajaxOptions) => {
     // ajaxOptions.xhrFields = { withCredentials: true };      
      ajaxOptions.headers = { Authorization: 'Bearer ' + token }
    },
  });

  // const fetchData = useCallback(() => {
    //   getitems(setResponseData,token)
    // }, [])
    // useEffect(() => {
    //   fetchData()
    // }, [fetchData])

    const [_isPopupVisible, setPopupVisibility] = useState(false);

    const _togglePopup = () => {
      setPopupVisibility(!_isPopupVisible);
      getCurrentItemData = null;
      dataGrid.current.instance.refresh();
    };

    return (
      <div className='section mg-20'>
        <div class="col s12 m2">
          <h4 class="z-depth-2 p-15 center">ITEMS</h4>
        </div>
        <DataGrid
          id = "ItemsGrid"
          dataSource = {responseData}
          //keyExpr = "id"
          showBorders = {true}
          allowColumnReordering = {true}
          allowColumnResizing = {true}
          columnAutoWidth = {true}
          columnsAutoWidth = "true"
          filterBuilder = {filterBuilder}
          showColumnLines = {true}
          showRowLines = {true}
          rowAlternationEnabled = {true}
          ref = {dataGrid}
          onRowRemoved = {onRowRemoved}>
          
          <Editing mode="popup" useIcons={true}/>
          <StateStoring enabled={true} type="localStorage" storageKey="LendingItemsListStorage" />
          <FilterRow visible={true} />
          <FilterPanel visible={true} />
          <FilterBuilderPopup position={filterBuilderPopupPosition} />
          <HeaderFilter visible={true} />
          <Sorting mode="multiple" />
          <ColumnChooser enabled={true} />
          <ColumnFixing enabled={true} />

          <Column dataField="id" caption="Id" visible={false} showInColumnChooser={false} />
          <Column dataField="itemCode" caption="Item Code" />  
          <Column dataField="itemName" caption="Item Name" />
          <Column dataField="category" caption="Category" />        
          <Column dataField="karat" caption="Karat" >    
              <Lookup dataSource={KaratList} valueExpr="id" displayExpr="karat" />
          </Column>    
          <Column dataField="goldPrecentage" caption="Gold Percentage (%)" format= "#0.##'%'"/>       
          <Column dataField="additionalNote" caption="Additional Note"/>
          <Column dataField="createdDate" dataType="date" caption="Created Date"  />
          <Column dataField="createdUserFname" caption="Created User"/>
          <Column dataField="lastModifiedDate" dataType="date" caption="Modified Date"  />
          <Column dataField="modifiedUserFname" caption="Updated User" />
          <Column type="buttons" minWidth={75}>
            <DGButton text="Edit" icon="edit" onClick = {
              e => { 
                getCurrentItemData = e.row.data; 
                setIsNewRecord(false);
                setPopupVisibility(true);             
              }
            } />  
            <DGButton text="delete" icon="trash"/>
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
              <Button icon='revert' onClick={onStateResetClick}/>
            </Item>
            <Item location="after">
              <Button icon='add' 
                onClick={
                  () => { 
                    getCurrentItemData = null;  
                    setIsNewRecord(true);                
                    setPopupVisibility(true);                         
                  }
                }/>
            </Item>
            <Item name="columnChooserButton"/>
        </Toolbar>
        <Summary>
          <TotalItem
            column="itemName"
            summaryType="count" />
        </Summary>
        </DataGrid>
        {/* Pop up form to Add new item or Edit item */}
        <LendingItem isPopupVisible={_isPopupVisible} togglePopup = {_togglePopup} currentItemData = {getCurrentItemData} isNewRecord = {_isNewRecord}/>
      </div>
    );
  }

export default ItemsList;