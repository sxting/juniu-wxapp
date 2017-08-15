// pages/personal/comment/detail/detail.js
import { commentService } from '../shared/comment.service';
import { errDialog, loading } from '../../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getCommentDetail.call(this, options.commentid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})

// 评论详情
function getCommentDetail(commentId) {
  let self = this;
  commentService.queryCommentDetail({ commentId: commentId}).subscribe({
    next: res => {
      let dateArray = res.juniuoModel.dateCreated.split(' ');
      res.date = dateArray[0];
      res.time = dateArray[1];
      self.setData({
        detail: res
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}