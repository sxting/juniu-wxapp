import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let personalService = {};

// 查询我的预约列表
personalService.reserveConfig = () => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/reserve/app/myReservations.json';
  return http.get(url)
}

personalService.myComment = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/member/comment/app/userComment.json';
  return http.get(url, data);
}

personalService.myTicket = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/member/sp/coupon/userCouponList.json';
  return http.get(url, data);
}

module.exports = {
  personalService: personalService
}