import { shopService } from 'shared/shop.service';
import { errDialog } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    tell: '010-90441899',
    addr: '北京市朝阳区红军营南路媒体村8号楼',
    time: '09:00-21:00',
    storeId: '',
    storeName: wx.getStorageSync('storeName')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      storeId: options.storeId,
    })
    getStoreInfo.call(this, this.data.storeId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  // goHome: function() {
  //   wx.redirectTo({
  //     url: '/pages/index/index'
  //   })
  // },
  makeCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.tell
    })
  }
})

//获取门店信息
function getStoreInfo(storId) {
  let self = this;
  shopService.storeInfoDetail({ storeId: storId }).subscribe({
    next: res => {
      self.setData({
        addr: res.address,
        tell: res.mobie,
        time: res.businessStart + '-' + res.businessEnd,
        markers: [{
          id: 0,
          latitude: res.latitude,
          longitude: res.longitude,
          width: 50,
          height: 50
        }],
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}