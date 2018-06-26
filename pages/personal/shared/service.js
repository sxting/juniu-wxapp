import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let personalService = {};

// 查询我的预约列表
personalService.reserveConfig = () => {
  let url = constant.apiUrl + '/reserve/app/myReservations.json';
  return http.get(url)
}

personalService.myComment = (data) => {
  let url = constant.apiUrl + '/member/comment/app/userComment.json';
  return http.get(url, data);
}

personalService.myTicket = (data) => {
  let url = constant.apiUrl + '/member/sp/coupon/userCouponList.json';
  return http.get(url, data);
}

module.exports = {
  personalService: personalService
}