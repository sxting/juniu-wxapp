import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let personalService = {};

let apiUrl = 'http://b-test.juniuo.com/merchant/reserve'

// 查询我的预约列表
personalService.reserveConfig = () => {
  let url = apiUrl + '/app/myReservations.json';
  return http.get(url)
}

personalService.myComment = (data) => {
  let url = constant.apiUrl + '/member/comment/app/userComment.json';
  return http.get(url, data);
}
module.exports = {
  personalService: personalService
}