var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  onLoad: function () {
    
  },

  //提交评价 
  commit: function() {
    wx.navigateBack({
      delta: 1
    })
  },
})