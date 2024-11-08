import ISEMPTY from '../Common/CommonConstants';
import ENV from '../../Environment.json';

const invoiceURL = ENV.publicURL + "Invoice";
const customerURL = ENV.publicURL + "Customer";
const itemURL = ENV.publicURL + "Item";

const invoiceStatuses = [{
  ID: 'Active',
  Status: 'Active',
},
{
  ID: 'Inactive',
  Status: 'Inactive'
},
{
  ID: 'Hold',
  Status: 'Hold'
},
{
  ID: 'Cancelled',
  Status: 'Cancelled'
}
];

const invoiceStages = [{
  ID: 'WaitingForApproval',
  Stage: 'WaitingForApproval',
},
{
  ID: 'Approved',
  Stage: 'Approved'
},
{
  ID: 'Claimed',
  Stage: 'Claimed'
}
];

const paymentMethods = [{
  ID: 'Cash',
  Method: 'Cash',
},
{
  ID: 'Cheque',
  Method: 'Cheque'
},
{
  ID: 'MoneyTransfer',
  Method: 'MoneyTransfer'
}
];


export default {
  getInvoiceURL() {
    return invoiceURL;
  },

  getCustomerURL() {
    return customerURL;
  },

  getItemURL() {
    return itemURL;
  },

  getInvoiceStatuses() {
    return invoiceStatuses;
  },

  getInvoiceStages() {
    return invoiceStages;
  },

  getPaymentMethods() {
    return paymentMethods;
  },

  insertAndUpdateData(invData, invoiceLinesData, InsertOrUpdate) {
    const invLinesCount = invoiceLinesData.items().length;
    var invLines = [];

    if (InsertOrUpdate === 'Insert') {
      for (let i = 0; i < invLinesCount; i++) {
        invLines.push({
          "description": ISEMPTY.getIsEmpty(invoiceLinesData._items[i].description),
          "itemId": ISEMPTY.getIsEmpty(invoiceLinesData._items[i].itemId),
          "marketValue": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].marketValue),
          "estimatedValue": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].estimatedValue),
          "itemValue": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].itemValue),
          "serviceCharge": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].serviceCharge),
          "quantity": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].quantity),
          "interestRate": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].interestRate),
          "taxRate": 0,
          "interest": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].interest),
          "exclPrice": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].exclPrice),
          "inclPrice": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].inclPrice),         
          "weight": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].weight),
          "netWeight": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].netWeight),        
        });
      }

      return (
        {
          "customerId": ISEMPTY.getIsEmpty(invData.customerId),
          "description": ISEMPTY.getIsEmpty(invData.description),
          "taxRate": 0,
          "interestRate": 0,
          "totalInterest": ISEMPTY.getisEmptyReturnZero(invData.totalInterest),
          "totalTax": 0,
          "totalDiscount": 0,
          "invoiceTotal": ISEMPTY.getisEmptyReturnZero(invData.invoiceTotal),
          "creditPeriod": ISEMPTY.getisEmptyReturnZero(invData.creditPeriod),
          "paymentMethod": ISEMPTY.getIsEmpty(invData.paymentMethod),
          // "totalWeight": ISEMPTY.getIsEmpty(invData.totalWeight),
          // "totalNetWeight": ISEMPTY.getIsEmpty(invData.totalNetWeight),
          "invoiceLine": invLines
        }
      );
    }

    else if (InsertOrUpdate === 'Update') {
      {
        for (let i = 0; i < invLinesCount; i++) {
          var invID = invoiceLinesData._items[0].invoiceId;
          invLines.push({
            "id": ISEMPTY.getIsEmpty(invoiceLinesData._items[i].id),
            "invoiceId": (ISEMPTY.getIsEmpty(invoiceLinesData._items[i].invoiceId) === '' ? invID : invoiceLinesData._items[i].invoiceId),
            "description": ISEMPTY.getIsEmpty(invoiceLinesData._items[i].description),
            "itemId": ISEMPTY.getIsEmpty(invoiceLinesData._items[i].itemId),
            "marketValue": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].marketValue),
            "estimatedValue": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].estimatedValue),
            "itemValue": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].itemValue),
            "serviceCharge": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].serviceCharge),
            "quantity": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].quantity),
            "interestRate": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].interestRate),
            "taxRate": 0,
            "interest": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].interest),
            "exclPrice": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].exclPrice),
            "inclPrice": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].inclPrice),
            "weight": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].weight),
            "netWeight": ISEMPTY.getisEmptyReturnZero(invoiceLinesData._items[i].netWeight),
          });
        }
        
        return (
          {
            "id": ISEMPTY.getIsEmpty(invData.id),
            "customerId": ISEMPTY.getIsEmpty(invData.customerId),
            "invoiceNumber": ISEMPTY.getIsEmpty(invData.invoiceNumber),
            "description": ISEMPTY.getIsEmpty(invData.description),
            "taxRate": 0,
            "interestRate": ISEMPTY.getIsEmpty(invData.interestRate),
            "totalInterest": ISEMPTY.getisEmptyReturnZero(invData.totalInterest),
            "totalTax": 0,
            "totalDiscount": 0,
            "invoiceTotal": ISEMPTY.getisEmptyReturnZero(invData.invoiceTotal),
            "creditPeriod": ISEMPTY.getisEmptyReturnZero(invData.creditPeriod),
            "invoiceStatus": ISEMPTY.getisEmptyReturnZero(invData.invoiceStatus),
            "invoiceStage": ISEMPTY.getisEmptyReturnZero(invData.invoiceStage),
            "paymentMethod": ISEMPTY.getIsEmpty(invData.paymentMethod),
            "totalWeight": ISEMPTY.getIsEmpty(invData.totalWeight),
            "totalNetWeight": ISEMPTY.getIsEmpty(invData.totalNetWeight),
            "userId": ISEMPTY.getIsEmpty(invData.user.id),
            "modifiedUserId": ISEMPTY.getIsEmpty(invData.modifiedUserId),
            "modifiedUserName": ISEMPTY.getIsEmpty(invData.modifiedUserName),
            "approvedUserId": ISEMPTY.getIsEmpty(invData.approvedUserId),
            "approvedUserName": ISEMPTY.getIsEmpty(invData.approvedUserName), 
            "invoiceDate": ISEMPTY.getIsEmpty(invData.invoiceDate), 
            "invoiceType": ISEMPTY.getIsEmpty(invData.invoiceType),
            "creditPeriodDays": ISEMPTY.getisEmptyReturnZero(invData.creditPeriodDays),
            "estimatedValue": ISEMPTY.getIsEmpty(invData.estimatedValue), 
            "marketValue": ISEMPTY.getIsEmpty(invData.marketValue),
            "advance": ISEMPTY.getisEmptyReturnZero(invData.advance),
            "invoiceLine": invLines
          }
        );
      }
    }
  }
}