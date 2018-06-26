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
  let apiUrl = constant.apiUrl + '/member/appstore/list.json';
  return http.get(apiUrl, data);
}
/**地址转id */
// GET GET /TencentNameToId.json

indexService.nameToId = (data) => {
  let apiUrl = constant.apiUrl + '/member/TencentNameToId.json';
  return http.get(apiUrl, data);
}
//经纬度转地址 GET /TencentLongAndLatiToAddress.json
indexService.TencentLongAndLatiToAddress = (data) => {
  let apiUrl = constant.apiUrl + '/member/TencentLongAndLatiToAddress.json';
  return http.get(apiUrl, data);
}
/**登录 */
indexService.logIn = (data) => {
  let apiUrl = constant.apiUrl + '/member/platformUsers/wxapp/login.json';
  return http.get(apiUrl, data);
}
module.exports = {
  indexService: indexService
}
