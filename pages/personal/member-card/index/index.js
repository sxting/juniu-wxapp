//获取应用实例
import { personalService } from '../../shared/service.js'
import { errDialog } from '../../../../utils/util';
import { constant } from '../../../../utils/constant'

var app = getApp()
Page({
  data: {
    
  },
  onLoad: function () {
  },
  goConsume: function () {
    wx.redirectTo({
      url: '/pages/personal/member-card/consume/consume',
    })
  },
  goDetail: function () {
    wx.redirectTo({
      url: '/pages/personal/member-card/detail/detail',
    })
  }
})