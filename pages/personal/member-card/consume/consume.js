// pages/personal/member-card/consume/consume.js
import { memberCardService } from '../shared/service';
import { errDialog, checkMobile } from '../../../../utils/util';
import { constant } from '../../../../utils/constant';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardId: '',
    storeId: '',
    balance: 0,
    cardType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消费记录',
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#FF6400',
    })
    this.setData({
      cardId: options.cardId,
      storeId: wx.getStorageSync(constant.STORE_INFO),
      cardType: options.cardType
    })
    getConsume.call(this, this.data.cardId, this.data.storeId, 1 ,10)
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})

// 获取消费记录
function getConsume(cardId, storeId, pageIndex, pageSize) {
  let self = this;
  memberCardService.consumeRecord({
    cardId: cardId,
    pageIndex: pageIndex,
    pageSize: pageSize
  }).subscribe({
    next: res => {
      self.setData({
        balance: res.balance
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}