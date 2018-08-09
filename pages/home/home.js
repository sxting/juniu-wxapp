//index.js
//获取应用实例
import { homeService } from 'shared/home.service';
import { errDialog, loading } from '../../utils/util'
import { constant } from '../../utils/constant';
import { ticketService } from '../ticket/shared/ticket.service';
import { service } from '../../service';
import { indexService } from '../index/shared/index.service';

// MONEY，DISCOUNT，GIFT
var app = getApp()
Page({
  data: {
    productImages: [
    ],
    storeId: '',
    storeName: '',
    scene: 0,
    storeInfo: {},
    fromNeighbourhood: false,
    ticketList: [],
    juniuImg: '/asset/images/product.png',
    showSearchMoreTicket: true,
    storeAddress: '',
    tel: '',
    latitude: '',
    longitude: '',
    home: true,
    isOnLoad: false,
    getUserInfo: true,
  },
  onShow() {
    if (this.data.isOnLoad) {
      let self = this;
      homeService.ticketList({
        storeId: wx.getStorageSync(constant.STORE_INFO)
      }).subscribe({
        next: res => {
          res.forEach((item) => {
            item.ticketSwitch = 'CLOSE';
            if (item.disabledWeekDate) {
              let disabledWeekDateArr = item.disabledWeekDate.split(',');
              item.selectedWeek1 = weekText.call(self, disabledWeekDateArr[0]);
              item.selectedWeek2 = weekText.call(self, disabledWeekDateArr[disabledWeekDateArr.length - 1]);
              item.unUseStartTime = (new Date(item.disabledTimeStart).getHours().toString().length < 2 ? ('0' + new Date(item.disabledTimeStart).getHours()) : new Date(item.disabledTimeStart).getHours()) + ':' +
                (new Date(item.disabledTimeStart).getMinutes().toString().length < 2 ? ('0' + new Date(item.disabledTimeStart).getMinutes()) : new Date(item.disabledTimeStart).getMinutes());
              item.unUseEndTime = (new Date(item.disabledTimeEnd).getHours().toString().length < 2 ? ('0' + new Date(item.disabledTimeEnd).getHours()) : new Date(item.disabledTimeEnd).getHours()) + ':' +
                (new Date(item.disabledTimeEnd).getMinutes().toString().length < 2 ? ('0' + new Date(item.disabledTimeEnd).getMinutes()) : new Date(item.disabledTimeEnd).getMinutes());
            }
          });
          self.setData({
            ticketList: res
          })
        },
        complete: () => wx.hideToast()
      })
    }
  },

  onLoad: function (option) {
    this.setData({
      storeId: option.storeid ? option.storeid : wx.getStorageSync(constant.STORE_INFO),
      scene: app.globalData.scene
    });
    if (this.data.scene === 1026) {
      this.setData({
        fromNeighbourhood: true
      })
    }
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
            let appId = 'wx3bb038494cd68262';
            console.log(result.code);
            if (result.code) {
              logIn.call(self, result.code, extConfig.theAppid ? extConfig.theAppid : appId, res.rawData);
            } else {
              console.log('获取用户登录态失败！' + result.errMsg)
            }
          },
          fail: function() {
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
  },


  bindgetuserinfo(e) {
    let self = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.login({
        success: function (result) {
          self.setData({
            getUserInfo: true
          })
          let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
          let appId = 'wx3bb038494cd68262';
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

  onHide() {
    this.setData({
      home: true
    })
  },

  // 转发
  onShareAppMessage: function(res) {
    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/home/home?storeid=' + this.data.storeId + '&merchantId=' + wx.getStorageSync(constant.MERCHANTID),
      success: function (res) {
        // 转发成功
        console.log(res);
      },
      fail: function (res) {
        // 转发失败
        console.log(res);
      }
    }
  },

  //跳转到门店选择页面
  goStoreIndex() {
    let self = this;
    this.setData({
      home: false
    })
    getStoreListInfo.call(self);
    // 获取当前地理位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        tencentLongAndLatiToAddress.call(self, res.latitude, res.longitude);
      }
    })
  },

  // 改变地址所在区域
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

  /**点击搜索 搜索具体地址 */
  searchAddr: function (e) {
    this.setData({
      address: e.detail.value
    });
    getStoreListInfo.call(this);
  },

  // 切换门店
  routerToStoreIndex: function (e) {
    let self = this;
    let storeId = e.currentTarget.dataset.storeid;
    wx.setStorageSync(constant.STORE_INFO, storeId);
    wx.setStorageSync('storeName', e.currentTarget.dataset.storename);
    self.setData({
      home: true,
      storeId: storeId
    });
    getStoreIndexInfo.call(self, storeId, wx.getStorageSync(constant.MERCHANTID) );
    getTicketInfo.call(self, storeId);
    getStoreInfo.call(self, storeId);
  },

  // 唤起地图
  onAddressClick: function () {
    let self = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (result) {
        var latitude = self.data.latitude
        var longitude = self.data.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: wx.getStorageSync('storeName'),
          address: self.data.address,
          scale: 14
        })

      }
    })
  },

  // 拨打电话
  onTelClick() {
    let self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.tel 
    })
  },

  // 跳转到服务项目列表
  goProductPage: function () {
    wx.navigateTo({
      url: '/pages/product/select/select?storeId=' + this.data.storeId,
    })
  },

  // 跳转到手艺人列表
  goCraftsmanPage: function () {
    wx.navigateTo({
      url: '/pages/craftsman/select/select?storeId=' + this.data.storeId,
    })
  },

  // 跳转到手艺人详情
  goStaffDetail: function (e) {
    wx.navigateTo({
      url: '/pages/craftsman/detail/detail?staffId=' + e.currentTarget.dataset.staffid + '&storeId=' + this.data.storeId,
    })
  },
  // 跳转到服务项目详情
  goProductDetail: function (e) {
    wx.navigateTo({
      url: '/pages/product/detail/detail?productId=' + e.currentTarget.dataset.productid + '&storeId=' + this.data.storeId,
    })
  },
  imgError: function (event) {
    this.data.productImages.forEach((item) => {
      if (event.detail.errMsg.indexOf(item.picUrl) > 0) {
        if (item.picUrl.indexOf('_750x360') > 0) {
          item.picUrl = item.picUrl.split('_750x360')[0] + '.' + 'png';
        }
      }
    });
    this.setData({
      productImages: this.data.productImages
    })
  },
  
  // 领取优惠券
  reciveTicket: function (e) {
    let self = this;
    let marketingId = e.currentTarget.dataset.marketingid;
    let storeId = wx.getStorageSync(constant.STORE_INFO);
    ticketService.receiveTicket({ marketingId: marketingId, storeId: storeId }).subscribe({
      next: res => {
        wx.showModal({
          title: '领取成功',
          content: '请到个中心我的优惠券中查看',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/personal/ticket/ticket',
              })
            
            }
          }
        })
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },
  // 跳转到绑定手机号
  reciveTicketAndBind: function (e) {
    wx.navigateTo({
      url: '/pages/personal/member-card/band/band?marketingid=' + e.currentTarget.dataset.marketingid,
    })
  },

  // 优惠券展开
  onTicketBottomClick(e) {
    let marketingId = e.currentTarget.dataset.marketingid;
    this.data.ticketList.forEach((item) => {
      if (marketingId === item.marketingId) {
        if (item.ticketSwitch === 'OPEN') {
          item.ticketSwitch = 'CLOSE';
        } else {
          item.ticketSwitch = 'OPEN';
        }
      } else {
        item.ticketSwitch = 'CLOSE';        
      }
    });
    this.setData({
      ticketList: this.data.ticketList
    })
  },

  // 点击优惠券查看更多
  onSearchMoreTicketClick() {
    this.setData({
      showSearchMoreTicket: false
    })
    getAllTicket.call(this, this.data.storeId);
  }

})

