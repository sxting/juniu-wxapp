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
    ticketList: []
  },
  onLoad: function (option) {
    this.setData({
      storeId: option.storeid,
      scene: app.globalData.scene
    });
    if (this.data.scene === 1026) {
      this.setData({
        fromNeighbourhood: true
      })
    }
    wx.setStorageSync(constant.STORE_INFO, option.storeid);
    getStoreIndexInfo.call(this, this.data.storeId, wx.getStorageSync(constant.MERCHANTID));
    getTicketInfo.call(this, this.data.storeId);
  },
  // 跳转到店铺页面
  goShopPage: function () {
    wx.navigateTo({
      url: '/pages/shop/shop?storeId=' + this.data.storeId
    })
  },

  // 跳转到个人中心
  goPersonalPage: function () {
    wx.navigateTo({
      url: '/pages/personal/index/index',
    })
  },

  // 跳转到我的预约
  goMyAppointment: function () {
    wx.navigateTo({
      url: '/pages/personal/appointment/appointment',
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
      if (event.detail.errMsg.indexOf(item.picUrl)>0) {
        if (item.picUrl.indexOf('_375x360')>0) {
          item.picUrl = item.picUrl.split('_375x360')[0] + '.' + 'png';
        }
      }
    });
    this.setData({
      productImages: this.data.productImages
    })
  },
  goAllTicket: function(){
    wx.navigateTo({
      url: '/pages/ticket/index/index',
    })
  },
  goTicketDetail: function (e) {
    wx.navigateTo({
      url: '/pages/ticket/detail/detail?marketingId=' + e.currentTarget.dataset.marketingid,
    })
  },
  reciveTicket: function (e) {
    let self = this;
    let marketingId = e.currentTarget.dataset.marketingid;
    ticketService.receiveTicket({ marketingId: marketingId}).subscribe({
      next: res => {
        wx.showModal({
          title: '领取成功',
          content: '请到个中心我的优惠券中查看',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              getTicketInfo.call(self, self.data.storeId);
            }
          }
        })
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
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
      res.forEach((item) => {
        item.picUrl = item.picUrl.split('.png')[0] + '_78x58.png';
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
      if (res.pictureVOS && res.pictureVOS.length > 0) {
        res.pictureVOS.forEach((item) => {
          if (item.picUrl) {
            item.picUrl = item.picUrl.split('.png')[0] + '_375x360.png';
          }
        })
        self.setData({
          productImages: res.pictureVOS
        })
      }
      res.productList.forEach((item) => {
        item.picUrl = item.picUrl.split('.png')[0] + '_78x58.png';
      })
      res.staffList.forEach((item) => {
        item.headPortrait = item.headPortrait.split('.png')[0] + '_78x58.png';
      });
      self.setData({
        storeInfo: res,
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

