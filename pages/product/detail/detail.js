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
    bigImg: '',
    showSelectCountAlert: false,
    count: 1
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '商品详情',
    })
    this.setData({
      productId: options.productId,
      storeId: options.storeId ? options.storeId : wx.getStorageSync(constant.STORE_INFO)
    })

    let self = this;
    if (options.type === 'shared') {
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
    } else {
      getProductDetail.call(this);
      getProductCommentList.call(this)
      getStoreInfo.call(this, wx.getStorageSync(constant.STORE_INFO))
    }
  },

  onShareAppMessage: function (res) {
    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/product/detail/detail?type=shared&storeId=' + this.data.storeId + '&productId=' + this.data.productId,
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

  // 点击立即购买弹出选择数量弹框
  alertCountSelect() {
    this.setData({
      showSelectCountAlert: true
    })
  },

  // 立即购买
  onBuyClick: function() {
    wx.navigateTo({
      url: '/pages/pay/pay?productId=' + this.data.productId + '&count=' + this.data.count,
    })
    this.setData({
      showSelectCountAlert: false
    })
  },

  onCountLeftClick() {
    if (this.data.count == 1) {
      return
    };
    --this.data.count;
    this.setData({
      count: this.data.count,
      payPrice: this.data.productInfo.currentPrice * this.data.count / 100
    })
  },

  onCountRightClick() {
    ++this.data.count;
    this.setData({
      count: this.data.count,
      payPrice: this.data.productInfo.currentPrice * this.data.count / 100
    })
  },

  closeCountClick() {
    this.setData({
      showSelectCountAlert: false
    })
  }
})

// 商品详情
function getProductDetail() {
  let data = {
    productId: this.data.productId,
    storeId: this.data.storeId
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
          getStoreInfo.call(self, self.data.storeId)
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
        storeName: res.storeName 
      });
      wx.setStorageSync(constant.address, res.address);
      wx.setStorageSync('storeName', res.storeName);
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}