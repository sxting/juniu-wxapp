// pages/craftsman/select/select.js
import { craftsmanService } from '../shared/service.js'
import { errDialog, changeDate } from '../../../utils/util';
Page({
  data: {
    label: '',
    storeId: '1498790748991165413217',
    reserveList: [],
    staffList: [],
    pageNo: 1,
    pageSize: 6,
    totalPages: 1,
  },

  onLoad: function (options) {
    if (options.label == 'order') {
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
    } else {
      getStaffList.call(this)
    }
  },

  onItemClick: function(e) {
    if(this.data.label == 'order') {
      wx.redirectTo({
        url: `/pages/order/order?craftsmanId=${e.currentTarget.dataset.staffId}&craftsmanName=${e.currentTarget.dataset.staffName}`,
      })
    } else if (this.data.label == 'comment') {
      wx.redirectTo({
        url: `/pages/comment/making/making?staffId=${e.currentTarget.dataset.staffId}&staffId=${e.currentTarget.dataset.staffName}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/craftsman/detail/detail?staffId=${e.currentTarget.dataset.staffId}`,
      })
    }
  },

  onScrollTolower: function() {
    if (this.data.pageNo == this.data.totalPages) {
      return;
    }
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    getStaffList.call(this)
  }
})

// 查询员工列表
function getStaffList() {
  let data = {
    storeId: this.data.storeId,
    pageNo: this.data.pageNo,
    pageSize: this.data.pageSize
  }
  craftsmanService.getStaffList(data).subscribe({
    next: res => {
      this.setData({
        staffList: res.staffAppVOS,
        totalPages: res.pageInfo.countPage
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}