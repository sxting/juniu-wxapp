import { personalService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';

Page({
  data: {
    storeName: wx.getStorageSync('storeName'),
    status: 2, //待付款1，待消费2，已完成（已消费3，支付超时4，已退款5）
    orderId: '',
  },

  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    getOrderDetail.call(this);
  },

  // 申请退款 
  goRefund() {
    wx.navigateTo({
      url: '/pages/personal/refund/refund?orderId=' + this.data.orderId,
    })
  }

})

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