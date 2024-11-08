
import { useState, useEffect,useCallback  } from 'react';
import axios from 'axios';
import custConstants from '../Customers/CustomerConstants';
import invoiceContants from '../Invoices/InvoiceConstants';
import itemConstants from '../Items/ItemConstants';
import receiptConstants from '../Receipts/ReceiptConstants';

const customerURL = custConstants.getCustomerURL();
const invoiceURL = invoiceContants.getInvoiceURL();
const itemURL = itemConstants.getItemURL();
const receiptURL = receiptConstants.getReceiptURL();

function useGetNextCode(formName, token) {

  var result;
  var formURL;
  const [nextCode, setnextCode] = useState('');

  switch (formName) {
    case 'Customer':
      formURL = customerURL + '/GetNextCustomerCode/';
      break;

    case 'Invoice':
      formURL = invoiceURL + '/GetInvoiceCode/';
      break;

    case 'Item':
      formURL = itemURL + '/GetNextItemCode/';
      break;

    case 'Receipt':
      formURL = receiptURL + '/GetReceiptCode/';
      break;

    default:
      formURL = '';
  }
  const getNextCode = useCallback(() => {
    axios({
      method: 'get',
      url: formURL, headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (response.status == 200) {
          setnextCode(response.data);
        }
        else {
          console.log(response.status);
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }, [])
  useEffect(() => {
    getNextCode()
  }, [getNextCode])

  return nextCode;
}

export default useGetNextCode;