//获取应用实例
import { commentService } from '../shared/comment.service';
import { errDialog, loading } from '../../../utils/util'

var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    pageIndex: 1,
    pageSize: 10,
    storeId: "",
    comments: {},
    countTotal: 0
  },
  onLoad: function (options) {
    this.setData({
      storeId: options.storeId
    });
    commentList.call(this, this.data.pageIndex, this.data.pageSize, this.data.storeId);
  },

  onShow: function () {

  },

  // 跳转到写评价页面
  goMakingComment: function () {
    wx.navigateTo({
      url: '/pages/comment/making/making',
    })
  },
})

// 评论列表
function commentList(pageIndex, pageSize, storeId) {
  let self = this;
  commentService.queryCommentList({
    pageIndex: pageIndex,
    pageSize: pageSize,
    storeId: storeId
  }).subscribe({
    next: res => {
      res.comments.forEach((item) => {
        let dateArray = item.juniuoModel.dateCreated.split(' ');
        item.date = dateArray[0];
        item.time = dateArray[1];
      });
      self.setData({
        comments: res.comments,
        countTotal: res.pageInfo.countTotal
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}