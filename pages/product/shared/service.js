import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let productService = {};

let apiUrl = constant.apiUrl + '/product';
let apiUrl2 = constant.apiUrl + '/member'

// 获取预约手艺人商品
productService.getStaffProduct = (data) => {
  let url = constant.apiUrl + '/product/product/staff.json';
  return http.get(url, data)
}

// 获取预约商品列表
productService.getReserveProduct = (data) => {
  let url = constant.apiUrl + '/product/app/findProductByIds.json';
  return http.get(url, data)
}

// 获取商品列表
productService.getProductList = (data) => {
  let url = constant.apiUrl + '/product/list.json';
  return http.get(url, data)
}

// 获取商品详情
productService.getProductDetail = (data) => {
  let url = constant.apiUrl + '/product/app/productinfo.json';
  return http.get(url, data)
}

// 获取商品评价列表
productService.getProductCommentList = (data) => {
  let url = constant.apiUrl + '/member/comment/app/queryAppCommenProductnList.json';
  return http.get(url, data)
} 

// GET /app/categoryList.json
productService.getProdTypeList = (data) => {
  let url = constant.apiUrl + '/product/app/categoryList.json';
  return http.get(url, data)
}
module.exports = {
  productService: productService
}