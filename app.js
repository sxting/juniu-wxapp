//app.js
import { service } from 'service';
import { errDialog, loading } from 'utils/util';
import { constant } from 'utils/constant';


App({
  onShow: function() {
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      updateManager.applyUpdate()
    })
  },
  onLaunch: function (options) {
    let appId = 'wx3bb038494cd68262';
    let self = this;
    if (this.globalData.scene) {
      this.globalData.scene = options.scene;
    } else {
      this.globalData.scene = options.scene;
    }
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        self.globalData.userInfo = res.userInfo;
        wx.login({
          success: function (result) {
            let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
            if (result.code) {
              // logIn.call(self, result.code, extConfig.theAppid ? extConfig.theAppid :appId, res.rawData);
            } else {
              console.log('获取用户登录态失败！' + result.errMsg)
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        });
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          console.log(res)
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    merchantId: '1498644115879207297302',
    appId: 'wx3bb038494cd68262',
    scene: 0
  }
})
/**登录 */
function logIn(code, appid, rawData) {
  service.logIn({ code: code, appid: appid, rawData: rawData }).subscribe({
    next: res => {
      try {
        wx.removeStorageSync(constant.TOKEN);
        wx.setStorageSync(constant.TOKEN, res.juniuToken);
        wx.setStorageSync(constant.MERCHANTID, res.merchantId);
        wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg)
      } catch (e) {
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
