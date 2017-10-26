import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let memberCardService = {};
// 会员卡绑定
memberCardService.bindCard = (data) => {
  let apiUrl = constant.apiUrl + '/member/sp/member/card/bind.json';
  return http.get(apiUrl, data);
}

memberCardService.cardInfo = (data) => {
  let apiUrl = constant.apiUrl + '/member/sp/member/card/cardInfo.json'
  return http.get(apiUrl, data);
}
// GET /sp/member/card/consumeRecord.json
// 消费记录
memberCardService.consumeRecord = (data) => {
  let apiUrl = constant.apiUrl + '/member/sp/member/card/consumeRecord.json';
  return http.get(apiUrl, data);
}
// /sp/member/card/list.json
// 会员卡列表
memberCardService.cardList = (data) => {
  let apiUrl = constant.apiUrl + '/member/sp/member/card/list.json';
  return http.get(apiUrl, data);
}
module.exports = {
  memberCardService: memberCardService
}