import { personalService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';

Page({
  data: {
    orderId: ''
  },

  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    getOrderDetail.call(this);
  },

  onRefundClick() {
    refund.call(this)
  }
  
})

// 申请退款 
function refund() {
  let data = {
    orderId: this.data.orderId
  }
  personalService.refund(data).subscribe({
    next: res => {
      wx.navigateBack()
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 订单详情  
function getOrderDetail() {
  let data = {
    orderId: this.data.orderId
  }
  personalService.getOrderDetail(data).subscribe({
    next: res => {

    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}