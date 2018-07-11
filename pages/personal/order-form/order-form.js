// order-form.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['全部', '待付款', '待消费', '已完成'],
    tabIndex: 0
  },

  onLoad: function (options) {
  
  },

  onTabClick(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
  },

  onItemClick() {
    wx.navigateTo({
      url: '/pages/personal/order-form-detail/order-form-detail',
    })
  },

  onCommentClick: function (e) {
    wx.navigateTo({
      url: '/pages/comment/making/making?productId=' + e.currentTarget.dataset.productId,
    })
  }
  
})