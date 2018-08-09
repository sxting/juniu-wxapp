
Page({
  data: {
    jnImg: '/asset/images/product.png',
    data: ''
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '提交订单',
    })
    this.setData({
      data: options
    })
    console.log(options);
  },

  // 点击提交订单
  onSubmitClick() {

  }

})



