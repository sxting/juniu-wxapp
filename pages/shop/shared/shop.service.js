import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let shopService = {};
// GET /appstore/app/storeInfo.json
shopService.storeInfoDetail = (data) => {
  let url = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 + '/member/appstore/storeInfo.json' : constant.apiUrl + '/account/appstore/app/storeInfo.json';
  return http.get(url, data)
}

module.exports = {
  shopService: shopService
}