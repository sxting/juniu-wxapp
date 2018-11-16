import { constant } from '../../../utils/constant';

Page({
  data: {
    storeAddress: '学清路静淑里6号楼底商',
    imageWidth: 168,
    worksList: []
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('storeName'),
    })
    getWorkList.call(this)
  },
 
  goWorkDetail(type) {
    if(type === 'video') {
      wx.navigateTo({
        url: '/pages/shop/video/detail/detail',
      })
    } else {
      wx.navigateTo({
        url: '/pages/shop/image/detail/detail',
      })
    }
  }

})

function getWorkList() {
  let resData = [
    {
      name: '最潮短发设计女生',
      picId: 'kLBwUYVJW_xy_1.2',
    },
    {
      name: '最潮短发设计女生',
      picId: 'kLBwUYVJW_xy_0.8',
    },
    {
      name: '最潮短发设计女生',
      picId: 'kLBwUYVJW_xy_1',
    },
    {
      name: '最潮短发设计女生',
      picId: 'kLBwUYVJW_xy_0.5',
    },
    {
      name: '最潮短发设计女生最潮短发设计女生',
      picId: 'kLBwUYVJW_xy_1.4',
    },
    {
      name: '最潮短发设计女生',
      picId: 'kLBwUYVJW_xy_1',
    },
    {
      name: '最潮短发设计女生',
      picId: 'kLBwUYVJW_xy_0.5',
    },
    {
      name: '最潮短发设计女生',
      picId: 'kLBwUYVJW_xy_1.4',
    }
  ];

  let self = this;
  resData.forEach(function(item) {
    let index = item.picId.lastIndexOf('_');
    let picId = item.picId.slice(0, index);
    let scale = item.picId.slice(index + 1, item.picId.length);
    item.height = Math.floor(self.data.imageWidth / scale);
    item.url = constant.OSS_IMAGE_URL + `${picId}/resize_${self.data.imageWidth}_${item.height}/mode_fill`
  })

  this.setData({
    worksList: resData
  })
}