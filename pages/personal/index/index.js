var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
 
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    });
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('storeName'),
    })
  },

  // 跳转到我的订单
  goMyOrderForm() {
    wx.navigateTo({
      url: '/pages/personal/order-form/order-form',
    })
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

  goMyMemberCard: function() {
    wx.navigateTo({
      url: '/pages/personal/member-card/index/index',
    })
  },
  goMyTicket: function() {
    wx.navigateTo({
      url: '/pages/personal/ticket/ticket',
    })
  }
})