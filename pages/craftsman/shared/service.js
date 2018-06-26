import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let craftsmanService = {};

let apiUrl1 = constant.apiUrl + '/reserve'; 
let apiUrl2 = constant.apiUrl + '/account';
let apiUrl3 = constant.apiUrl + '/member';

// 传当前日期和门店id，查询预约手艺人列表
craftsmanService.getReserveList = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/reserve/app/reserveList.json';
  return http.get(url, data)
}

// 查询员工列表
craftsmanService.getStaffList = (data) => {
  let url = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 + '/member/staff/list.json' : constant.apiUrl + '/account/list.json';
  return http.get(url, data)
}

// 查询员工详情
craftsmanService.getStaffDetail = (data) => {
  let url = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 + '/member/staff/staffInfo.json' : constant.apiUrl + '/account/staffInfo.json';
  return http.get(url, data)
}

// 查询员工评价
craftsmanService.getStaffCommentList = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/member/comment/app/queryAppCommenProductnList.json';
  return http.get(url, data)
}

module.exports = {
  craftsmanService: craftsmanService
}