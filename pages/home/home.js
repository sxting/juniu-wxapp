//index.js
//获取应用实例
import { homeService } from 'shared/home.service';
import { errDialog, loading } from '../../utils/util'
import { constant } from '../../utils/constant';
import { ticketService } from '../ticket/shared/ticket.service';
// MONEY，DISCOUNT，GIFT
var app = getApp()
Page({
  data: {
    productImages: [
    ],
    storeId: '',
    scene: 0,
    storeInfo: {},
    fromNeighbourhood: false,
    ticketList: [],
    optionData: '',
    juniuImg: '',
  },
  onLoad: function (option) {
// merchantId:1505100477335167136848
    this.setData({
      storeId: wx.getStorageSync(constant.STORE_INFO),
      scene: app.globalData.scene,
      optionData: option
    });
    if (this.data.scene === 1026) {
      this.setData({
        fromNeighbourhood: true
      })
    }

    let token = wx.getStorageSync(constant.TOKEN);
    if (token) {
      wx.setStorageSync(constant.STORE_INFO, this.data.storeId);
      getStoreIndexInfo.call(this, this.data.storeId, wx.getStorageSync(constant.MERCHANTID) ? wx.getStorageSync(constant.MERCHANTID) : option.merchantId);
      getTicketInfo.call(this, this.data.storeId);
    } else {
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
    }

    // wx.setStorageSync(constant.STORE_INFO, option.storeid);
    // getStoreIndexInfo.call(this, this.data.storeId, wx.getStorageSync(constant.MERCHANTID) ? wx.getStorageSync(constant.MERCHANTID) : option.merchantId);
    // getTicketInfo.call(this, this.data.storeId);
  },

  onShow() {
    let self = this;
    setTimeout(function() {
      getStoreIndexInfo.call(self, self.data.storeId, wx.getStorageSync(constant.MERCHANTID) ? wx.getStorageSync(constant.MERCHANTID) : option.merchantId);
      getTicketInfo.call(self, self.data.storeId);
    }, 100)
  },

// 转发
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
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
    wx.navigateTo({
      url: '/pages/index/index',
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

  // 跳转到全部评价列表
  goCommentPage: function () {
    wx.navigateTo({
      url: '/pages/comment/list/list?storeId=' + this.data.storeId,
    })
  },

  // 跳转到买单页面
  goPayPage: function () {
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  },

  // 跳转到线上预约页面
  goOrderPage: function () {
    wx.navigateTo({
      url: '/pages/order/order?storeId=' + this.data.storeId,
    })
  },

  goStaffDetail: function (e) {
    wx.navigateTo({
      url: '/pages/craftsman/detail/detail?staffId=' + e.currentTarget.dataset.staffid + '&storeId=' + this.data.storeId,
    })
  },
  goProductDetail: function (e) {
    wx.navigateTo({
      url: '/pages/product/detail/detail?productId=' + e.currentTarget.dataset.productid + '&storeId=' + this.data.storeId,
    })
  },
  imgError: function (event) {
    this.data.productImages.forEach((item) => {
      if (event.detail.errMsg.indexOf(item.picUrl) > 0) {
        if (item.picUrl.indexOf('_375x360') > 0) {
          item.picUrl = item.picUrl.split('_375x360')[0] + '.' + 'png';
        }
      }
    });
    this.setData({
      productImages: this.data.productImages
    })
  },
  goAllTicket: function () {
    wx.navigateTo({
      url: '/pages/ticket/index/index',
    })
  },
  goTicketDetail: function (e) {
    wx.navigateTo({
      url: '/pages/ticket/detail/detail?marketingId=' + e.currentTarget.dataset.marketingid,
    })
  },
  pageEventListener: function () {
    let self = this;
    getTicketInfo.call(self, self.data.storeId);
  },
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
  reciveTicketAndBind: function (e) {
    wx.navigateTo({
      url: '/pages/personal/member-card/band/band?marketingid=' + e.currentTarget.dataset.marketingid,
    })
  },

  // 优惠券展开
  onTicketBottomClick(e) {
    let marketingId = e.currentTarget.dataset.marketingid;
    console.log(marketingId);
    this.data.ticketList.forEach((item) => {
      if (marketingId === item.marketingId) {
        item.ticketSwitch = 'OPEN';
      } else {
        item.ticketSwitch = 'CLOSE';        
      }
    });
    this.setData({
      ticketList: this.data.ticketList
    })
  }

})

// 获取卡券信息
function getTicketInfo(storeId) {
  let self = this;
  homeService.ticketList({
    storeId: storeId
  }).subscribe({
    next: res => {
      res = [
        {
          marketingName: '优惠券名称',
          couponDefAmount: '20000',
          couponDefDiscount: '7.5',
          couponDefType: 'MONEY',
          isGet: 'get',
          isBind: 'bind',
          marketingId: '001',
          useLimitMoney: '100', //100 -1
          couponDefProductName: '礼品券赠送商品',
          count: '20',
          validDateCount: '30'
        },
        {
          marketingName: '优惠券名称',
          couponDefAmount: '20000',
          couponDefDiscount: '7.5',
          couponDefType: 'GIFT',
          isGet: 'get',
          isBind: 'bind',
          marketingId: '0013',
          useLimitMoney: '100', //100 -1
          couponDefProductName: '礼品券赠送商品',
          count: '20',
          validDateCount: '30',
        }
      ]
      res.forEach((item) => {
        item.ticketSwitch = 'CLOSE';
      });
      self.setData({
        ticketList: res
      })
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
      wx.setStorageSync('storeName', res.storeName);
      // {picture_id}/resize_{width}_{height}/mode_fill
      if (res.pictureVOS && res.pictureVOS.length > 0) {
        res.pictureVOS.forEach((item) => {
          item.picUrl = constant.OSS_IMAGE_URL + `${item.picUrl}/resize_375_180/mode_fill`;
        });
        self.setData({
          productImages: res.pictureVOS
        })
      }
      res.productList.forEach((item) => {
        item.picUrl = constant.OSS_IMAGE_URL + `${item.picUrl}/resize_78_55/mode_fill`;
      })
      res.staffList.forEach((item) => {
        item.headPortrait = constant.OSS_IMAGE_URL + `${item.headPortrait}/resize_50_50/mode_fill`;
      })
      res.staffList.forEach((item) => {
        item.headPortrait = item.headPortrait.split('.png')[0] + '_58x58.png';
      });
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
  service.logIn({ code: code, appid: appid, rawData: rawData }).subscribe({
    next: res => {
      // 1505274961239211095369
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
      wx.setStorageSync(constant.MERCHANTID, extConfig.theAppid ? res.merchantId : '1505100477335167136848');
      wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg);
      wx.setStorage({
        key: constant.TOKEN,
        data: res.juniuToken,
        success: function (res) {
          wx.setStorageSync(constant.STORE_INFO, this.data.storeId);
          getStoreIndexInfo.call(this, this.data.storeId, wx.getStorageSync(constant.MERCHANTID) ? wx.getStorageSync(constant.MERCHANTID) : option.merchantId);
          getTicketInfo.call(this, this.data.storeId);
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}