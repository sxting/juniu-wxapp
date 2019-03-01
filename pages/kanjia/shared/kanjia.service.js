import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';

let kanjiaService = {};
let api2 = constant.apiUrl;
let api = constant.apiUrlTwo + '/pintuan';

kanjiaService.preorder = (data) => {
  let apiUrl = api + '/activity/consumer/bargain/preorder.json';
  return http.get(apiUrl, data);
}

module.exports = {
  kanjiaService: kanjiaService
}
