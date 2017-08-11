//index.js
//获取应用实例
import { homeService } from 'shared/home.service';
import { errDialog, loading } from '../../utils/util'

var app = getApp()
Page({
  data: {
    productImages: [
      { picUrl: '/asset/images/shop-bg.png' },
      { picUrl: '/asset/images/head-portrait.png' }
    ],
    storeId: '',
    scene: 0,
    storeInfo: {},
    fromNeighbourhood: false
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
    getStoreIndexInfo.call(this, this.data.storeId, app.globalData.merchantId)
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
      url: '/pages/craftsman/select/select',
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
      url: '/pages/order/order',
    })
  },

  goStaffDetail: function (e) {
    wx.navigateTo({
      url: '/pages/craftsman/detail/detail?staffId=' + e.currentTarget.dataset.staffid,
    })
  },
  goProductDetail: function (e) {
    wx.navigateTo({
      url: '/pages/product/detail/detail?productId=' + e.currentTarget.dataset.productid,
    })
  }
})


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
        storeInfo: res,
        productImages: res.pictureVOS
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}