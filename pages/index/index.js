//index.js
//获取应用实例
import { constant } from '../../utils/constant'
import { errDialog, loading } from '../../utils/util'
import { indexService } from 'shared/index.service';
import { service } from '../../service';
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    provinceName: '北京市',
    region: ['北京市', '北京市', '东城区'],
    webServeKey: '3e9b7b7b8d1511312c029f5bf45e1023',
    // 门店选择列表
    storeList: [],
    // 屏幕高度
    windowHeight: 0,
    pageNo: 1,
    pageSize: 10,
    merchantId: '',
    address: '',
    provinceId: '',
    cityId: '',
    areaId: ''
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    let self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          windowHeight: res.windowHeight
        });
      }
    })
    let token = wx.getStorageSync(constant.TOKEN);
    wx.login({
      success: function (result) {
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
            let appId = 'wx3bb038494cd68262';
            if (result.code) {
              logIn.call(self, result.code, extConfig.theAppid ? extConfig.theAppid : appId, res.rawData);
            } else {
              console.log('获取用户登录态失败！' + result.errMsg)
            }
          }
        });
      },
      fail: function (res) { },
      complete: function (res) { },
    });
  },
  bindRegionChange: function (e) {
    let self = this;
    self.setData({
      provinceId: '',
      cityId: '',
      areaId: ''
    });
    if (e.detail.value) {
      changeaddrToId.call(self, e.detail.value[0]);
      setTimeout(() => {
        changeaddrToId.call(self, e.detail.value[1]);
      }, 300);
      setTimeout(() => {
        changeaddrToId.call(self, e.detail.value[2], 'areaId');
      }, 650);
      setTimeout(() => {
        getStoreListInfo.call(self);
      }, 900);
    }
    this.setData({
      provinceName: e.detail.value[0],
      region: e.detail.value
    });
  },
  /**搜索具体地址 */
  searchAddr: function (e) {
    this.setData({
      address: e.detail.value
    });
    getStoreListInfo.call(this);
  },
  routerToStoreIndex: function (e) {
    wx.redirectTo({
      url: '/pages/home/home?storeid=' + e.currentTarget.dataset.storeid
    });
  }
})

/**城市转id */
function changeaddrToId(address, areaId) {
  let self = this;
  indexService.nameToId({ address: address }).subscribe({
    next: res => {
      res.forEach((item) => {
        if (item.level === '1') {
          self.setData({
            provinceId: item.id
          });
        } else if (item.level === '2') {
          if (areaId === 'areaId') {
            self.setData({
              areaId: item.id
            });
          } else {
            self.setData({
              cityId: item.id
            });
          }
        } else if (item.level === '3') {
          self.setData({
            areaId: item.id
          });
        }
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });

}

/**获取门店列表 */
function getStoreListInfo() {
  let self = this;
  let shopQuery = {
    pageNo: self.data.pageNo,
    pageSize: self.data.pageSize,
    merchantId: '1500022449722218063731',
  
    // merchantId: wx.getStorageSync(constant.MERCHANTID),
    address: self.data.address,
    provinceId: self.data.provinceId,
    cityId: self.data.cityId,
    areaId: self.data.areaId
  };
  indexService.getStoreList(shopQuery).subscribe({
    next: res => {
      this.setData({
        storeList: res.content
      })
      console.log(res)
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}

/**获取城市id */
function getDistrictInfo(key, loc) {
  indexService.getDistrict().subscribe({
    next: res => {
      console.log(res);
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

/**经纬度转地址 */
function tencentLongAndLatiToAddress(latitude, longitude) {
  let self = this;
  indexService.TencentLongAndLatiToAddress({
    longitude: longitude,
    latitude: latitude
  }).subscribe({
    next: res => {
      self.setData({
        region: [res.province, res.city, res.district],
        provinceName: res.province
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

function logIn(code, appid, rawData) {
  let self = this;
  service.logIn({ code: code, appid: appid, rawData: rawData }).subscribe({
    next: res => {
      // 1505274961239211095369
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
      wx.setStorageSync(constant.MERCHANTID, extConfig.theAppid ? res.merchantId : '1505100477335167136848');
      wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg)
      wx.setStorage({
        key: constant.TOKEN,
        data: res.juniuToken,
        success: function (res) {
          getStoreListInfo.call(self);
          // 获取当前地理位置
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              tencentLongAndLatiToAddress.call(self, res.latitude, res.longitude);
              var latitude = res.latitude
              var longitude = res.longitude
              var speed = res.speed
              var accuracy = res.accuracy
            }
          })
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
