import ISEMPTY from '../Common/CommonConstants';
import ENV from '../../Environment.json';

const masterDataURL =  ENV.publicURL + "Master";

export default {
    getMasterDataURL(){
      return masterDataURL;
    }
}