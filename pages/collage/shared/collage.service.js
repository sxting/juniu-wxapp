import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let collageService = {};

let API = constant.apiUrl + '/pintuan-service';

//商品详情
collageService.getProductDetail = (data) => {
  let apiUrl = API + '/consumer/pintuan/detail.json';
  return http.get(apiUrl, data);
}

module.exports = {
  collageService: collageService
}