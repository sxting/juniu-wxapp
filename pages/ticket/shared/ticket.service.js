import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let ticketService = {};
// GET /sp/coupon/allCouponlist.json
ticketService.allCouponlist = (data) => {
  let url = constant.apiUrl + '/member/sp/coupon/allCouponlist.json';
  return http.get(url, data)
}
// 卡券详情
ticketService.getDetail = (data) => {
  let url = constant.apiUrl + '/member/sp/coupon/couponInfo.json';
  return http.get(url, data);
}
// 领取优惠券
ticketService.receiveTicket = (data) => {
  let url = constant.apiUrl + '/member/sp/coupon/getCoupon.json';
  return http.post(url, data);
}
module.exports = {
  ticketService: ticketService
}