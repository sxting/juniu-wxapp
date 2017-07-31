//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    productImages: [
      { url: '/asset/images/personal-bg.png'},
      { url: '/asset/images/head-portrait.png'}
    ]
  },
  onLoad: function () {
   
  },
  // 跳转到店铺页面
  goShopPage: function() {
    wx.navigateTo({
      url: '/pages/shop/shop'
    })
  },

  // 跳转到个人中心
  goPersonalPage: function() {
    wx.navigateTo({
      url: '/pages/personal/index/index',
    })
  },

  // 跳转到我的预约
  goMyAppointment: function() {
    wx.navigateTo({
      url: '/pages/personal/appointment/appointment',
    })
  },

  // 跳转到服务项目列表
  goProductPage: function() {
    wx.navigateTo({
      url: '/pages/product/select/select',
    })
  },

  // 跳转到手艺人列表
  goCraftsmanPage: function() {
    wx.navigateTo({
      url: '/pages/craftsman/select/select',
    })
  },

  // 跳转到全部评价列表
  goCommentPage: function() {
    wx.navigateTo({
      url: '/pages/comment/list/list',
    })
  },

  // 跳转到买单页面
  goPayPage: function() {
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  },

  // 跳转到线上预约页面
  goOrderPage: function() {
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },
})
