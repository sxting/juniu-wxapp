import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let commentService = {};
// member/comment/app/queryCommentList.json
commentService.queryCommentList = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/comment/app/queryCommentList.json';
  return http.get(apiUrl, data);
}

commentService.queryCommentDetail = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/comment/queryCommentDetail.json';
  return http.get(apiUrl, data);
}

commentService.making = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/comment/save.json';
  return http.post(apiUrl, data);
}

commentService.getStaffList = (data) => {
  let url = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 + '/member/staff/list.json' : constant.apiUrl + '/account/list.json';
  return http.get(url, data)
}

commentService.getProductList = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/product' + '/list.json';
  return http.get(url, data)
}

module.exports = {
  commentService: commentService
}