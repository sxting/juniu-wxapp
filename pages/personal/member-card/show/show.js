// pages/personal/member-card/show/show.js
import { barcode } from '../../../../utils/util';
import { constant } from '../../../../utils/constant';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '100',
    phone: '',
    appLogo: '',
    screenWidth: '',
    barWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#EFC849',
    })
    wx.setNavigationBarTitle({
      title: '会员卡号',
    });
    var res = wx.getSystemInfoSync();
    this.setData({
      height: res.windowHeight,
      phone: options.phone,
      screenWidth: res.windowWidth,
      appLogo: wx.getStorageSync(constant.CARD_LOGO)
    })
    if (res.windowWidth > 320) {
      this.setData({
        barWidth: 125
      })
    } else {
      this.setData({
        barWidth: 150
      })
    }
    barcode('barcode', this.data.phone, this.data.screenWidth, 120);
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