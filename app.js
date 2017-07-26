//app.js
App({
<<<<<<< HEAD
  onLaunch: function() {
=======
  onLaunch: function () {
>>>>>>> 0af21f166290c694dfbc9ce8025f7fe806d9fbf4
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
<<<<<<< HEAD

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
=======
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
>>>>>>> 0af21f166290c694dfbc9ce8025f7fe806d9fbf4
        }
      })
    }
  },
<<<<<<< HEAD

  globalData: {
    userInfo: null
  }
})
=======
  globalData:{
    userInfo:null
  }
})
>>>>>>> 0af21f166290c694dfbc9ce8025f7fe806d9fbf4
