import ISEMPTY from '../Common/CommonConstants';
import ENV from '../../Environment.json';

const itemURL = ENV.publicURL + "Item";

const karatList = [
  {
    id: "24K",
    karat: "24K"
  },
  {
    id: "22K",
    karat: "22K"
  },
  {
    id: "18K",
    karat: "18K"
  },
  {
    id: "14K",
    karat: "14K"
  },
  {
    id: "10K",
    karat: "10K"
  },
]

export default {
  getItemURL(){
    return itemURL;
  },

  getKaratList(){
    return karatList;
  },

  insertAndUpdateData(itemData, InsertOrUpdate){     
    if(InsertOrUpdate === 'Insert'){
      return({
        "itemName": ISEMPTY.getIsEmpty(itemData.itemName),
        "additionalNote": ISEMPTY.getIsEmpty(itemData.additionalNote),
        "category": ISEMPTY.getIsEmpty(itemData.category),
        "karat": ISEMPTY.getIsEmpty(itemData.karat),
        "goldPrecentage": ISEMPTY.getIsEmpty(itemData.goldPrecentage),
        });
    } 
    else if(InsertOrUpdate === 'Update'){
    return({
      "id": ISEMPTY.getIsEmpty(itemData.id),
      "itemCode": ISEMPTY.getIsEmpty(itemData.itemCode),
      "itemName": ISEMPTY.getIsEmpty(itemData.itemName),
      "category": ISEMPTY.getIsEmpty(itemData.category),
      "karat": ISEMPTY.getIsEmpty(itemData.karat),
      "goldPrecentage": ISEMPTY.getIsEmpty(itemData.goldPrecentage),
      "additionalNote": ISEMPTY.getIsEmpty(itemData.additionalNote),
      "createdDate": ISEMPTY.getIsEmpty(itemData.createdDate),
      "createdUserFname": ISEMPTY.getIsEmpty(itemData.createdUserFname)
      });
    }
  }
}