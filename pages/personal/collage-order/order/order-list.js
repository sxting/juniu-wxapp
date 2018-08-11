// pages/personal/collage-order/order/order-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['全部', '待付款', '待成团', '待消费', '已完成'],
    tabIndex: 0,
    status: '', // CLOSE 已取消， 
    productImg: '/asset/images/product.png'
 
  },

  onTabClick(e) {
    let index = e.currentTarget.dataset.index;
    let status = '';
    if (index == 1) {
      status = 'INIT'
    } else if (index == 2) {
      status = 'PAID'
    } else if (index == 3) {
      status = 'FINISH'
    } else {
      status = ''
    }
    this.setData({
      tabIndex: index,
      status: status
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})