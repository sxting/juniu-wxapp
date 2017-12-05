// pages/ticket/detail/detail.js
import { ticketService } from '../shared/ticket.service';
import { errDialog } from '../../../utils/util';
import { constant } from '../../../utils/constant';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    marketingId: '',
    ticket: {
      useLimitMoney: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      marketingId: options.marketingId
    });
    getTicketDetail.call(this, this.data.marketingId);
  },
  pageEventListener: function() {
    getTicketDetail.call(this, this.data.marketingId);
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
  reciveTicket: function (e) {
    let self = this;
    let marketingId = e.currentTarget.dataset.marketingid;
    ticketService.receiveTicket({ marketingId: marketingId }).subscribe({
      next: res => {
        wx.showModal({
          title: '领取成功',
          content: '请到个中心我的优惠券中查看',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              getTicketDetail.call(self, self.data.marketingId);
            }
          }
        })
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  }
})

// 获取卡券详情
function getTicketDetail(marketingId) {
  let self = this;
  ticketService.getDetail({
    marketingId: marketingId
  }).subscribe({
    next: res => {
      // res.validDateEnd = res.validDateEnd.spli
      res.picUrl =
        constant.OSS_IMAGE_URL + `${res.picUrl}/resize_78_58/mode_fill`;
      self.setData({
        ticket: res
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}