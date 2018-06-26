import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let homeService = {};
/**GET /appstore/app/storeIndex.json 门店首页信息 */
homeService.storeIndex = (data) => {
  let apiUrl = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 + '/member/appstore/storeIndex.json' : constant.apiUrl + '/account/appstore/app/storeIndex.json';
  return http.get(apiUrl, data);
}

homeService.ticketList = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/sp/coupon/couponlist.json';
  return http.get(apiUrl, data);
}

module.exports = {
  homeService: homeService
}