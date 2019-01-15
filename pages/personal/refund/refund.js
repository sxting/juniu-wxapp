import { personalService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';
import { constant } from '../../../utils/constant';

Page({
  data: {
    orderId: '',
    orderDetail: '',
    jnImg: '/asset/images/product.png',
    success: false
  },

  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    getOrderDetail.call(this);
    loadRefundAmount.call(this);
  },

  onRefundClick() {
    refund.call(this)
  },

  successYBtnClick() {
    this.setData({
      success: false
    })
    wx.navigateBack({
      delta: 2
    })
  }
  
})

// 申请退款 
function refund() {
  let data = {
    orderId: this.data.orderId
  }
  personalService.refund(data).subscribe({
    next: res => {
      this.setData({
        success: true
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
//预计退款金额
function loadRefundAmount(){
  let data={orderId:this.data.orderId}
  personalService.getRefundAmountInfo(data).subscribe({
    next:res=>{
      this.setData({
        canRefundAmount: res.INIT/100
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}
// 订单详情  
function getOrderDetail() {
  let data = {
    orderId: this.data.orderId
  }
  personalService.getOrderDetail(data).subscribe({
    next: res => {
      if (res.orderItem[0] && res.orderItem[0].picId) {
        res.orderItem[0].picId = constant.OSS_IMAGE_URL + `${res.orderItem[0].picId}/resize_80_60/mode_fill`;
      }
      this.setData({
        orderDetail: res
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}