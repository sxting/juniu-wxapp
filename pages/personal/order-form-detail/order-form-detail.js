import { personalService } from '../shared/service.js';
import { homeService } from '../../home/shared/home.service';
import { errDialog } from '../../../utils/util';
import { constant } from '../../../utils/constant';
var wxbarcode = require('../../../utils/index.js');

Page({
  data: {
    storeName: wx.getStorageSync('storeName'),
    status: 2, //待付款1，待消费2，已完成（已消费3，支付超时、已取消4，已退款5）
    orderId: '',
    jnImg: '/asset/images/product.png',
    recordType: ''
  },

  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    getOrderDetail.call(this);
    getStoreInfo.call(this, wx.getStorageSync(constant.STORE_INFO))
  },

  // 申请退款 
  goRefund() {
    if (this.data.recordType == 'BUCKLECARD') {
      errDialog('该订单为会员卡扣卡，不可退款')
      return;
    }
    wx.navigateTo({
      url: '/pages/personal/refund/refund?orderId=' + this.data.orderId,
    })
  },

  // 拨打电话
  onTelClick() {
    let self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.tel
    })
  },

})

// 订单详情  
function getOrderDetail() {
  let data = {
    orderId: this.data.orderId
  }
  personalService.getOrderDetail(data).subscribe({
    next: res => {
      wx.setNavigationBarTitle({
        title: res.statusName,
      })
      let status = 3;
      switch (res.status) {
        case 'INIT':
          status = 1;
          break;
        case 'PAID':
          status = 2;
          break;
        case 'FINISH':
          status = 3;
          break; 
        case 'CLOSE':
          status = 4;
          break;
        case 'REFUND':
          status = 5;
          break;
      }
      if (res.orderItem[0] && res.orderItem[0].picId) {
        res.orderItem[0].picId = constant.OSS_IMAGE_URL + `${res.orderItem[0].picId}/resize_80_60/mode_fill`;
      }
      let date = new Date(res.payDate)
      res.payDate = date.getFullYear() + '-' + date.getMonth()+1 + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      this.setData({
        status: status,
        orderDetail: res,
        recordType: res.recordType
      })

      let self = this;
      res.vouchers.forEach(function(item, index) {
        wxbarcode.barcode('barcode'+index, item.voucherCode, 520, 186);
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

//获取门店信息
function getStoreInfo(storId) {
  let self = this;
  homeService.storeInfoDetail({ storeId: storId }).subscribe({
    next: res => {
      self.setData({
        storeAddress: res.address,
        tel: res.mobie
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}