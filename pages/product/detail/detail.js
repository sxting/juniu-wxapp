import { productService } from '../shared/service.js'
import { errDialog, changeDate } from '../../../utils/util';
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    productId: '',
    productInfo: {}
  },
  onLoad: function (options) {
    this.setData({
      productId: options.productId
    })
    getProductDetail.call(this);
  }
})

// 商品详情
function getProductDetail() {
  let data = {
    productId: this.data.productId
  }
  productService.getProductDetail(data).subscribe({
    next: res => {
      this.setData({
        productInfo: res
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}