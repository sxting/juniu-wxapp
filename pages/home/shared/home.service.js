import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let homeService = {};
/**GET /appstore/app/storeIndex.json 门店首页信息 */
homeService.storeIndex = (data) => {
  let apiUrl = constant.apiUrl + '/account/appstore/app/storeIndex.json';
  return http.get(apiUrl, data);
}
module.exports = {
  homeService: homeService
}