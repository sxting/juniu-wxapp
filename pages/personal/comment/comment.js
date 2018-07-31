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
    showBigImg: false,
    bigImg: ''
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '我的评价',
    })
    getMyComment.call(this, this.data.pageNo, this.data.pageSize)
  },
  
  onImgItemClick(e) {
    let url = e.currentTarget.dataset.url;
    let img1 = url.replace(/71/, '375');
    this.setData({
      showBigImg: true,
      bigImg: img1.replace(/72/, '430')
    })
  },

  onBigImgClick() {
    this.setData({
      showBigImg: false,
      bigImg: ''
    })
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
        item.imagesUrlArr = [];
        if (item.imagesUrl) {
          item.imagesUrl.forEach(function(imgid) {
            item.imagesUrlArr.push(constant.OSS_IMAGE_URL + `${imgid}/resize_71_72/mode_fill`)
          })
        }
      });
      self.setData({
        userInfo: res.comments
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}