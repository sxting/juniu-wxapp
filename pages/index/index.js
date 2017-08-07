//index.js
//获取应用实例
import { constant } from '../../utils/constant'
import { errDialog, loading } from '../../utils/util'
import { indexService } from 'shared/index.service';
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    provinceName: '北京',
    region: ['广东省', '广州市', '海珠区'],
    webServeKey: '3e9b7b7b8d1511312c029f5bf45e1023',
    // 门店选择列表
    storeList: [],
    // 屏幕高度
    windowHeight: 0,
    pageNo: 0,
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
    try {
      wx.setStorageSync(constant.TOKEN, '27f3733b5daeb3d89a53b6c561f5c753')
    } catch (e) {
    }
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          windowHeight: res.windowHeight
        });
      }
    })
    getStoreListInfo.call(this);
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting['scope.userLocation']) {
                wx.getLocation({
                  type: 'wgs84',
                  success: function (res) {
                    var latitude = res.latitude
                    var longitude = res.longitude
                    var speed = res.speed
                    var accuracy = res.accuracy
                  }
                })
              }
            }
          })
        } else {
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
      }
    })

  },
  bindRegionChange: function (e) {
    let self = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    if (e.detail.value) {
      changeaddrToId.call(self, e.detail.value[0]);
      setTimeout(() => {
        changeaddrToId.call(self, e.detail.value[1]);
      }, 300);
      setTimeout(() => {
        changeaddrToId.call(self, e.detail.value[2], 'areaId');
      }, 650);
    }
    this.setData({
      provinceName: e.detail.value[0],
      region: e.detail.value
    });
  },
  /**搜索具体地址 */
  searchAddr: function (e) {
    console.log(e.detail.value)
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
        getStoreListInfo.call(self);
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
    merchantId: self.data.merchantId,
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