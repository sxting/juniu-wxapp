import { orderService} from 'shared/service.js'
import { errDialog } from '../../utils/util';
//获取应用实例
var app = getApp()
Page({
  data: {
    timeList: ['08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00',],
    storeId: '1498113571836349700342',
    reserveType: '', //预约配置类型 MAN、PRODUCT、TIME 
  },
  onLoad: function () {
    reserveConfig.call(this)
  },
  onCraftsmanClick: function() {
    wx.navigateTo({
      url: '/pages/craftsman/select/select',
    })
  },
  onProductClick: function() {
    wx.navigateTo({
      url: '/pages/product/select/select',
    })
  }
})

// 查询店铺预约配置
function reserveConfig() {
  let data = {
    token: '27f3733b5daeb3d89a53b6c561f5c753',
    storeId: this.data.storeId
  }

  orderService.reserveConfig(data).subscribe({
    next: res => {
      console.log(res);
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}