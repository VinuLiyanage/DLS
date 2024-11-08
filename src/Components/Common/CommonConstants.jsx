import ENV from '../../Environment.json';
import authentication from "react-azure-b2c";

const reportsURL = ENV.reportsURL + "Print";
const printConditionsURL = ENV.publicURL + "PrintCondition";

const allowedPageSizes = [10, 20, 50, 'all'];
const filterBuilderPopupPosition = {
    of: window,
    at: 'top',
    my: 'top',
    offset: { y: 10 },
  };
  
  const filterBuilder = {
    customOperations: [{
      name: 'weekends',
      caption: 'Weekends',
      dataTypes: ['date'],
      icon: 'check',
      hasValue: false,
      calculateFilterExpression: () => [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]],
    }],
    allowHierarchicalFields: true,
  };
  
  function getOrderDay(rowData) {
    return (new Date(rowData.OrderDate)).getDay();
  }

  function isEmpty(val){
    let returnval = (val === undefined || val == null || val.length <= 0) ? '' : val;
    return returnval;
  }

  function isEmptyReturnZero(val){
    let returnval = (val === undefined || val == null || val.length <= 0 || val === '') ? 0 : val;
    return returnval;
  }

  function pageRefresh(){
  //   setTimeout(function(){
  //     window.location.reload(1);
  //  }, 1505)
  }

  export default {
    AUTHENTICATION(){
      return authentication;
    },

    getReportsURL() {
      return reportsURL;
    },

    getPrintConditionsURL(){
      return printConditionsURL;
    },

    getallowedPageSizes() {
        return allowedPageSizes;
    },

    getfilterBuilderPopupPosition() {
        return filterBuilderPopupPosition;
    },
    
    getfilterBuilder() {
        return filterBuilder;
    },

    getIsEmpty(val){
      return isEmpty(val);
    },

    getisEmptyReturnZero(val){
      return isEmptyReturnZero(val);
    },

    refreshPage(){
      return pageRefresh()
    }

}