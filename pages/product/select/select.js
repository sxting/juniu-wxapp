// pages/product/select/select.js
import { productService } from '../shared/service.js'
import { errDialog, changeDate } from '../../../utils/util';
Page({
  data: {
    icon20: 'http://i.zeze.com/attachment/forum/201610/30/150453u3oo7n3c702j7f08.jpg',
    productList: [],
    craftsmanId: '',
    craftsmanName: '',
  },

  onLoad: function (options) {
    this.setData({
      craftsmanId: options.craftsmanId,
      craftsmanName: options.craftsmanName
    })
    let data = {
      token: '27f3733b5daeb3d89a53b6c561f5c753',
      staffId: options.craftsmanId
    }
    productService.getStaffProduct(data).subscribe({
      next: res => {
        this.setData({
          productList: res
        })
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  }
})