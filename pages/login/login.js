import { service } from '../../service';
import { errDialog, loading } from '../../utils/util';
import { constant } from '../../utils/constant';

var app = getApp()
Page({
  data: {
    showBox: false,
    page: '/pages/home/home',
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '登录授权',
    })
    wx.showLoading({
      title: '加载中',
    })
    let self = this;
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        console.log(res.authSetting['scope.userInfo']);
        if (res.authSetting['scope.userInfo']) {
          console.log(res.authSetting['scope.userInfo']);

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
    console.log(options);
    
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
      console.log(res)
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
          console.log(res.juniuToken);
          // wx.redirectTo({
          //   url: "plugin://myPlugin/kanjia-product-detail?type=share&storeId=" + self.data.storeId + "&orderNo=" + self.data.orderNo + "&activityId=" + self.data.activityId + "&token=" + res.juniuToken,
          // })
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}