// 获取卡券信息
function getTicketInfo(storeId) {
  let self = this;
  homeService.ticketList({
    storeId: storeId
  }).subscribe({
    next: res => {
      res.forEach((item) => {
        item.ticketSwitch = 'CLOSE';
        if (item.disabledWeekDate) {
          let disabledWeekDateArr = item.disabledWeekDate.split(',');
          item.selectedWeek1 = weekText.call(self, disabledWeekDateArr[0]);
          item.selectedWeek2 = weekText.call(self, disabledWeekDateArr[disabledWeekDateArr.length - 1]);
          if (item.disabledTimeStart && item.disabledTimeEnd) {
            item.disabledTimeStart = item.disabledTimeStart.replace(/-/g, '/');
          item.disabledTimeEnd = item.disabledTimeEnd.replace(/-/g, '/');
          item.unUseStartTime = (new Date(item.disabledTimeStart).getHours().toString().length < 2 ? ('0' + new Date(item.disabledTimeStart).getHours()) : new Date(item.disabledTimeStart).getHours()) + ':' +
            (new Date(item.disabledTimeStart).getMinutes().toString().length < 2 ? ('0' + new Date(item.disabledTimeStart).getMinutes()) : new Date(item.disabledTimeStart).getMinutes());
          item.unUseEndTime = (new Date(item.disabledTimeEnd).getHours().toString().length < 2 ? ('0' + new Date(item.disabledTimeEnd).getHours()) : new Date(item.disabledTimeEnd).getHours()) + ':' +
            (new Date(item.disabledTimeEnd).getMinutes().toString().length < 2 ? ('0' + new Date(item.disabledTimeEnd).getMinutes()) : new Date(item.disabledTimeEnd).getMinutes());
          }
        }
      });
      self.setData({
        ticketList: res
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 最近的门店
function closestStore () {
  let data = {
    latitude: this.data.latitude,
    longitude: this.data.longitude
  }
  let self = this;
  homeService.closestStore(data).subscribe({
    next: res => {
      console.log(res);
      wx.setStorageSync(constant.STORE_INFO, res.storeId);
      self.setData({
        storeId: res.storeId,
        isOnLoad: true
      })
      
      wx.setNavigationBarTitle({
        title: res.storeName
      })
      self.setData({
        storeName: res.storeName
      });
      wx.setStorageSync('storeName', res.storeName);
      // {picture_id}/resize_{width}_{height}/mode_fill
      if (res.pictureVOS && res.pictureVOS.length > 0) {
        res.pictureVOS.forEach((item) => {
          if (item.picUrl) {
            item.picUrl = constant.OSS_IMAGE_URL + `${item.picUrl}/resize_750_360/mode_fill`;
          }
        });
        self.setData({
          productImages: res.pictureVOS
        })
      }
      if (res.productList && res.productList.length && res.productList.length > 0) {
        res.productList.forEach((item, index) => {
          if (item.picUrl && index > 0) {
            item.picUrl = constant.OSS_IMAGE_URL + `${item.picUrl}/resize_330_190/mode_fill`;
          }
        })
        if (res.productList.length == 1 || res.productList.length == 3) {
          if (res.productList[0].picUrl) {
            res.productList[0].picUrl = constant.OSS_IMAGE_URL + `${res.productList[0].picUrl}/resize_690_360/mode_fill`;            
          }
        } else {
          res.productList[0].picUrl = constant.OSS_IMAGE_URL + `${res.productList[0].picUrl}/resize_330_190/mode_fill`;                      
        }
      }

      if (res.staffList && res.staffList.length && res.staffList.length > 0) {
        res.staffList.forEach((item) => {
          if (item.headPortrait) {
            item.headPortrait = constant.OSS_IMAGE_URL + `${item.headPortrait}/resize_220_180/mode_fill`;
          }
        })
      }
      self.setData({
        storeInfo: res,
      });
      getTicketInfo.call(self, res.storeId);
      getStoreInfo.call(self, res.storeId);
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

/**门店主页信息 */
function getStoreIndexInfo(storeId, merchantId) {
  let self = this;
  homeService.storeIndex({
    storeId: storeId,
    merchantId: merchantId
  }).subscribe({
    next: res => {
      wx.setNavigationBarTitle({
        title: res.storeName
      })
      self.setData({
        storeName: res.storeName
      });
      wx.setStorageSync('storeName', res.storeName);
      // {picture_id}/resize_{width}_{height}/mode_fill
      if (res.pictureVOS && res.pictureVOS.length > 0) {
        res.pictureVOS.forEach((item) => {
          if (item.picUrl) {
            item.picUrl = constant.OSS_IMAGE_URL + `${item.picUrl}/resize_750_360/mode_fill`;
          }
        });
        self.setData({
          productImages: res.pictureVOS
        })
      }
      if (res.productList && res.productList.length && res.productList.length > 0) {
        res.productList.forEach((item, index) => {
          if (item.picUrl && index > 0) {
            item.picUrl = constant.OSS_IMAGE_URL + `${item.picUrl}/resize_330_190/mode_fill`;
          }
        })
        if (res.productList.length == 1 || res.productList.length == 3) {
          if (res.productList[0].picUrl) {
            res.productList[0].picUrl = constant.OSS_IMAGE_URL + `${res.productList[0].picUrl}/resize_690_360/mode_fill`;
          }
        } else {
          res.productList[0].picUrl = constant.OSS_IMAGE_URL + `${res.productList[0].picUrl}/resize_330_190/mode_fill`;
        }
      }  

      if (res.staffList && res.staffList.length && res.staffList.length > 0) {
        res.staffList.forEach((item) => {
          if (item.headPortrait) {
            item.headPortrait = constant.OSS_IMAGE_URL + `${item.headPortrait}/resize_220_180/mode_fill`;
          }
        })
      }
      self.setData({
        storeInfo: res,
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

function logIn(code, appid, rawData) {
  let self = this; 
  console.log(rawData)
  service.logIn({ code: code, appid: appid, rawData: rawData, tplid: constant.TPLID }).subscribe({
    next: res => {
      // 1530602217127209655835
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
      wx.setStorageSync(constant.MERCHANTID, res.merchantId ? res.merchantId : '153179997107784038184');
      wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg);
      wx.setStorageSync(constant.sessionKey, res.sessionKey);
      wx.setStorageSync(constant.USER_ID, res.userId)      

      if(res.ver == '2') {
        wx.setStorageSync(constant.VER, 2 );
      } else {
        wx.setStorageSync(constant.VER, 1);
      }

      wx.setStorage({
        key: constant.TOKEN,
        data: res.juniuToken,
        success: function (res) {
          wx.getLocation({
            success: function (result) {
              self.setData({
                latitude: result.latitude,
                longitude: result.longitude
              })
              closestStore.call(self)
            },
            fail: function (result) {
              wx.navigateTo({
                url: '/pages/index/index',
              })
            }
          })
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 获取全部的优惠券
function getAllTicket(storeId) {
  console.log(storeId);
  let self = this;
  ticketService.allCouponlist({
    storeId: storeId
  }).subscribe({
    next: res => {
      res.forEach((item) => {
        item.ticketSwitch = 'CLOSE';
        if (item.disabledWeekDate) {
          let disabledWeekDateArr = item.disabledWeekDate.split(',');
          item.selectedWeek1 = weekText.call(self, disabledWeekDateArr[0]);
          item.selectedWeek2 = weekText.call(self, disabledWeekDateArr[disabledWeekDateArr.length - 1]);
          if (item.disabledTimeStart && item.disabledTimeEnd) {
            item.disabledTimeStart = item.disabledTimeStart.replace(/-/g, '/');
            item.disabledTimeEnd = item.disabledTimeEnd.replace(/-/g, '/');
            item.unUseStartTime = (new Date(item.disabledTimeStart).getHours().toString().length < 2 ? ('0' + new Date(item.disabledTimeStart).getHours()) : new Date(item.disabledTimeStart).getHours()) + ':' +
              (new Date(item.disabledTimeStart).getMinutes().toString().length < 2 ? ('0' + new Date(item.disabledTimeStart).getMinutes()) : new Date(item.disabledTimeStart).getMinutes());
            item.unUseEndTime = (new Date(item.disabledTimeEnd).getHours().toString().length < 2 ? ('0' + new Date(item.disabledTimeEnd).getHours()) : new Date(item.disabledTimeEnd).getHours()) + ':' +
              (new Date(item.disabledTimeEnd).getMinutes().toString().length < 2 ? ('0' + new Date(item.disabledTimeEnd).getMinutes()) : new Date(item.disabledTimeEnd).getMinutes());
          }
        }
      });
      self.setData({
        ticketList: res
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

//获取门店信息
function getStoreInfo(storId) {
  let self = this;
  homeService.storeInfoDetail({ storeId: storId }).subscribe({
    next: res => {
      self.setData({
        storeAddress: res.address,
        tel: res.mobie,
        latitude: res.latitude,
        longitude: res.longitude,
      });
      wx.setStorageSync(constant.address, res.address)
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

/* ==== ===*/ 

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
    merchantId: wx.getStorageSync(constant.MERCHANTID),
    address: self.data.address,
    provinceId: self.data.provinceId,
    cityId: self.data.cityId,
    areaId: self.data.areaId,
    latitude: self.data.latitude,
    longitude: self.data.longitude
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

function weekText(str) {
  let name = '';
  switch (str) {
    case '1':
      name = '周一';
      break;
    case '2':
      name = '周二';
      break;
    case '3':
      name = '周三';
      break;
    case '4':
      name = '周四';
      break;
    case '5':
      name = '周五';
      break;
    case '6':
      name = '周六';
      break;
    case '7':
      name = '周日';
      break;
  }
  return name;
}