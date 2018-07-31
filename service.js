import { constant } from 'utils/constant';
import { http } from 'utils/http';
let service = {};
/**GET /appstore/app/storeIndex.json 门店首页信息 */
/**登录 */
service.logIn = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl;
  let apiUrl = api + '/member/platformUsers/wxapp/login.json';
  return http.get(apiUrl, data);
}
/*判断是否绑定手机号  sp/coupon/isBind.json */
service.userIsBind = () => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl;
  let apiUrl = api + '/member/sp/coupon/isBind.json';
  return http.get(apiUrl);
}
module.exports = {
  service: service
}