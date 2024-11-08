import React, { useState, useCallback, useEffect, memo } from 'react';
import axios from 'axios';

import { isEmptyObject } from 'jquery';

import { Form, Item } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { Toolbar as TB, Item as TBItem } from 'devextreme-react/toolbar';
import FileUploader from 'devextreme-react/file-uploader';

import dxTextArea from 'devextreme/ui/text_area';
import dxTextBox from 'devextreme/ui/text_box';

import custConstants from './CustomerConstants';
import CommonConstants from '../Common/CommonConstants';
import CustomersList from './CustomersList';
import useGetNextCode from '../Common/useGetNextCode';
import useGetMasterData from '../MasterData/getMasterData';

const formRef = React.createRef();
const customerURL = custConstants.getCustomerURL();

function CustomerForm(props) {
    const _popUpToggle = props._popUpToggle;
    const currentCustomer = props.currentCustomer;
    const _setToastConfig = props._setToastConfig;
    const _isNewRecord = props._isNewRecord;
    const token = props.token;

    //-------- next Customer Code--------
    const nextCode = useGetNextCode('Customer', token);

    let loadNextCode = (isEmptyObject(currentCustomer) || currentCustomer.customerCode === null || currentCustomer.customerCode === '' || props.isNewRecord ? nextCode : currentCustomer.customerCode);

    let loadCustomerStatus = (isEmptyObject(currentCustomer) || currentCustomer.customerStatus === null || props.isNewRecord ? 'Active' : currentCustomer.customerStatus);

    const statusesList = useGetMasterData('CustomerStatuses', token);
    const statuses = (statusesList !== '' ? statusesList.map(val => val.name) : statusesList);

    const customerCodeEditorOption = {
        readOnly: true,
        value: loadNextCode
    }

    const phonesEditorOptions = {
        mask: '(X00) 000-0000',
        maskRules: {
            X: /[0-9]/,
        }
    };

    const NICEditorOption = {
        maxLength: 12
    }

    const statusEditorOption = {
        value: loadCustomerStatus,
        readOnly: props.isNewRecord ? true : false,
        items: statuses, 
        onFieldDataChanged: function (e) {
            currentCustomer.customerStatus = e;
        }
    }

    const colCountByScreen = {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2
    };

    function screenByWidth(width) {
        if (width < 768) return "xs";
        if (width < 992) return "sm";
        if (width < 1200) return "md";
        return "lg";
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
            return (
                <CustomersList />
            );
        }
    }

    //New record's data will be inserted to the database
    function insertItem() {
        axios({
            method: "post",
            url: customerURL,
            data: custConstants.insertAndUpdateData(currentCustomer, 'Insert'),
            headers: {
                "Content-Type": "multipart/form-data; boundary=${form._boundary}",
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(function (response) {
                //handle success
                if (response.status == 200) {
                    _setToastConfig(true, 'success', 'Data saved Successfully');
                }
            })
            .catch(function (error) {
                //handle error
                _setToastConfig(true, 'error', 'Data NOT saved Successfully. ERROR: ' + error.response.data);
            });

        CommonConstants.refreshPage();
    }

    //All the record's data will be updated in the database
    function updateItem() {
        axios({
            method: "put",
            url: customerURL,
            data: custConstants.insertAndUpdateData(currentCustomer, 'Update'),
            headers: {
                "Content-Type": "multipart/form-data; boundary=${form._boundary}",
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                _setToastConfig(true, 'success', 'Data updated Successfully');
            })
            .catch(function (error) {
                _setToastConfig(true, 'error', 'Data NOT updated Successfully. ERROR: ' + error.response.data);
            })
        CommonConstants.refreshPage();
    }

    const NICFrontImage = () => {
        return (
            <FileUploader name="nicfPath" selectButtonText="NIC Front Image" labelText="" accept=".jpg, .png" uploadMode="useForm" />
        );
    }

    const NICBackImage = () => {
        return (
            <FileUploader name="nicbPath" selectButtonText="NIC Back Image" labelText="" accept=".jpg, .png" uploadMode="useForm" />
        );
    }

    return (
        <>
            <TB id='TB'>
                <TBItem location="before">
                    <Button icon='close' text='Cancel' onClick={() => { _popUpToggle(); }} type='danger' />
                </TBItem>
                <TBItem location="before">
                    <Button icon='save' text='Save' onClick={e => { handleSubmit(e); }} type='success' validationGroup="customerValidation" />
                </TBItem>
            </TB>
            <br />
            <div className='divider'></div>
            <br />
            <Form formData={currentCustomer} ref={formRef} validationGroup="customerValidation" screenByWidth={screenByWidth}
                colCountByScreen={colCountByScreen} labelLocation="left" minColWidth={233} colCount="auto" scrollingEnabled={true} showColonAfterLabel={false}>
                <Item itemType="group" colSpan={2} colCount={2}>
                    <Item dataField="customerCode" editorOptions={customerCodeEditorOption} caption="Customer Code" editorType={dxTextBox} />
                </Item>

                <Item itemType="group" colCount={2} colSpan={2}>
                    <Item dataField="fname" isRequired={true} label={{ text: "First Name" }} />
                    <Item dataField="lName" isRequired={true} label={{ text: "Last Name" }} horizontalAlignment="right" />
                    <Item dataField="nic" isRequired={true} label={{ text: "NIC" }} editorOptions={NICEditorOption} />
                    <Item dataField="customerStatus" editorType="dxSelectBox" editorOptions={statusEditorOption}  />
                    <Item dataField="contact1" isRequired={true} editorOptions={phonesEditorOptions} />
                    <Item dataField="contact2" editorOptions={phonesEditorOptions} />
                </Item>

                <Item itemType="group" colSpan={2}>
                    <Item dataField="email" />
                    <Item dataField="additionalNote" editorType={dxTextArea} />
                </Item>

                <Item itemType="group" caption="Home Address" colCount={2} colSpan={2}>
                    <Item dataField="addressLine1" isRequired={true} />
                    <Item dataField="addressLine2" isRequired={true} />
                    <Item dataField="addressLine3" itemType={dxTextArea} />
                </Item>

                {/* <Item itemType="group" colCount={2} colSpan={2}>
              <Item dataField="createdDate" editorOptions={recordUserDetails} />
              <Item dataField="createdDate" editorOptions={recordUserDetails} />
              <Item dataField="lastModifiedDate" editorOptions={recordUserDetails} />
              <Item dataField="lastModifiedBy" editorOptions={recordUserDetails} />
            </Item> */}

                <Item itemType="group" colCount={2} colSpan={2}>
                    <Item dataField="nicfPath" label={{ text: " " }} render={NICFrontImage} cssClass="NICUpload" />
                    <Item dataField="nicbPath" label={{ text: " " }} render={NICBackImage} cssClass="NICUpload" />
                </Item>

            </Form>
        </>
    );
}

export default memo(CustomerForm);