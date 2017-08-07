import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let craftsmanService = {};

let apiUrl = 'http://b-test.juniuo.com/merchant/reserve';

// 传当前日期和门店id，查询预约手艺人列表
craftsmanService.getReserveList = (data) => {
  let url = apiUrl + '/app/reserveList.json';
  return http.get(url, data)
}

module.exports = {
  craftsmanService: craftsmanService
}