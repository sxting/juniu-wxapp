import { service } from '../../../service';
import { errDialog, loading } from '../../../utils/util';
import { constant } from '../../../utils/constant';

var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    userIsBind: false,
    TPLID: constant.TPLID,
    phone: ''
  },
 
  onLoad: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#FF6400',
    })
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('storeName'),
    })
    let self = this;

    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        self.setData({
          userInfo: res.userInfo
        });
      }
    })
  },

  onShow() {
    service.userIsBind().subscribe({
      next: res => {
        this.setData({
          userIsBind: res.isBind,
          phone: res.phone
        })
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },

  // 点击绑定手机号
  onBandPhoneClick() {
    wx.navigateTo({
      url: '/pages/personal/member-card/band/band?from=personal',
    })
  },

  goMyCollageOrder() {
    wx.navigateTo({
      url: '/pages/personal/collage-order/order/order-list',
    })
  },

  // 跳转到我的订单
  goMyOrderForm() {
    wx.navigateTo({
      url: '/pages/personal/order-form/order-form',
    })
  },

  goMyBand() {
    wx.navigateTo({
      url: '/pages/personal/member-card/band/band',
    })
  },

  goMyBarginOrder(){
    wx.navigateTo({
      url: `plugin://myPlugin/order-list`
    })
  },

  //跳转到我的预约页面 
  goMyAppointment: function() {
    wx.navigateTo({
      url: '/pages/personal/appointment/appointment',
    })
  },

  // 跳转到我的评价页面
  goMyComment: function() {
    wx.navigateTo({
      url: '/pages/personal/comment/comment',
    })
  },

  goMyMemberCard: function() {
    wx.navigateTo({
      url: '/pages/personal/member-card/list/list',
    })
  },
  goMyTicket: function() {
    wx.navigateTo({
      url: '/pages/personal/ticket/ticket',
    })
  }
})