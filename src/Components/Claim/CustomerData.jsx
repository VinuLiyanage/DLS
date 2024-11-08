import React, { memo } from 'react';
import Form, { SimpleItem, GroupItem } from 'devextreme-react/form';

import '../../Assests/css/CustomCss/Claim.css';

function CustomerData(props) {
    var _customerData = (props.dataSource.length === 0 || props.dataSource[0].invoice === undefined ? [] : props.dataSource[0].invoice);
    return (
        <React.Fragment>
            <Form className='frmClaimCustomer' readOnly={true} formData={_customerData}>
                <GroupItem colCount={2} caption="Customer Info">
                    <SimpleItem dataField='customer.customerCode' label={{ text: 'Customer Code' }} />
                    <SimpleItem dataField='customer.customerStatus' label={{ text: 'Customer Status' }} />
                    <SimpleItem dataField='customer.fname' label={{ text: 'First Name' }} />
                    <SimpleItem dataField='customer.lName' label={{ text: 'Last Name' }} />
                    <SimpleItem dataField='customer.nic' label={{ text: 'NIC' }} />
                    <SimpleItem dataField='customer.email' label={{ text: 'Email' }} />
                    <SimpleItem dataField='customer.contact1' label={{ text: 'Contact 1' }} />
                    <SimpleItem dataField='customer.contact2' label={{ text: 'Contact 2' }} />
                    <SimpleItem dataField='customer.address1' label={{ text: 'Address 1' }} />
                    <SimpleItem dataField='customer.address2' label={{ text: 'Address 2' }} />
                    <SimpleItem dataField='customer.address2' label={{ text: 'Address 3' }} />
                </GroupItem>
            </Form>
        </React.Fragment>
    );
}

export default memo(CustomerData);