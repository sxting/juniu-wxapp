var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
import { personalService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';
import { constant } from '../../../utils/constant';
// 类型 UNUSED(可使用)，USED(已使用)，OVERDUE(已过期)
Page({
  data: {
    tabs: ["可使用", "已使用", "已过期"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    storeId: ''
  },
  onLoad: function () {
    var that = this;
    this.setData({
      storeId: wx.getStorageSync(constant.STORE_INFO)
    });
    getMyTicket.call(this, this.data.storeId, 'UNUSED');
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});
// 获取我的优惠券
function getMyTicket(storeId, couponStatus) {
  let self = this;
  personalService.myTicket({
    storeId: storeId,
    couponStatus: couponStatus
  }).subscribe({
    next: res => {
      console.log(res)
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}