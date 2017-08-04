import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let indexService = {};
/**行政区查询 */
indexService.getDistrict = (key, loc) => {
  let apiUrl = constant.apiUrl + '/pay/collectMoney.json';
  return http.post(apiUrl, data);
}
/**
 * 获取门店列表
 */
indexService.getStoreList = (data) => {
  // GET /appstore/list
  let apiUrl = constant.apiUrl + '/account/appstore/list.json';
  return http.get(apiUrl, data);
}
module.exports = {
  indexService: indexService
}
