import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let commentService = {};
// member/comment/app/queryCommentList.json
commentService.queryCommentList = (data) => {
  let apiUrl = constant.apiUrl + '/member/comment/app/queryCommentList.json';
  return http.get(apiUrl, data);
}

commentService.queryCommentDetail = (data) => {
  let apiUrl = constant.apiUrl + '/member/comment/queryCommentDetail.json';
  return http.get(apiUrl, data);
}

commentService.making = (data) => {
  let apiUrl = constant.apiUrl + '/member/comment/save.json';
  return http.post(apiUrl, data);
}
module.exports = {
  commentService: commentService
}