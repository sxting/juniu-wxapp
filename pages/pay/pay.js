import { productService } from '../product/shared/service.js';
import { constant } from '../../utils/constant';
import { errDialog } from '../../utils/util';
import { payService } from 'shared/service.js'
import { service } from '../../service';

Page({
  data: {
    count: 1,
    showCardBuy: false,
    showPaySuccess: false,
    productId: '',
    productInfo: {},
    storeId: '',
    productCardLength: 0,
    productCouponLength: 0,
    productCardConfigList: [],
    ruleId: '',
    cardConfigId: '',
    cardId: '',
    couponId: '',
    showUserBind: false,
    phone: '',
    type: '',
    memo: '',
  },

  onLoad: function (options) {
    this.setData({
      productId: options.productId,
      storeId: wx.getStorageSync(constant.STORE_INFO)
    })
    getProductDetail.call(this);
    productCoupon.call(this);
  },

  onShow() {
    let self = this;
    productCard.call(this);
    if (wx.getStorageSync(constant.couponId)) {
      this.setData({
        couponId: wx.getStorageSync(constant.couponId)
      })
      wx.removeStorageSync(constant.couponId)      
    }
    if (wx.getStorageSync(constant.cardId)) {
      this.setData({
        cardId: wx.getStorageSync(constant.cardId)
      })
      wx.removeStorageSync(constant.cardId)    
    }
    service.userIsBind().subscribe({
      next: res => {
        if (res.isBind) {
          self.setData({
            phone: res.phone
          })
        }
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },

  onCountLeftClick() {
    if(this.data.count == 1) {
      return
    };
    --this.data.count;
    this.setData({
      count: this.data.count
    })
  },

  onCountRightClick() {
    ++this.data.count;
    this.setData({
      count: this.data.count
    })
  },

  getMemo(e) {
    this.setData({
      memo: e.detail.value
    })
  },

  // 跳转到我的优惠券
  goMyCoupon() {
    if (this.data.productCouponLength == 0 ) {
      return;
    }
    wx.navigateTo({
      url: '/pages/personal/ticket/ticket?productId=' + this.data.productId,
    })
  },

  // 跳转到我的会员卡列表
  goMyCard() {
    wx.navigateTo({
      url: '/pages/personal/member-card/list/list?productId=' + this.data.productId,
    })
  },

  // 点击更多优惠
  onMoreRightsClick() {
    this.setData({
      showCardBuy: true
    })
    productCardConfig.call(this);
  },

  // 点击卡规则 
  onCardConfigItemClick(e) {
    console.log(e);
    this.setData({
      ruleId: e.currentTarget.dataset.ruleid,
      cardConfigId: e.currentTarget.dataset.cardid
    })
  },

  // 点击关闭按钮
  onCloseCardClick() {
    this.setData({
      showCardBuy: false
    })
  },

  // 开通并付款
  onPayBtnClick() {
    userIsBind.call(this)
  },

  // 确定
  onSuccessSureClick() {
    this.setData({
      showPaySuccess: false,
      showCardBuy: false
    })
    wx.navigateTo({
      url: '/pages/personal/order-form-detail/order-form-detail',
    })
  },

  // 立即支付
  onOrderPayClick() {
    if(this.data.cardId) {
      this.setData({
        type: 'DEDUCTION'
      })
    } else {
      this.setData({
        type: 'PAY'
      })
    }
    
    onlineBuy.call(this);
  },

  // 直接付款
  onZhijieOrderPay() {
    this.setData({
      type: 'PAY'
    })
    onlineBuy.call(this);
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
        res.url = constant.OSS_IMAGE_URL + `${res.url}/resize_375_180/mode_fill`;
      }
      this.setData({
        productInfo: res
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 查询会员卡列表
function productCard() {
  let data = {
    productId: this.data.productId,
    storeId: this.data.storeId
  }
  payService.productCard(data).subscribe({
    next: res => {
      this.setData({
        productCardLength: res.length
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 查询优惠券列表
function productCoupon() {
  let data = {
    productId: this.data.productId,
    storeId: this.data.storeId
  }
  payService.productCoupon(data).subscribe({
    next: res => {
      this.setData({
        productCouponLength: res.length
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 适用于某商品的卡规则
function productCardConfig() {
  let data = {
    productId: this.data.productId,
    storeId: this.data.storeId
  }
  payService.productCardConfig(data).subscribe({
    next: res => {
      this.setData({
        productCardConfigList: res,
        ruleId: res[0].rules[0].ruleId,
        cardConfigId: res[0].cardConfigId
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 是否绑定手机号
function userIsBind() {
  let self = this;
  service.userIsBind().subscribe({
    next: res => {
      if (res.isBind) {
        self.setData({
          phone: res.phone,
          type: 'OPENCARD'
        })
        // 已经绑定手机号   直接调用在线购买接口
        onlineBuy.call(self)
      } else {
        wx.showModal({
          title: '绑定手机号',
          content: '开通会员卡需要绑定手机号，用于会员的查询及消费，请先绑定手机号',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/personal/member-card/band/band?from=product',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 在线购买
function onlineBuy() {
  let self = this;
  let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};

  console.log(extConfig)

  let appId = extConfig.theAppid ? extConfig.theAppid : 'wx3bb038494cd68262';
  // type不能为空 在线购卡付款:OPENCARD, 在线付款:PAY, 扣减会员卡:DEDUCTION
  let data = {
    appid: appId,
    buyProductRequest: {
      couponId: this.data.couponId,
      money: this.data.productInfo.currentPrice, //单价
      num: this.data.count,
      phone: this.data.phone,
      price: this.data.productInfo.currentPrice * this.data.count,
      productId: this.data.productInfo.productId,
      productName: this.data.productInfo.productName,
      storeId: this.data.storeId
    },
    openCardRquest: {
      ruleId: this.data.ruleId, //开卡的时候传
    },
    settleCardRequest: {
      cardId: this.data.cardId
    },
    memo: this.data.memo, //备注
    phone: this.data.phone,
    storeId: this.data.storeId,
    type: this.data.type
  }
  if (this.data.type == 'OPENCARD') {
    let orderId = new Date().getFullYear() + "" + new Date().getMonth() + new Date().getDate() + new Date().getHours() + new Date().getMinutes() + MathRand.call(this, 10)
    data.buyProductRequest.orderId = orderId.substring(0, 18);
  }
  payService.onlineBuy(data).subscribe({
    next: res => {
      console.log(res);
      this.setData({
        showPaySuccess: true
      })
      let nonceStr = MathRand.call(self, 30), timeStamp = new Date().getTime() / 1000, prepay_id = '', key = '';
      let stringSignTemp = `MD5(appId=${appId}&nonceStr=${nonceStr}&package=prepay_id=${prepay_id}&signType=MD5&timeStamp=${timeStamp}&key=${key})`;
      let sign = MD5(stringSignTemp).toUpperCase();
      wx.requestPayment({
        timeStamp: timeStamp ,
        nonceStr: nonceStr,
        package: 'prepay_id=' + prepay_id ,
        signType: 'MD5',
        paySign: `${stringSignTemp} = ${sign}`,
        success: function (res) {

        },
        fail: function (res) { },
        complete: function (res) { }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

function MathRand(num) {
  var Num = "";
  for (var i = 0; i < num; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num
} 