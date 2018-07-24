// pages/craftsman/select/select.js
import { craftsmanService } from '../shared/service.js'
import { errDialog, changeDate } from '../../../utils/util';
import { constant } from '../../../utils/constant';

Page({
  data: {
    label: '',
    storeId: '',
    reserveList: [],
    staffList: [],
    pageNo: 1,
    pageSize: 6,
    totalPages: 1,
    staffNumber: 0,
    from: ''
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '选择手艺人',
    })
    // this.setData({
    //   storeId: options.storeId,
    //   from: options.from
    // })
    // if (options.label == 'order') {
    //   this.setData({
    //     label: options.label
    //   })
    //   let todayDate = new Date();
    //   let data = {
    //     storeId: this.data.storeId,
    //     date: changeDate(todayDate)
    //   }
    //   craftsmanService.getReserveList(data).subscribe({
    //     next: res => {
    //       console.log(res);
    //       res.forEach((item) => {
    //         item.avatar = constant.OSS_IMAGE_URL + `${item.avatar}/resize_50_50/mode_fill`;
    //       });
    //       this.setData({
    //         staffNumber: res.length,
    //         reserveList: res
    //       })
    //     },
    //     error: err => errDialog(err),
    //     complete: () => wx.hideToast()
    //   })
    // } else {
    //   getStaffList.call(this)
    // }
  },

  onItemClick: function(e) {
    if(this.data.label == 'order') {
      wx.setStorageSync("staffId", e.currentTarget.dataset.staffId)
      wx.setStorageSync("staffName", e.currentTarget.dataset.staffName)
      wx.switchTab({
        url: `/pages/order/order?aa=1`,
        success: function(res) {
          console.log(res);
        }
      })
    } else if (this.data.label == 'comment') {
      wx.redirectTo({
        url: `/pages/comment/making/making?storeId=${this.data.storeId}&staffId=${e.currentTarget.dataset.staffId}&staffName=${e.currentTarget.dataset.staffName}`,
      })
    } else if (this.data.from === 'making') {
      wx.redirectTo({
        url: `/pages/comment/making/making?storeId=${this.data.storeId}&staffId=${e.currentTarget.dataset.staffId}&staffName=${e.currentTarget.dataset.staffName}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/craftsman/detail/detail?storeId=${this.data.storeId}&staffId=${e.currentTarget.dataset.staffId}`,
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
      res.staffAppVOS.forEach((item) => {
        item.headPortrait = constant.OSS_IMAGE_URL + `${item.headPortrait}/resize_50_50/mode_fill`;
      });
      this.setData({
        staffList: res.staffAppVOS,
        totalPages: res.pageInfo.countPage,
        staffNumber: res.pageInfo.countTotal
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}