import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let productService = {};

let apiUrl = 'http://b-test.juniuo.com/merchant/product';

// 获取预约手艺人商品
productService.getStaffProduct = (data) => {
  let url = apiUrl + '/product/staff.json';
  return http.get(url, data)
}

module.exports = {
  productService: productService
}