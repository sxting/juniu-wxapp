import { constant } from '../../../../utils/constant';
import { service } from '../../../../service';
import { shopService } from '../../shared/shop.service.js'
import { errDialog, workDataFun } from '../../../../utils/util';

Page({
  data: {
    storeId: wx.getStorageSync(constant.STORE_INFO),
    bigImage: '/asset/images/pintuan_head1.jpg',
    worksList: [],
    imageWidth: 168,
    showVideo: false,
    src: '',
    productionId: '', 
    title: ''   
  },
  
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '视频详情',
    })
    this.setData({
      productionId: options.productionId,
      storeId: wx.getStorageSync(constant.STORE_INFO)
    })
    this.videoCtx = wx.createVideoContext('myVideo');
    if (options.type && options.type === 'share') {
      this.setData({
        storeId: options.storeId
      })
      wx.setStorageSync(constant.STORE_INFO, this.data.storeId);
    } 
    getData.call(this);
  },

  showVideo() {
    let data = {
      videoId: this.data.bigImage.sourceId.split(',')[1]
    }
    shopService.getVideoUrlById(data).subscribe({
      next: res => {
        this.setData({
          showVideo: true,
          src: res
        })
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },

  closeVideo() {
    this.setData({
      showVideo: false
    })
  },

  stopEvent() {},

  //分享 
  onShareAppMessage: function (res) {
    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/login/login?type=share&productionId=' + this.data.productionId + '&storeId=' + this.data.storeId + '&page=' + constant.page.video,
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
    let item = e.currentTarget.dataset.item;
    this.setData({
      productionId: item.productionId
    });
    if (item.sourceType === "VIDEO") {
      getData.call(this);
    } else {
      wx.redirectTo({
        url: '/pages/shop/image/detail/detail?productionId=' + item.productionId
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
      res.production.merchantMediaDTOS.forEach(function (item, i) {
        imageList.push({
          url: constant.OSS_IMAGE_URL + `${item.sourceId.split(',')[0]}/resize_345_200/mode_fill`,
          index: i,
          sourceId: item.sourceId
        })
      })

      this.setData({
        bigImage: imageList[0]
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}