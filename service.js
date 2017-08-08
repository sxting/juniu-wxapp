import { constant } from 'utils/constant';
import { http } from 'utils/http';
let service = {};
/**GET /appstore/app/storeIndex.json 门店首页信息 */
/**登录 */
service.logIn = (data) => {
  let apiUrl = constant.apiUrl + '/member/platformUsers/wxapp/login.json';
  return http.get(apiUrl, data);
}
module.exports = {
  service: service
}