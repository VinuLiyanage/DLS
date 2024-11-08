import ISEMPTY from '../Common/CommonConstants';
import ENV from '../../Environment.json';

const receiptURL = ENV.publicURL + "Receipt";
const invoiceURL = ENV.publicURL + "Invoice";

const receiptStatuses = [{
    ID: 0,
    Status: 'Active',
  }, 
  {
    ID: 1,
    Status: 'Inactive'
  },
  {
    ID: 2,
    Status: 'Hold'
  },
  {
    ID: 3,
    Status: 'Cancelled'
  }
];

const receiptStages = [{
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
    ID: 0,
    Method: 'Cash',
  }, 
  {
    ID: 1,
    Method: 'Cheque'
  },
  {
    ID: 2,
    Method: 'MoneyTransfer'
  }
];


export default {
  getReceiptURL(){
    return receiptURL;
  },

  getInvoiceURL(){
    return invoiceURL;
  },

  getReceiptStatuses(){
    return receiptStatuses;
  },

  getReceiptStages(){
    return receiptStages;
  },

  getPaymentMethods(){
    return paymentMethods;
  },

  insertAndUpdateData(receiptData, InsertOrUpdate){      
    if(InsertOrUpdate === 'Insert'){
      return({
        "invoiceId": ISEMPTY.getIsEmpty(receiptData.invoiceId),
        "description": ISEMPTY.getIsEmpty(receiptData.description),
        "payment": ISEMPTY.getisEmptyReturnZero(receiptData.payment),
        "discount": 0,
        "fine": 0,
        "currentInterestRate": ISEMPTY.getisEmptyReturnZero(receiptData.currentInterestRate),
        "receiptTotal": ISEMPTY.getisEmptyReturnZero(receiptData.receiptTotal),
        "paymentDate": ISEMPTY.getisEmptyReturnZero(receiptData.paymentDate),
        "cumulativeInterest": ISEMPTY.getisEmptyReturnZero(receiptData.cumulativeInterest)
      });
    }
    else if(InsertOrUpdate === 'Update'){
      return({
        "id": ISEMPTY.getIsEmpty(receiptData.id),
        "customerId": ISEMPTY.getIsEmpty(receiptData.customerId),
        "receiptCode": ISEMPTY.getIsEmpty(receiptData.receiptCode),
        "invoiceId": ISEMPTY.getIsEmpty(receiptData.invoiceId),
        "description": ISEMPTY.getIsEmpty(receiptData.description),
        "payment": ISEMPTY.getisEmptyReturnZero(receiptData.payment),
        "discount": 0,
        "fine": 0,
        "paymentPeriod": 0,
        "receiptTotal": ISEMPTY.getisEmptyReturnZero(receiptData.receiptTotal),
        "paymentDate": ISEMPTY.getisEmptyReturnZero(receiptData.paymentDate),
        "createdUserId": ISEMPTY.getIsEmpty(receiptData.createdUserId),
        "createdUserName": ISEMPTY.getIsEmpty(receiptData.createdUserName),
        "modifiedUserID": ISEMPTY.getIsEmpty(receiptData.modifiedUserID),
        "modifiedUserName": ISEMPTY.getIsEmpty(receiptData.modifiedUserName),
        "approveUserID": ISEMPTY.getIsEmpty(receiptData.approveUserID),
        "approveUserName": ISEMPTY.getIsEmpty(receiptData.approvedUserName),
        "currentInterestRate": ISEMPTY.getisEmptyReturnZero(receiptData.currentInterestRate),
        "cumulativeInterest": ISEMPTY.getisEmptyReturnZero(receiptData.cumulativeInterest)
      });
    }
  }
}