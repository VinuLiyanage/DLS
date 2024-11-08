import React from 'react';
import { DataGrid, Column, Scrolling } from 'devextreme-react/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';

import invoiceConstants from './InvoiceConstants';

const dataGridRef = React.createRef();
const invoiceURL = invoiceConstants.getInvoiceURL(); //Base URL of the Invoice

function onStateResetClick() {
  dataGridRef.current.instance.state(null);
}

function InvoiceLines(props){
    const invoiceLinesDS = new DataSource({
        store: new ArrayStore({
            data: props.data.data.invoiceLines,
            key: 'id',
        })
    });

    return (
        <React.Fragment>
          {/* <div className="master-detail-caption">
            {`${invoiceNumber}`}
          </div> */}
          <DataGrid
            id="invoiceLines"
            dataSource={invoiceLinesDS}
            showBorders={true}
            columnAutoWidth={true}
          >
            <Column dataField="id" visible={false} showInColumnChooser={false}/>
            <Column dataField="invoiceId" visible={false} showInColumnChooser={false}/>
            {/* <Column dataField="itemId" caption="Item">
                <Lookup dataSource={customerStatus} valueExpr="id" displayExpr="Status" />
            </Column> */}
            <Column dataField="item.itemName" caption="Item"/>
            <Column dataField="description" caption="Description"/>   
            <Column dataField="marketValue" caption="Market Value" format="'Rs. ',##0.###" />
            <Column dataField="estimatedValue" caption="Estimated Value" format="'Rs. ',##0.###" />
            <Column dataField="itemValue" caption="Advance" dataType="decimal" format="'Rs. ',##0.###"/>
            <Column dataField="serviceCharge" caption="Service Charge" format="'Rs. ',##0.###" />
            <Column dataField="weight" caption="Weight" />
            <Column dataField="netWeight" caption="Net Weight" />
            <Column dataField="quantity" caption="Quantity" dataType="number" />
            <Column dataField="interestRate" caption="Interest Rate (p.a)" type="decimal" format="#0.###'%'"/>
            <Column dataField="interest" caption="Interest" type="decimal" format="'Rs. ',##0.###"/>
            <Column dataField="exclPrice" caption="Excl Price" type="decimal" format="'Rs. ',##0.###"/>
            <Column dataField="inclPrice" caption="Incl Price" type="decimal"  format="'Rs. ',##0.###"/>
            <Scrolling columnRenderingMode="virtual" rowRenderingMode='virtual'/>
          </DataGrid>
        </React.Fragment>
      );
}

export default InvoiceLines;
