import { constant } from '../../../../utils/constant';
import { service } from '../../../../service';
import { shopService } from '../../shared/shop.service.js'
import { errDialog, workDataFun } from '../../../../utils/util';

Page({
  data: {
    storeId: wx.getStorageSync(constant.STORE_INFO),
    imgHttpUrl: constant.OSS_IMAGE_URL,
    bigImage: '',
    imageList: [],
    worksList: [],
    imageWidth: 168,
    imageLitleWidth: 60,
    getUserInfo: true,
    productionId: '',
    title: ''
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '图片详情',
    })
    this.setData({
      productionId: options.productionId,
      storeId: wx.getStorageSync(constant.STORE_INFO)
    })
    if (options.type && options.type === 'share') {
      this.setData({
        storeId: options.storeId
      })
      wx.setStorageSync(constant.STORE_INFO, this.data.storeId);
    } 
    getData.call(this);
  },

  onLittleImgClick(e) {
    let index = e.currentTarget.dataset.item.index;
    this.setData({
      bigImage: this.data.imageList[index]
    })
  },

  onShareAppMessage: function (res) {
    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/login/login?type=share&productionId=' + this.data.productionId + '&page=' + constant.page.image,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    }
  },

  /*点击其他作品*/
  onOtherWorkItemClick(e) {
    console.log(e.currentTarget.dataset.item);
    let item = e.currentTarget.dataset.item;
    this.setData({
      productionId: item.productionId
    });
    if (item.sourceType === "IMAGE") {
      getData.call(this);
    } else {
      wx.redirectTo({
        url: '/pages/shop/video/detail/detail?productionId=' + item.productionId
      })
    }
  } 

})

function getData() {
  let data = {
    productionId: this.data.productionId
  }
  let self = this;
  shopService.getStaffProductionDetail(data).subscribe({
    next: res => {
      this.setData({
        worksList: workDataFun(res.other, self.data.imageWidth),
        title: res.production.title
      })
      let imageList = []
      res.production.merchantMediaDTOS.forEach(function(item, i) {
        imageList.push({
          url: constant.OSS_IMAGE_URL + `${item.sourceId}/resize_60_60/mode_fill`,
          index: i,
          sourceId: item.sourceId
        })
      })

      this.setData({
        imageList: imageList,
        bigImage: imageList[0]
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}