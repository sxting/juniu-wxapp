//获取应用实例
import { personalService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';
import { constant } from '../../../utils/constant'

var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: [],
    pageNo: 1,
    pageSize: 100,
  },
  onLoad: function () {
    getMyComment.call(this, this.data.pageNo, this.data.pageSize)
  }
})


function getMyComment(pageNo, pageSize) {
  let self = this;
  personalService.myComment({
    pageIndex: pageNo,
    pageSize: pageSize,
    storeId: wx.getStorageSync(constant.STORE_INFO)
  }).subscribe({
    next: res => {
      res.comments.forEach((item) => {
        let dateArray = item.juniuoModel.dateCreated.split(' ');
        item.date = dateArray[0];
        item.time = dateArray[1];
      });
      self.setData({
        userInfo: res.comments
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}