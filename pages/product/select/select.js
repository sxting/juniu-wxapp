// pages/product/select/select.js
import { productService } from '../shared/service.js'
import { errDialog, changeDate } from '../../../utils/util';
Page({
  data: {
    icon20: 'http://i.zeze.com/attachment/forum/201610/30/150453u3oo7n3c702j7f08.jpg',
    storeId: '1498790748991165413217',
    productList: [],
    craftsmanId: '',
    craftsmanName: '',
    pageSize: 7,
    pageNo: 1,
    totalPages: 1,
    searchLoading: false,
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
      getProductList.call(this)
    }
  },

  //上拉加载更多
  scrolltolower: function() {
    console.log(this.data.pageNo)
    if (this.data.pageNo == this.data.totalPages) {
      return;
    }
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    getProductList.call(this)
  },

  //点击商品 
  onItemClick: function(e) {
    if (this.data.craftsmanId) {
      wx.redirectTo({
        url: `/pages/order/order?craftsmanId=${this.data.craftsmanId}&craftsmanName=${this.data.craftsmanName}&productId=${e.currentTarget.dataset.productId}&productName=${e.currentTarget.dataset.productName}&price=${e.currentTarget.dataset.price}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/product/detail/detail?productId=${e.currentTarget.dataset.productId}`,
      })
    }
  },

})

// 获取商品列表
function getProductList() {
  let data = {
    storeId: this.data.storeId,
    pageNo: this.data.pageNo,
    pageSize: this.data.pageSize
  }
  productService.getProductList(data).subscribe({
    next: res => {
      this.setData({
        productList: this.data.productList.concat(res.content),
        totalPages: res.totalPages
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}