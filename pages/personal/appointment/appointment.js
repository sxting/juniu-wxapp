import { personalService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';
//获取应用实例
var app = getApp()
Page({
  data: {
    appointmentInfo: {}
  },

  onLoad: function (options) {
    personalService.reserveConfig().subscribe({
      next: res => {
        this.setData({
          appointmentInfo: res
        });
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },
})
