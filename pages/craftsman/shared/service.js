import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let craftsmanService = {};

let apiUrl1 = 'http://b-test.juniuo.com/merchant/reserve';
let apiUrl2 = 'http://b-test.juniuo.com/merchant/account'

// 传当前日期和门店id，查询预约手艺人列表
craftsmanService.getReserveList = (data) => {
  let url = apiUrl1 + '/app/reserveList.json';
  return http.get(url, data)
}

// 查询员工列表
craftsmanService.getStaffList = (data) => {
  let url = apiUrl2 + '/list.json';
  return http.get(url, data)
}

// 查询员工详情
craftsmanService.getStaffDetail = (data) => {
  let url = apiUrl2 + '/staffInfo.json';
  return http.get(url, data)
}

module.exports = {
  craftsmanService: craftsmanService
}