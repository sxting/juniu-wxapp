// pages/personal/member-card/band/band.js
import { memberCardService } from '../shared/service';
import { errDialog, checkMobile } from '../../../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendMegLabel: '获取验证码',
    isDisabled: false,
    phoneNumber: null,
    remark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '绑定会员卡',
    })
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
          phone.setData({
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
  }
})

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
