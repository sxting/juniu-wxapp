// pages/personal/member-card/show/show.js
import { constant } from '../../../../utils/constant';
var wxbarcode = require('../../../../utils/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '100',
    phone: '',
    appLogo: '',
    screenWidth: '',
    barWidth: 0,
    barcode: ''
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
      title: '条形码',
    });

    // wxbarcode.barcode('barcode', options.phone, 390, 150);

    var res = wx.getSystemInfoSync();
    this.setData({
      height: res.windowHeight,
      phone: options.phone,
      screenWidth: res.windowWidth,
      appLogo: wx.getStorageSync(constant.CARD_LOGO),
      barcode: `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${options.barCode}/resize_187_100/mode_fill`   
    })
    console.log(this.data.barcode);
    if (res.windowWidth > 320) {
      this.setData({
        barWidth: res.windowWidth /4
      })
    } else {
      this.setData({
        barWidth: res.windowWidth / 4
      })
    }
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