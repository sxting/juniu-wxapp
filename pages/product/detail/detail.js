import { productService } from '../shared/service.js'
import { errDialog, changeDate } from '../../../utils/util';
import { constant } from '../../../utils/constant';
import { service } from '../../../service';
import { homeService } from '../../home/shared/home.service';

//获取应用实例
var app = getApp()
Page({
  data: {
    productInfo: {},
    commentList: [],
    starArr: [0, 1, 2, 3, 4],
    productId: '',
    pageIndex: 1,
    pageSize: 10,
    countPage: 1,
    storeId: '',
    storeName: '',
    juniuImg: '/asset/images/product.png',
    address: '',
    tel: '',
    showBigImg: false,
    bigImg: ''
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '商品详情',
    })
    this.setData({
      productId: options.productId,
      storeId: wx.getStorageSync(constant.STORE_INFO),
      storeName: wx.getStorageSync('storeName')
    })

    let token = wx.getStorageSync(constant.TOKEN);
    let self = this;
    if (token) {
      getProductDetail.call(this);
      getProductCommentList.call(this)
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
  },

  onShow: function() {
    let self = this;
    setTimeout(function() {
      if (self.data.productId) {
        self.setData({
          storeId: wx.getStorageSync(constant.STORE_INFO),
          storeName: wx.getStorageSync('storeName')
        })

        let token = wx.getStorageSync(constant.TOKEN);
        if (token) {
          getProductDetail.call(self);
          getProductCommentList.call(self)
        }
      }
    }, 200)
    getStoreInfo.call(this, wx.getStorageSync(constant.STORE_INFO))
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/product/detail/detail?storeId=' + this.data.storeId + '&productId=' + this.data.productId,
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

  onImgItemClick(e) {
    let url = e.currentTarget.dataset.url;
    let img1 = url.replace(/71/, '375');
    this.setData({
      showBigImg: true,
      bigImg: img1.replace(/72/, '430')
    })
  },

  onBigImgClick() {
    this.setData({
      showBigImg: false,
      bigImg: ''
    })
  },

  onTelClick() {
    let self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.tel
    })
  },

  onScrollTolower: function () {
    if (this.data.pageIndex == this.data.countPage) {
      return;
    }
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    getProductCommentList.call(this)
  },

  // 点击适用门店
  onStoreClick: function() {
    wx.navigateTo({
      url: '/pages/index/index?productId=' + this.data.productId,
    })
  },

  // 立即购买
  onBuyClick: function() {
    wx.navigateTo({
      url: '/pages/pay/pay?productId=' + this.data.productId,
    })
  }
})

// 商品详情
function getProductDetail() {
  let data = {
    productId: this.data.productId
  }
  productService.getProductDetail(data).subscribe({
    next: res => {
      if (res.url) {
        res.url = constant.OSS_IMAGE_URL + `${res.url}/resize_750_520/mode_fill`;
      }
      this.setData({
        productInfo: res
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

//商品评价列表
function getProductCommentList() {
  let data = {
    pageIndex: this.data.pageIndex,
    pageSize: this.data.pageSize,
    storeId: this.data.storeId,
    productId: this.data.productId
  }
  productService.getProductCommentList(data).subscribe({
    next: res => {
      res.comments.forEach((item) => {
        let dateArray = item.juniuoModel.dateCreated.split(' ');
        item.date = dateArray[0];
        item.time = dateArray[1];
        
        if (item.imagesUrl) {
          item.imagesUrl.forEach((img, index) => {
            item.imagesUrl[index] = constant.OSS_IMAGE_URL + `${img}/resize_71_72/mode_fill`;
          });
        }
      });

      this.setData({
        commentList: res.comments,
        countPage: res.pageInfo.countPage
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
      // 1505274961239211095369
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
      wx.setStorageSync(constant.MERCHANTID, extConfig.theAppid ? res.merchantId : '1505100477335167136848');
      wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg);

      if (res.ver == '2') {
        wx.setStorageSync(constant.VER, 2);
      } else {
        wx.setStorageSync(constant.VER, 1);
      }

      wx.setStorage({
        key: constant.TOKEN,
        data: res.juniuToken,
        success: function (res) {
          getProductDetail.call(self);
          getProductCommentList.call(self)
        }
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
        address: res.address,
        tel: res.mobie,
      });
      wx.setStorageSync(constant.address, res.address)
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}