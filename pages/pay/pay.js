Page({
  data: {
    count: 1,
    showCardBuy: false,
    showPaySuccess: false,
  },

  onLoad: function (options) {
  
  },

  onCountLeftClick() {
    if(this.data.count == 1) {
      return
    };
    --this.data.count;
    this.setData({
      count: this.data.count
    })
  },

  onCountRightClick() {
    ++this.data.count;
    this.setData({
      count: this.data.count
    })
  },

  // 跳转到我的优惠券
  goMyCoupon() {
    wx.navigateTo({
      url: '/pages/personal/ticket/ticket',
    })
  },

  // 跳转到我的会员卡列表
  goMyCardS() {
    wx.navigateTo({
      url: '/',
    })
  },

  // 点击更多优惠
  onMoreRightsClick() {
    this.setData({
      showCardBuy: true
    })
  },

  // 点击关闭按钮
  onCloseCardClick() {
    this.setData({
      showCardBuy: false
    })
  },

  // 开通并付款
  onPayBtnClick() {
    this.setData({
      showPaySuccess: true
    })
  },

  // 确定
  onSuccessSureClick() {
    this.setData({
      showPaySuccess: false,
      showCardBuy: false
    })
  }



})