// pages/personal/member-card/band/band.js
import { memberCardService } from '../shared/service';
import { errDialog, checkMobile } from '../../../../utils/util';
import { constant } from '../../../../utils/constant';
import { ticketService } from '../../../ticket/shared/ticket.service';
let wait = 60;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendMegLabel: '获取验证码',
    isDisabled: false,
    phoneNumber: null,
    remark: '',
    validCode: '',
    storeId: '',
    marketingid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '绑定会员卡',
    });
    this.setData(
      {
        storeId: wx.getStorageSync(constant.STORE_INFO),
        marketingid: options.marketingid ? options.marketingid: ''
      }
    )
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
  getMsgCode: function () {
    let phone = this.data.phoneNumber;
    let self = this;
    if (checkMobile(phone)) {
      memberCardService.getVaildCode({
        phone: phone,
        bizType: 'MEMBER_VALID'
      }).subscribe({
        next: res => {
          let changePhoneResult = phone.substring(0, 3)
            + '****'
            + phone.substring(phone.length - 4, phone.length);
          self.setData({
            remark: `验证码将发送到手机(${changePhoneResult}),请注意查收。`
          })
          time.call(self);
        },
        error: err => errDialog(err),
        complete: () => wx.hideToast()
      });
    } else {
      errDialog('请输入正确的手机号格式');
    }
  },
  getPhoneNumber: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  getValidCode: function (e) {
    this.setData({
      validCode: e.detail.value
    })
  },
  bindCard: function (e) {
    if (this.data.validCode) {
      bindMemberCard.call(this, this.data.storeId, this.data.phoneNumber, this.data.validCode);
    } else {
      errDialog('验证码不能为空');
    }
  }
})

// 领取优惠券
function reciveTicket() {
  let marketingId = this.data.marketingid;
  let storeId = wx.getStorageSync(constant.STORE_INFO);
  ticketService.receiveTicket({ marketingId: marketingId, storeId: storeId }).subscribe({
    next: res => {
      wx.showModal({
        title: '领取成功',
        content: '请到个中心我的优惠券中查看',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
//绑定会员卡
function bindMemberCard(storeId, phone, validCode) {
  let self = this;
  memberCardService.bindCard({
    storeId: storeId,
    phone: phone,
    validCode: validCode
  }).subscribe({
    next: res => {
      if (res.showClickBind === 'F') {
        if (self.data.marketingid) {
          reciveTicket.call(self)
        } else {
          wx.redirectTo({
            url: '/pages/personal/member-card/index/index',
          })
        }
      } 
      // if (res.showClickBind === 'T') {
      //   errDialog('未找到手机号相关的会员卡，请到店里办理')
      // } else if (self.data.marketingid) {
      //   reciveTicket.call(self)
      // } else {
      //   wx.redirectTo({
      //     url: '/pages/personal/member-card/index/index',
      //   })
      // }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}
/**
 * 发送验证码倒计时
 * @param o
 */
function time(o) {
  if (wait === 0) {
    this.setData({
      isDisabled: false,
      sendMegLabel: "获取验证码"
    });
    wait = 60;
  } else {
    this.setData({
      isDisabled: true,
      sendMegLabel: "重新发送(" + wait + ")"
    });
    wait--;
    setTimeout(() => {
      time.call(this);
    },
      1000);
  }
}
