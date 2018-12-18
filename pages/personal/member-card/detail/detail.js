// pages/personal/member-card/detail/detail.js
import { memberCardService } from '../shared/service';
import { errDialog, checkMobile } from '../../../../utils/util';
import { constant } from '../../../../utils/constant';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '100',
    cardId: '',
    privilegeNote: '',
    useNote: '',
    mobie: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var res = wx.getSystemInfoSync();
    this.setData({
      height: res.windowHeight,
      cardId: options.cardId
    })
    wx.setNavigationBarTitle({
      title: '会员卡详情',
    });
    let storeId = wx.getStorageSync(constant.STORE_INFO);
    getCardInfo.call(this, this.data.cardId);
    getStoreInfo.call(this, storeId);
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

function getStoreInfo(storeId) {
  let self = this;
  memberCardService.getStoreInfo({
    storeId: storeId
  }).subscribe({
    next: res => {
      self.setData({
        mobie: res.mobile
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}

function getCardInfo(cardId) {
  let self = this;
  memberCardService.cardInfo({
    cardId: cardId
  }).subscribe({
    next: res => {
      self.setData({
        useNote: res.useNote,
        privilegeNote: res.privilegeNote
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}