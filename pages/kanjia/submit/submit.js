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

    let data = {
      appid: appid,
      buyerPhone: this.data.tel,
      orderNo: this.data.orderNo,
    }
    console.log(data);
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
            console.log(result)
          },
          fail: function (result) {
            wx.navigateTo({
              url: 'plugin://myPlugin/order-detail?orderNo=' + res.orderId,
            });
            console.log(result);
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

})     