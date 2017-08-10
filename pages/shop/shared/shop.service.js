import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let shopService = {};
// GET /appstore/app/storeInfo.json
shopService.storeInfoDetail = (data) => {
  let url = constant.apiUrl + '/account/appstore/app/storeInfo.json';
  return http.get(url, data)
}

module.exports = {
  shopService: shopService
}