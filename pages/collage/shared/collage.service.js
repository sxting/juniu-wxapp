import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let collageService = {};

let API = constant.apiUrlTwo + 'pintuan';
// API = 'http://192.168.199.26:8080';

//商品详情
collageService.getProductDetail = (data) => {
  let apiUrl = API + '/consumer/activity/detail.json';
  return http.get(apiUrl, data);
}

//商品列表
collageService.getProductList = (data) => {
  let apiUrl = API + '/consumer/activity/batchQuery.json';
  return http.get(apiUrl, data);
}


module.exports = {
  collageService: collageService
}