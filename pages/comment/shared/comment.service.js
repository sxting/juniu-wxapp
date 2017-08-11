import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let commentService = {};
// member/comment/app/queryCommentList.json
commentService.queryCommentList = (data) => {
  let apiUrl = constant.apiUrl + '/member/comment/app/queryCommentList.json';
  return http.get(apiUrl, data);
}

module.exports = {
  commentService: commentService
}