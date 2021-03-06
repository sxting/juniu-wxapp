import { productService } from '../shared/service.js';
import { formidService } from '../../../shared/service/formid.service.js';
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
    count: 1,
    getUserInfo: true
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '项目详情',
    })
    this.setData({
      productId: options.productId,
      storeId: options.storeId ? options.storeId : wx.getStorageSync(constant.STORE_INFO)
    })

    let self = this;
    if (options.type === 'shared') {
      wx.setStorageSync(constant.STORE_INFO, this.data.storeId);      
    }
    getProductDetail.call(this);
    getProductCommentList.call(this)
    getStoreInfo.call(this, this.data.storeId)
  },

  onShareAppMessage: function (res) {
    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/login/login?type=shared&storeId=' + this.data.storeId + '&productId=' + this.data.productId + '&page=' + constant.page.product,
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
  onStoreClick: function () {
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

  formSubmit: function (e) {
    let formId = e.detail.formId; //获取formId
    formidService.collectFormIds(formId).subscribe({
      next: res => { }
    })
  },

  // 立即购买
  onBuyClick: function () {
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
    let num = this.data.productInfo.wxBuyLimitNum;
    if (num > 0 && this.data.count === num) {
      return;
    }
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
      if (res.descPicIds) {
        let descPicUrls = res.descPicIds.split(',');
        res.descPicUrls = [];
        descPicUrls.forEach(function(item) {
          item = constant.OSS_IMAGE_URL + `${item}/resize_690_480/mode_fill`;
          res.descPicUrls.push(item)
        })
      }
      if (res.notice) {
        res.noticeArr = JSON.parse(res.notice);
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
        tel: res.mobile,
        storeName: res.storeName 
      });
      wx.setStorageSync(constant.address, res.address);
      wx.setStorageSync('storeName', res.storeName);
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}