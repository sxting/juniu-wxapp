
import { collageService } from '../shared/collage.service';
import { errDialog, loading } from '../../../utils/util';
import { constant } from '../../../utils/constant';
import { homeService } from '../../home/shared/home.service';
import { service } from '../../../service';

Page({
  data: {
    jnImg: '/asset/images/product.png',
    data: ''
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '提交订单',
    })
    this.setData({
      data: options
    })
  },

  // 点击提交订单
  onSubmitClick() {
    orderSubmit.call(this);
  }

})

// 订单提交
function orderSubmit() {
  let self = this;
  let data = {
    storeId: wx.getStorageSync(constant.STORE_INFO)
  }
  collageService.pay(data).subscribe({
    next: res => {
      
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}



