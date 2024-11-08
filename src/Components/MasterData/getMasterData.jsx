import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import itemConstants from '../Items/ItemConstants';
import masterDataConstants from '../MasterData/masterDataConstants';

const masterDataURL = masterDataConstants.getMasterDataURL();
const itemsURL = itemConstants.getItemURL();

function useGetMasterData(masterDataName, token) {
    var formURL;
    const [ValuesList, setValuesList] = useState('');

  switch(masterDataName){
    case 'CustomerStatuses':
      formURL = masterDataURL+'/GetCustomerStatus/';
      break;

    case 'InvoiceStatuses':
      formURL = masterDataURL+'/GetInvoiceStatus';
      break;

    case 'InvoiceStages':
      formURL = masterDataURL+'/GetInvoiceStage';
      break;

    case 'PaymentMethods':
      formURL = masterDataURL+'/GetPaymentMethod';
      break;

    case 'ItemCategories':
      formURL = masterDataURL+'/GetItemCategory';
      break;

    default:
      formURL = '';
  }

  const getValuesList = useCallback(() => {
    axios({
      method: 'get',
      url: formURL, headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (response.status == 200) {
          setValuesList(response.data);
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
    getValuesList()
  }, [])
    
  return ValuesList;
}

export default useGetMasterData;