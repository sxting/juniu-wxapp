import { constant } from '../../../utils/constant';
import { service } from '../../../service';
import { shopService } from '../shared/shop.service.js'
import { errDialog, workDataFun } from '../../../utils/util';
import { craftsmanService } from '../../craftsman/shared/service.js'

Page({
  data: {
    storeId: wx.getStorageSync(constant.STORE_INFO),
    imageWidth: 168,
    storeInfo: '',
    worksList: [],
    environmentArr: [],
    bannerCollArr: []
  },

  onShow: function (options) {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('storeName'),
    })
    this.setData({
      storeId: wx.getStorageSync(constant.STORE_INFO)
    })
    getStoreInfo.call(this);
    getWorkList.call(this);
  },

  onTelClick() {
    let self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.storeInfo.mobile
    })
  },

  goWorkDetail(e) {
    let type = e.currentTarget.dataset.type
    if (type === 'VIDEO') {
      wx.navigateTo({
        url: '/pages/shop/video/detail/detail?productionId=' + e.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/shop/image/detail/detail?productionId=' + e.currentTarget.dataset.id,
      })
    }
  }

})

function getStoreInfo() {
  let data = {
    storeId: this.data.storeId
  }
  shopService.storeInfoDetail(data).subscribe({
    next: res => {
      if (res.label) {
        res.labelArr = res.label.split(' ')
      }
      let environmentArr = [], bannerCollArr = [];
      if (res.environment) {
        let arr = res.environment.split(',');
        arr.forEach(function (item) {
          environmentArr.push(constant.OSS_IMAGE_URL + `${item}/resize_345_239/mode_fill`)
        })
      }
      res.bannerColl.forEach(function (item) {
        bannerCollArr.push(constant.OSS_IMAGE_URL + `${item}/resize_345_260/mode_fill`)
      })

      this.setData({
        storeInfo: res,
        environmentArr: environmentArr,
        bannerCollArr: bannerCollArr
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

function getWorkList() {
  let data = {
    id: this.data.storeId,
    type: 'STORE'
  };
  let self = this;
  craftsmanService.getStaffProductionList(data).subscribe({
    next: res => {
      this.setData({
        worksList: workDataFun(res, self.data.imageWidth)
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
