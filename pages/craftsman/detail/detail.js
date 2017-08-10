import { craftsmanService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';
var app = getApp()
Page({
  data: {
    imgUrl: '/asset/images/head-portrait.png',
    starArr: [0,1,2,3,4],
    staffId: '',
    staffInfo: {}
  },
  onLoad: function (options) {
    this.setData({
      staffId: options.staffId
    })
    getStaffDetail.call(this)
  }
})

// 查询员工详情
function getStaffDetail() {
  let data = {
    staffId: this.data.staffId
  }
  craftsmanService.getStaffDetail(data).subscribe({
    next: res => {
      this.setData({
        staffInfo: res
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 查询员工评论列表
function getComments() {

}