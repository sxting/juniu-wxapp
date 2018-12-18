import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let shopService = {};
// GET /appstore/app/storeInfo.json
shopService.storeInfoDetail = (data) => {
  let url = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 + '/member/appstore/storeInfo.json' : constant.apiUrl + '/account/appstore/app/storeInfo.json';
  return http.get(url, data)
}

// 手艺人作品详情
shopService.getStaffProductionDetail = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/account/production/detail.json';
  return http.get(url, data)
}

// 视频地址接口  getVideoUrlById.json
shopService.getVideoUrlById = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrlTwo : constant.apiUrlTwo
  let url = api + '/getVideoUrlById.json';
  return http.get(url, data)
}


module.exports = {
  shopService: shopService
}