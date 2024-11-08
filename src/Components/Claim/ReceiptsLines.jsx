import React from 'react';
import { DataGrid, Column, Lookup, Summary, TotalItem, Selection } from 'devextreme-react/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import receiptsConstants from '../Receipts/ReceiptConstants';
import { useDispatch } from "react-redux";
import { getReceipts } from './Slice/ClaimSlice'

const receiptStage = receiptsConstants.getReceiptStages();

function ReceiptsLines(props) {
    const dispatch = useDispatch();
    const receiptsLinesDS = new DataSource({
        store: new ArrayStore({
            data: props.data.data.invoice.receipts,
            key: 'id', 
        }),
        filter: [ "!", [ "receiptStage", "=", 'WaitingForApproval' ] ]
    })

    // function onSelectionChanged(e) {
    //     dispatch(getReceipts(e.selectedRowsData));
    // }

    function onInitialized(e){
        var parentKey = props.data.row.key;  
        var parentGrid = props.data.component;  
        if (parentGrid.isRowSelected(parentKey)) {  
            e.component.selectAll();  
        }  
    }

    return (
        <React.Fragment>
            <DataGrid
                id="receiptsLines"
                dataSource={receiptsLinesDS}
                showBorders={true}
                columnAutoWidth={true}
                onInitialized={onInitialized}
                onSelectionChanged={
                    (e) => 
                        dispatch(getReceipts(e.selectedRowsData))
                    } >

                <Selection mode="multiple" showCheckBoxesMode='always'/>
                <Column dataField="id" visible={false} showInColumnChooser={false} />
                <Column dataField="receiptCode" caption="Receipt Code" />
                <Column dataField="createdDate" caption="Receipt Date" dataType="date" />
                <Column dataField="description" caption="Description" visible={false} />
                <Column dataField="paymentPeriod" caption="Payment Period" />
                <Column dataField="receiptStage" caption="Receipt Stage">
                    <Lookup dataSource={receiptStage} valueExpr="ID" displayExpr="Stage" />
                </Column>
                <Column dataField="payment" caption="Payment" format="'Rs. ',##0.###" visible={false} />
                <Column dataField="discount" caption="Discount" format="'Rs. ',##0.###" visible={false} />
                <Column dataField="fine" caption="fine" format="'Rs. ',##0.###" visible={false} />
                <Column dataField="receiptTotal" caption="Receipt Total" format="'Rs. ',##0.###" />

                <Summary>
                    <TotalItem
                        column="id"
                        summaryType="count" />
                    <TotalItem
                        column="totalInterest"
                        summaryType="sum"
                        displayFormat="Interest Total: {0}" />
                    <TotalItem
                        column="receiptTotal"
                        summaryType="sum"
                        displayFormat="Receipt Total: {0}"
                        valueFormat="'Rs. ',##0.###" />
                </Summary>
            </DataGrid>
        </React.Fragment>
    );
};

export default ReceiptsLines;
