import { constant } from '../../../utils/constant';
import { kanjiaService } from '../shared/kanjia.service';
import { errDialog, loading } from '../../../utils/util';
import { service } from '../../../service';


Page({
  data: {
    juniuImg: '/asset/images/product.png',
    orderNo: '',
    tel: ''
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderNo: options.orderNo ? options.orderNo : '',
      storeId: options.storeId,
      bargainDetail: JSON.parse(options.bargainDetail)
    });
  },

  onTelChange: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },

  //授权手机号 
  getUserPhoneNumber: function (e) {
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    let data = {
      encryptData: encryptedData,
      iv: iv
    }
    service.decodeUserPhone(data).subscribe({
      next: res => {
        this.setData({
          tel: res.phoneNumber
        })
        wx.setStorageSync(constant.phoneNumber, res.phoneNumber)
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },

  submit() {
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    let appId = 'wx3bb038494cd68262';
    let appid = extConfig.theAppid ? extConfig.theAppid : appId;
    if ((this.data.tel + '').length !== 11) {
      errDialog('请填写正确的手机号'); return;
    }
    let self = this;

    if(this.data.orderNo) {
      pay.call(this)
    } else {
      kanjiaService.initiateBargain({
        activityId: this.data.bargainDetail.activityId,
        storeId: this.data.storeId
      }).subscribe({
        next: res => {
          if (res) {
            this.setData({
              orderNo: res
            })
            pay.call(this)
          }
        },
        error: err => errDialog(err),
        complete: () => wx.hideToast()
      })
    }
  }

})    

function pay() {
  let data = {
    appid: appid,
    buyerPhone: this.data.tel,
    orderNo: this.data.orderNo,
  };
  kanjiaService.preorder(data).subscribe({
    next: res => {
      wx.requestPayment({
        timeStamp: res.payInfo.timeStamp,
        nonceStr: res.payInfo.nonceStr,
        package: res.payInfo.package,
        signType: res.payInfo.signType,
        paySign: res.payInfo.paySign,
        success: function (result) {
          wx.navigateTo({
            url: 'plugin://myPlugin/order-detail?orderNo=' + res.orderId,
          });
        },
        fail: function (result) {
          wx.navigateTo({
            url: 'plugin://myPlugin/order-detail?orderNo=' + res.orderId + '&storeId=' + self.data.storeId + '&bargainDetail=' + JSON.stringify(self.data.bargainDetail),
          });
        },
        complete: function (result) {
          console.log(result);
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}