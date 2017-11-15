// pages/ticket/index/index.js
import { ticketService } from '../shared/ticket.service';
import { constant } from '../../../utils/constant';
import { errDialog } from '../../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    ticketList: [],
    storeId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          height: res.windowHeight
        })
      }
    });
    let storeId = wx.getStorageSync(constant.STORE_INFO);
    this.setData({
      storeId: storeId
    });
    getAllTicket.call(this, storeId);
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
  
  },
  goTicketDetail: function (e) {
    wx.navigateTo({
      url: '/pages/ticket/detail/detail?marketingId=' + e.currentTarget.dataset.marketingid,
    })
  },
  pageEventListener: function() {
    getAllTicket.call(this, this.data.storeId);
  }
})

// 获取全部的优惠券
function getAllTicket(storeId) {
  let self = this;
  ticketService.allCouponlist({
    storeId: storeId
  }).subscribe({
    next: res => {
      self.setData({
        ticketList: res
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}