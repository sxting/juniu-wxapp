import { productService } from '../shared/service.js'
import { errDialog, changeDate } from '../../../utils/util';
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
    countTotal: 1,
    storeId: ''
  },

  onLoad: function (options) {
    this.setData({
      productId: options.productId,
      storeId: options.storeId
    })
    getProductDetail.call(this);
    getProductCommentList.call(this)
  },

  onScrollTolower: function () {
    if (this.data.pageIndex == this.data.countTotal) {
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
      });

      this.setData({
        commentList: res.comments,
        countTotal: res.pageInfo.countTotal
      })

    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
} 