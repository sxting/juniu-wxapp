// pages/personal/comment/detail/detail.js
import { collageService } from '../shared/collage.service';
import { errDialog, loading } from '../../../utils/util';
import { constant } from '../../../utils/constant';
Page({
  data: {
    jnImg: '/asset/images/product.png',
    storeName: wx.getStorageSync('storeName')
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '项目详情',
    })
   
  },

  onShow: function () {

  }
})
