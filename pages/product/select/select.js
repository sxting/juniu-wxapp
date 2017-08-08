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
    if (options.craftsmanId) {
      this.setData({
        craftsmanId: options.craftsmanId,
        craftsmanName: options.craftsmanName
      })
      let data = {
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
    } else {
      
    }
  },

  onItemClick: function(e) {
    wx.redirectTo({
      url: `/pages/order/order?craftsmanId=${this.data.craftsmanId}&craftsmanName=${this.data.craftsmanName}&productId=${e.currentTarget.dataset.productId}&productName=${e.currentTarget.dataset.productName}&price=${e.currentTarget.dataset.price}`,
    })
    
  }
})