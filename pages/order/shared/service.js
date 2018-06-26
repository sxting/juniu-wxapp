import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let orderService = {};

// 查询门店预约配置
orderService.reserveConfig = (data) => {
  let url = constant.apiUrl + '/reserve/app/reserveConfig.json';
  return http.get(url, data)
}

// 单个手艺人预约信息
orderService.reserveStaff = (data) => {
  let url = constant.apiUrl + '/reserve/app/reserveStaff.json';
  return http.get(url, data)
}

// 保存预约信息
orderService.saveReserve = (data) => {
  let url = constant.apiUrl + '/reserve/app/reserve.json';
  return http.post(url, data)
}

module.exports = {
  orderService: orderService
}