import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let collageService = {};

let API = constant.apiUrl;
API = 'http://192.168.199.21:8080';

//商品详情
collageService.getProductDetail = (data) => {
  let apiUrl = API + '/consumer/activity/detail.json';
  return http.get(apiUrl, data);
}

module.exports = {
  collageService: collageService
}