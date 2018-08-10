
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
  },

  // 点击提交订单
  onSubmitClick() {

  }

})

// 订单提交
function orderSubmit() {
  let self = this;
  let data = {
    storeId: wx.getStorageSync(constant.STORE_INFO)
  }
  collageService.orderSubmit(data).subscribe({
    next: res => {
      
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}



