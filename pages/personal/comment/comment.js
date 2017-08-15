//获取应用实例
import { personalService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';
import { constant } from '../../../utils/constant'

var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    pageNo: 1,
    pageSize: 100,
  },
  onLoad: function () {
    getMyComment.call(this, this.data.pageNo, this.data.pageSize)
  }
})


function getMyComment(pageNo, pageSize) {
  personalService.myComment({
    pageIndex: pageNo,
    pageSize: pageSize,
    storeId: wx.getStorageSync(constant.STORE_INFO)
  }).subscribe({
    next: res => {
      console.log(res)
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}