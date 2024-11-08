import ISEMPTY from '../Common/CommonConstants';
import ENV from '../../Environment.json';

const paymentURL = ENV.publicURL + "PaymentRecord";
const customersURL = ENV.publicURL + 'Customer'
const InvoiceURL = ENV.publicURL + 'Invoice'
const ReceiptURL = ENV.publicURL + 'Receipt'
const paymentClaimURL = ENV.publicURL + "PaymentClaim";

export default {
    getPaymentURL(){
      return paymentURL;
    },

    getCustomersURL(){
      return customersURL;
    },

    getInvoiceURL(){
      return InvoiceURL;
    },

    getReceiptURL(){
      return ReceiptURL;
    },

    getPaymentClaimURL(){
      return paymentClaimURL;
    },

    UpdateData(invData, receiptData) {
      var claims = [];

      for (let i = 0; i < invData.length; i++) {
        claims.push({    
          "id": ISEMPTY.getIsEmpty(invData[i].id),
          "invoiceNumber": ISEMPTY.getIsEmpty(invData[i].invoice.invoiceNumber),
          "customerId": ISEMPTY.getIsEmpty(invData[i].invoice.customerId),
          "description": ISEMPTY.getIsEmpty(invData[i].invoice.description),
          "taxRate": ISEMPTY.getisEmptyReturnZero(invData[i].invoice.taxRate),
          "interestRate": ISEMPTY.getisEmptyReturnZero(invData[i].invoice.interestRate),
          "totalInterest": ISEMPTY.getisEmptyReturnZero(invData[i].invoice.totalInterest),
          "totalTax": ISEMPTY.getisEmptyReturnZero(invData[i].invoice.totalTax),
          "totalDiscount": ISEMPTY.getisEmptyReturnZero(invData[i].invoice.totalDiscount),
          "invoiceTotal": ISEMPTY.getisEmptyReturnZero(invData[i].invoice.invoiceTotal),
          "creditPeriod": ISEMPTY.getisEmptyReturnZero(invData[i].invoice.creditPeriod),
          "invoiceStatus": ISEMPTY.getIsEmpty(invData[i].invoice.invoiceStatus),
          "invoiceStage": ISEMPTY.getIsEmpty(invData[i].invoice.invoiceStage),
          "paymentMethod": ISEMPTY.getIsEmpty(invData[i].invoice.paymentMethod),
          "invoiceDate": ISEMPTY.getIsEmpty(invData[i].invoice.invoiceDate),
          "modifiedDate": ISEMPTY.getIsEmpty(invData[i].invoice.modifiedDate),
          "customer":{},
          "invoiceLines":[],
          "receipts": receiptData,
          "user":{}
        }
      );
    }

    console.log(claims);
    return claims;
  }
}