import ISEMPTY from '../Common/CommonConstants';
import ENV from '../../Environment.json';

const customerURL = ENV.publicURL + "Customer";

const customerStatuses = [
  {
    ID: 'Active',
    Status: 'Active',
  }, 
  {
    ID: 'Inactive',
    Status: 'Inactive'
  }];

export default {
  getCustomerURL(){
    return customerURL;
  },

  getCustomerStatuses(){
    return customerStatuses;
  },

  insertAndUpdateData(customerData, InsertOrUpdate){   
    const formData = new FormData();   

    if(InsertOrUpdate === 'Update'){
      formData.append("id",ISEMPTY.getIsEmpty(customerData.id));
      formData.append("customerCode",ISEMPTY.getIsEmpty(customerData.customerCode));
      formData.append("customerStatus",ISEMPTY.getIsEmpty(customerData.customerStatus));
      formData.append("userId",ISEMPTY.getIsEmpty(customerData.user.id));      
      formData.append("updatedUserId",ISEMPTY.getIsEmpty(customerData.updatedUserId));    
      formData.append("updatedUserName",ISEMPTY.getIsEmpty(customerData.updatedUserName));  
    }

    formData.append("nic",ISEMPTY.getIsEmpty(customerData.nic));
    formData.append("fname",ISEMPTY.getIsEmpty(customerData.fname));
    formData.append("lName",ISEMPTY.getIsEmpty(customerData.lName));
    formData.append("contact1",ISEMPTY.getIsEmpty(customerData.contact1));
    formData.append("contact2",ISEMPTY.getIsEmpty(customerData.contact2));
    formData.append("email",ISEMPTY.getIsEmpty(customerData.email));
    formData.append("addressLine1",ISEMPTY.getIsEmpty(customerData.addressLine1));
    formData.append("addressLine2",ISEMPTY.getIsEmpty(customerData.addressLine2));
    formData.append("addressLine3",ISEMPTY.getIsEmpty(customerData.addressLine3));
    formData.append("additionalNote",ISEMPTY.getIsEmpty(customerData.additionalNote));
    formData.append("nicFront",ISEMPTY.getIsEmpty(customerData.nicfPath));
    formData.append("nicBack",ISEMPTY.getIsEmpty(customerData.nicbPath));
    return formData;
  }
}


