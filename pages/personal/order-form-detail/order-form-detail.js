// order-form-detail.js
Page({
  data: {
    storeName: wx.getStorageSync('storeName'),
    status: 2, //待付款1，待消费2，已完成（已消费3，支付超时4，已退款5）
  },

  onLoad: function (options) {
  
  },

  // 申请退款 
  goRefund() {
    wx.navigateTo({
      url: '/pages/personal/refund/refund',
    })
  }

})