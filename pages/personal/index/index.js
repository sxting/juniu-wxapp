var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
 
  onLoad: function () {
    console.log(app.globalData.userInfo)
  },

  //跳转到我的预约页面 
  goMyAppointment: function() {
    wx.navigateTo({
      url: '/pages/personal/appointment/appointment',
    })
  },

  // 跳转到我的评价页面
  goMyComment: function() {
    wx.navigateTo({
      url: '/pages/personal/comment/comment',
    })
  },

  // 返回首页
  goHome: function() {
    wx.redirectTo({
      url: '/pages/home/home',
    })
  }
})