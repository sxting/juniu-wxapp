//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  onLoad: function () {
    
  },

  onShow: function() {

  },

  // 跳转到写评价页面
  goMakingComment: function() {
    wx.navigateTo({
      url: '/pages/comment/making/making',
    })
  },
})