import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let homeService = {};
/**GET /appstore/app/storeIndex.json 门店首页信息 */
homeService.storeIndex = (data) => {
  let apiUrl = constant.apiUrl + '/member/appstore/storeIndex.json';
  return http.get(apiUrl, data);
}

homeService.ticketList = (data) => {
  let apiUrl = constant.apiUrl + '/member/sp/coupon/couponlist.json';
  return http.get(apiUrl, data);
}

module.exports = {
  homeService: homeService
}