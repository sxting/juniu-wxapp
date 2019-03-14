import { service } from '../../service';
import { errDialog, loading } from '../../utils/util';
import { constant } from '../../utils/constant';

var app = getApp()
Page({
  data: {
    showBox: false,
    page: '/pages/home/home',
    options: {}
  },

  onLoad: function (options) {
    console.log(options);
    this.setData({
      page: options.page ? options.page : '/pages/home/home',
      options: options
    })
    wx.setNavigationBarTitle({
      title: '登录授权',
    })
    wx.showLoading({
      title: '加载中',
    })
    let self = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.login({
            success: function (result) {
              wx.getUserInfo({
                success: res => {
                  logIn.call(self,result.code, res.rawData);
                },
                fail: () => {
                  self.setData({
                    showBox: true
                  })
                }
              })
            }
          });
        } else {
          wx.hideLoading();
          self.setData({
            showBox: true
          })
        }
      }
    })    
  },

  bindgetuserinfo(e) {
    let self = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.login({
        success: function (result) {
          if (result.code) {
            logIn.call(self, result.code, e.detail.rawData);
          } else {
            console.log('获取用户登录态失败！' + result.errMsg)
          }
        },
        fail: function (res) {},
        complete: function (res) { },
      });
    }
  },
})

function logIn(code, rawData) {
  let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
  let appid = extConfig.theAppid ? extConfig.theAppid : 'wxedcf0f0c4cc429c8';

  let self = this;
  service.logIn({ code: code, appid: appid, rawData: rawData, tplid: constant.TPLID }).subscribe({
    next: res => {
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
      wx.setStorageSync(constant.MERCHANTID, res.merchantId ? res.merchantId : '153179997107784038184');
      wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg);
      wx.setStorageSync(constant.sessionKey, res.sessionKey);
      wx.setStorageSync(constant.USER_ID, res.userId);
      wx.setStorageSync(constant.OPEN_ID, res.openid);
      wx.setStorageSync(constant.VER, 2);

      wx.setStorage({
        key: constant.TOKEN,
        data: res.juniuToken,
        success: function (result) {
          let str = '';
          for(let key in self.data.options) {
            str += `&${key}=${self.data.options[key]}`
          }
          str = str.substring(1);
          console.log(self.data.page.indexOf('plugin://'))
          if (self.data.page.indexOf('plugin://') > -1) {
            wx.reLaunch({
              url: `${self.data.page}?${str}&token=${res.juniuToken}`,
            })
          } else {
            wx.reLaunch({
              url: `${self.data.page}?${str}`,
            })
          }
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}