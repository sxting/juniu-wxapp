import { craftsmanService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';
var app = getApp()
Page({
  data: {
    imgUrl: '/asset/images/head-portrait.png',
    starArr: [0,1,2,3,4],
    staffId: '',
    staffInfo: {},
    commentList: [],
    pageIndex: 1,
    pageSize: 10,
    countTotal: 1,
    storeId: '',
  },
  
  onLoad: function (options) {
    this.setData({
      staffId: options.staffId,
      storeId: options.storeId
    })
    getStaffDetail.call(this);
    getComments.call(this)
  },

  onScrollTolower: function () {
    if (this.data.pageIndex == this.data.countTotal) {
      return;
    }
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    getComments.call(this)
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
  let data = {
    pageIndex: this.data.pageIndex,
    pageSize: this.data.pageSize,
    storeId: this.data.storeId,
    ctraftsmanId: this.data.staffId
  }
  craftsmanService.getStaffCommentList(data).subscribe({
    next: res => {
      res.comments.forEach((item) => {
        let dateArray = item.juniuoModel.dateCreated.split(' ');
        item.date = dateArray[0];
        item.time = dateArray[1];
      });

      this.setData({
        commentList: res.comments,
        countTotal: res.pageInfo.countTotal
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}