import { constant } from '../../../../utils/constant';
import { service } from '../../../../service';
import { shopService } from '../../shared/shop.service.js'
import { errDialog, workDataFun } from '../../../../utils/util';

Page({
  data: {
    storeId: wx.getStorageSync(constant.STORE_INFO),
    getUserInfo: true,
    bigImage: '/asset/images/pintuan_head1.jpg',
    worksList: [],
    imageWidth: 168,
    showVideo: false,
    src: '',
    productionId: '', 
    title: ''   
  },
  
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '视频详情',
    })
    this.setData({
      productionId: options.productionId,
      storeId: wx.getStorageSync(constant.STORE_INFO)
    })
    this.videoCtx = wx.createVideoContext('myVideo');
    if (options.type && options.type === 'share') {
      this.setData({
        storeId: options.storeId
      })
      let self = this;
      wx.login({
        success: function (result) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              self.setData({
                getUserInfo: true
              })
              let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
              let appId = 'wxedcf0f0c4cc429c8';
              if (result.code) {
                logIn.call(self, result.code, extConfig.theAppid ? extConfig.theAppid : appId, res.rawData);
              } else {
                console.log('获取用户登录态失败！' + result.errMsg)
              }
            },
            fail: function () {
              self.setData({
                getUserInfo: false
              })
            }
          });
        },
        fail: function (res) {
          self.setData({
            getUserInfo: false
          })
        },
        complete: function (res) { },
      });
    } else {
      getData.call(this);
    }
  },

  showVideo() {
    let data = {
      videoId: this.data.bigImage.sourceId.split(',')[1]
    }
    shopService.getVideoUrlById(data).subscribe({
      next: res => {
        this.setData({
          showVideo: true,
          src: res
        })
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },

  closeVideo() {
    this.setData({
      showVideo: false
    })
  },

  stopEvent() {},

  //授权 
  bindgetuserinfo(e) {
    let self = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.login({
        success: function (result) {
          self.setData({
            getUserInfo: true
          })
          let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
          let appId = 'wxedcf0f0c4cc429c8';
          console.log(result.code);
          if (result.code) {
            logIn.call(self, result.code, extConfig.theAppid ? extConfig.theAppid : appId, e.detail.rawData);
          } else {
            console.log('获取用户登录态失败！' + result.errMsg)
          }
        },
        fail: function (res) {
          self.setData({
            getUserInfo: false
          })
        },
        complete: function (res) { },
      });
    }
  },

  //分享 
  onShareAppMessage: function (res) {
    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/shop/video/detail/detail?type=share&productionId=' + this.data.productionId + '&storeId=' + this.data.storeId,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    }
  },

  /*点击其他作品*/
  onOtherWorkItemClick(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      productionId: item.productionId
    });
    if (item.sourceType === "VIDEO") {
      getData.call(this);
    } else {
      wx.redirectTo({
        url: '/pages/shop/image/detail/detail?productionId=' + item.productionId
      })
    }
  } 

})

function getData() {
  let data = {
    productionId: this.data.productionId
  }
  let self = this;
  shopService.getStaffProductionDetail(data).subscribe({
    next: res => {
      this.setData({
        worksList: workDataFun(res.other, self.data.imageWidth),
        title: res.production.title
      })
      let imageList = []
      res.production.merchantMediaDTOS.forEach(function (item, i) {
        imageList.push({
          url: constant.OSS_IMAGE_URL + `${item.sourceId.split(',')[0]}/resize_345_200/mode_fill`,
          index: i,
          sourceId: item.sourceId
        })
      })

      this.setData({
        bigImage: imageList[0]
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

function logIn(code, appid, rawData) {
  let self = this;
  service.logIn({ code: code, appid: appid, rawData: rawData, tplid: constant.TPLID }).subscribe({
    next: res => {
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
      wx.setStorageSync(constant.MERCHANTID, res.merchantId ? res.merchantId : '153179997107784038184');
      wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg);
      wx.setStorageSync(constant.sessionKey, res.sessionKey);
      wx.setStorageSync(constant.USER_ID, res.userId);
      wx.setStorageSync(constant.STORE_INFO, this.data.storeId);

      if (res.ver == '2') {
        wx.setStorageSync(constant.VER, 2);
      } else {
        wx.setStorageSync(constant.VER, 1);
      }

      wx.setStorage({
        key: constant.TOKEN,
        data: res.juniuToken,
        success: function (res) {
          getData.call(self)
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}