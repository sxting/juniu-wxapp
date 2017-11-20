//获取应用实例
import { commentService } from '../shared/comment.service';
import { errDialog, loading } from '../../../utils/util';
import { constant } from '../../../utils/constant'
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
  routerCommentDetail: function (e) {
    wx.redirectTo({
      url: '/pages/comment/detail/detail?commentid=' + e.currentTarget.dataset.commentid,
    })
  },

  // 跳转到写评价页面
  goMakingComment: function () {
    wx.redirectTo({
      url: '/pages/comment/making/making',
    })
  },
  previewImg: function(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.img],
    })
  }
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
        if (item.imagesUrl) {
          item.imagesUrl.forEach((img, index) => {
            item.imagesUrl[index] = constant.OSS_IMAGE_URL + `${img}/resize_80_80/mode_fill`;
          });
        }
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