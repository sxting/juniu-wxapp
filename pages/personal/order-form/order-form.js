import { personalService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['全部', '待付款', '待消费', '已完成'],
    tabIndex: 0,
    status: '', // CLOSE 已取消，  
    orderList: []
  },

  onLoad: function (options) {
    getOrderList.call(this)
  },

  onTabClick(e) {
    let index = e.currentTarget.dataset.index;
    let status = '';
    if(index == 1) {
      status = ''
    } else if (index == 2) {
      status = ''
    } else if (index == 3) {
      status = ''
    } else {
      status = ''
    }
    this.setData({
      tabIndex: index,
      status: status
    })
    getOrderList.call(this)
  },

  onItemClick(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/personal/order-form-detail/order-form-detail?orderId=' + e.currentTarget.dataset.orderid,
    })
  },

  onCommentClick: function (e) {
    wx.navigateTo({
      url: '/pages/comment/making/making?productId=' + e.currentTarget.dataset.productid,
    })
  }
  
})


// 订单列表 
function getOrderList() {
  let data = {
    status: this.data.status
  }
  personalService.getOrderList(data).subscribe({
    next: res => {
      res.forEach(function(item) {
        item.callBack = JSON.parse(item.callBack);
        console.log(item.orderId)
      })
      this.setData({
        orderList: res
      })
      
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}