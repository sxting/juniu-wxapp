import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let orderService = {};

let apiUrl = 'http://b-test.juniuo.com/merchant/reserve'

// 查询门店预约配置
orderService.reserveConfig = (data) => {
  let url = apiUrl + '/app/reserveConfig.json';
  return http.get(url, data)
}

// 单个手艺人预约信息
orderService.reserveStaff = (data) => {
  let url = apiUrl + '/app/reserveStaff.json';
  return http.get(url, data)
}

// 保存预约信息
orderService.saveReserve = (data) => {
  let url = apiUrl + '/app/reserve.json';
  return http.post(url, data)
}

module.exports = {
  orderService: orderService
}