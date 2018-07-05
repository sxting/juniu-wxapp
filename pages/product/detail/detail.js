import { productService } from '../shared/service.js'
import { errDialog, changeDate } from '../../../utils/util';
import { constant } from '../../../utils/constant';
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
    storeId: ''
  },

  onLoad: function (options) {
    this.setData({
      productId: options.productId,
      storeId: options.storeId
    })

    let token = wx.getStorageSync(constant.TOKEN);
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

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    console.log('/pages/product/detail/detail?storeId=' + this.data.storeId + 'productId=' + this.data.productId)

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

  onScrollTolower: function () {
    if (this.data.pageIndex == this.data.countPage) {
      return;
    }
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    getProductCommentList.call(this)
  }
})

// 商品详情
function getProductDetail() {
  let data = {
    productId: this.data.productId
  }
  productService.getProductDetail(data).subscribe({
    next: res => {
      res.url = constant.OSS_IMAGE_URL + `${res.url}/resize_375_180/mode_fill`;
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
            item.imagesUrl[index] = constant.OSS_IMAGE_URL + `${img}/resize_80_80/mode_fill`;
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
  service.logIn({ code: code, appid: appid, rawData: rawData }).subscribe({
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
          getProductDetail.call(this);
          getProductCommentList.call(this)
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}