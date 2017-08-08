// pages/craftsman/select/select.js
import { craftsmanService } from '../shared/service.js'
import { errDialog, changeDate } from '../../../utils/util';
Page({
  data: {
    icon20: 'http://i.zeze.com/attachment/forum/201610/30/150453u3oo7n3c702j7f08.jpg',
    storeId: '1498790748991165413217',
    reserveList: [],
  },

  onLoad: function (options) {
    let todayDate = new Date(); 
    let data = {
      storeId: this.data.storeId,
      date: changeDate(todayDate),
      token: '27f3733b5daeb3d89a53b6c561f5c753'
    }
    craftsmanService.getReserveList(data).subscribe({
      next: res => {
        console.log(res);
        this.setData({
          reserveList: res
        })
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },

  onItemClick: function(e) {
    wx.redirectTo({
      url: `/pages/order/order?craftsmanId=${e.currentTarget.dataset.staffId}&craftsmanName=${e.currentTarget.dataset.staffName}`,
    })
  }
})