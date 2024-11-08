import React, { useState, memo } from 'react';
import axios from 'axios';
import NotificationPanel from '../Main/NotificationPanel';
import useGetNextCode from '../Common/useGetNextCode';
import useGetMasterData from '../MasterData/getMasterData';
import itemConstants from './ItemConstants';
import CommonConstants from '../Common/CommonConstants';
import { isEmptyObject } from 'jquery';

import { Form, Item, EmptyItem } from 'devextreme-react/form';
import { Popup } from 'devextreme-react/popup';
import { Toolbar as TB, Item as TBItem } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';

import dxTextArea from 'devextreme/ui/text_area';
import dxTextBox from 'devextreme/ui/text_box';
import authentication from "react-azure-b2c";
import dxSelectBox from 'devextreme/ui/select_box';

const formRef = React.createRef();
const itemURL = itemConstants.getItemURL();
const KaratList = itemConstants.getKaratList();

function LendingItem(props) {
  const token = authentication.getAccessToken().accessToken; //get token
  let currentItem = (!isEmptyObject(props.currentItemData) ? props.currentItemData : {});
  let _isNewRecord = props.isNewRecord;
  let _popUpToggle = props.togglePopup;
  
  const loadCategory = (isEmptyObject(currentItem) || currentItem.category === null || props.isNewRecord ? '' : currentItem.category);
  const Karats = (KaratList !== '' ? KaratList.map(val => val.karat) : KaratList);
  //const loadCategory = (isEmptyObject(currentItem) || currentItem.category === null || props.isNewRecord ? '' : currentItem.category);

  // const [toastConfig, setToastConfig] = useState({
  //   isVisible: false,
  //   type: 'info',
  //   message: 'data success'
  // });

  // function onHiding() {
  //   setToastConfig({
  //     ...toastConfig,
  //     isVisible: false,
  //   });
  // }

  // function _setToastConfig(_isVisible, _type, _message) {
  //   setToastConfig({
  //     ...toastConfig,
  //     isVisible: _isVisible,
  //     type: _type,
  //     message: _message,
  //   });
  // }
  
  //-------- next Customer Code--------
  const nextCode = useGetNextCode('Item', token);

  const categoryList = useGetMasterData('ItemCategories', token);
  const categories = (categoryList !== '' ? categoryList.map(val => val.category) : categoryList);

  let loadNextCode = (isEmptyObject(currentItem) || currentItem.itemCode === null || props.isNewRecord ? nextCode: currentItem.itemCode);

  const itemCodeEditorOption = {
    readOnly: true,
    value: loadNextCode,
  }

  const CategoryEditorOption = {
    value: loadCategory,
    items: categories, 
    onFieldDataChanged: function (e) {
        formRef.current.props.formData.category = e;
        currentItem.category = e;
    }
  }

  const karatEditorOptions = {
    items: Karats,
    onFieldDataChanged: function (e) {
      formRef.current.props.formData.karat = e;
      currentItem.karat = e;
    }
  }

  function handleSubmit(e) {
    const { isValid } = e.validationGroup.validate();
    if (isValid) {
      if (_isNewRecord) {
        insertItem();
      }
      else {
        updateItem();
      }
      _popUpToggle();
    }
  }

  //New record's data will be inserted to the database
  function insertItem() {
    axios.post(itemURL, itemConstants.insertAndUpdateData(currentItem, 'Insert'),{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
       // _setToastConfig(true, 'success', 'Data saved Successfully');
      })
      .catch(function (error) {
        //_setToastConfig(true, 'error', 'Data NOT saved Successfully. ERROR: ' + error.response.data);
      })
      CommonConstants.refreshPage();
  }

  //All the record's data will be updated in the database
  function updateItem() {
    axios.put(itemURL, itemConstants.insertAndUpdateData(currentItem, 'Update'),{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
       // _setToastConfig(true, 'success', 'Data updated Successfully');
      })
      .catch(function (error) {
       // _setToastConfig(true, 'error', 'Data NOT updated Successfully. ERROR: ' + error.response.data);
      })
      CommonConstants.refreshPage();
  }

  const ItemformRender = () => {
    return (
      <>
        <TB id='TB'>
          <TBItem location="before">
            <Button icon='close' text='Cancel' onClick={() => { _popUpToggle(); }} type='danger' />
          </TBItem>
          <TBItem location="before">
            <Button icon='save' text='Save' onClick={e => { handleSubmit(e); }} type='success' validationGroup="itemValidation" />
          </TBItem>
        </TB>
        <br />
        <div className='divider'></div>
        <br />
        <Form formData={currentItem} ref={formRef} validationGroup="itemValidation" >
          <Item itemType="group" colSpan={3} colCount={3}>
            <Item dataField="itemCode" editorOptions={itemCodeEditorOption} caption="Item Code" editorType={dxTextBox} />
            <Item dataField="itemName" isRequired={true} colSpan={2} />         
          </Item>
          <Item itemType="group" colSpan={3} colCount={3}>
            <Item dataField="category" editorOptions={CategoryEditorOption} caption="Category" editorType={dxSelectBox} /> 
            <Item dataField="karat" caption="Karat" editorOptions={karatEditorOptions} editorType={dxSelectBox}/> 
            <Item dataField="goldPrecentage" label={{text: "Gold Percentage (%)"}} /> 
          </Item>
          <Item itemType="group" colSpan={1} colCount={1}>
            <Item dataField="additionalNote" editorType="dxTextArea" />
          </Item>
          {/* visible={currentItem.category === null || props.isNewRecord || currentItem.category === 'Vehicle' ? false : true} */}
          {/* <Item itemType="group" colCount={2} colSpan={2}>
          <Item dataField="createdDate" editorOptions={recordUserDetails} />
          <Item dataField="createdDate" editorOptions={recordUserDetails} />
          <Item dataField="lastModifiedDate" editorOptions={recordUserDetails} />
          <Item dataField="lastModifiedBy" editorOptions={recordUserDetails} />
      </Item> */}
        </Form>
      </>
    );
  }

  return (
    <>
      <Popup
        width={1000}
        height={350}
        visible={props.isPopupVisible}
        onHiding={props.togglePopup}
        position="center"
        title="Item Info"
        contentRender={ItemformRender}/>
      {/* <NotificationPanel isVisible={toastConfig.isVisible} message={toastConfig.message} type={toastConfig.type} onHiding={onHiding} /> */}
    </>
  );
}


export default memo(LendingItem);