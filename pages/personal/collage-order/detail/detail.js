import { personalService } from '../../shared/service.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    pictureUrl: '/asset/images/product.png',
    restHour: '',
    restMinute: '',
    restSecond: '',
    phone: '15210921650',
    groupId: '',
    pinTuanId: '',
    collageStatus: 'JOINING',
    pinTuanName: '发型总监设计拼团活动周年庆',
    presentPrice: 880,
    collageNumber: 6,
    dealGroupNumber: 888,
    transNo: '21667439824673289497',
    groupNo: '21667439824673289497',
    orderNo: '21667439824673289497',
    orderTime: '2018-08-11 12:00:00',
    arrCollageImageShow: [ '' , ''],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单详情',
    })
    this.setData({
      orderNo: options.orderNo ? options.orderNo : ''
    })
    getCollageOrderDetail.call(this);
  },

  /**
   * 邀请好友参团
   */
  onShareAppMessage: function (res) {
    console.log(0);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: wx.getStorageSync('订单分享'),
      path: '/pages/collage/product-detail/product-detail?groupId=' + this.data.groupId + '&pinTuanId=' + this.data.pinTuanId,
      success: function (res) {
        // 转发成功
        console.log(res);
      },
      fail: function (res) {
        // 转发失败
        console.log(res);
      }
    }
  },

  // 拨打电话
  onTelClick() {
    let self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.phone
    })
  }
})

// 获取订单详情页面
function getCollageOrderDetail() {
  // 拼团数据
  let expireTime = '2018-08-11 20:14:18';
  let time = new Date(expireTime).getTime() - new Date().getTime();
  let hours = parseInt(time / 1000 / 60 / 60 + '');
  let minutes = parseInt(time / 1000 / 60 - hours * 60 + '');
  let seconds = parseInt(time / 1000 - minutes * 60 - hours * 3600 + '');
  let countDownTime = (hours.toString().length < 2 ? '0' + hours : hours) + ':' +
    (minutes.toString().length < 2 ? '0' + minutes : minutes) + ':' +
    (seconds.toString().length < 2 ? '0' + seconds : seconds);
  this.setData({
    restHour: hours.toString().length < 2 ? '0' + hours : hours,
    restMinute: minutes.toString().length < 2 ? '0' + minutes : minutes,
    restSecond: seconds.toString().length < 2 ? '0' + seconds : seconds,
  })

  /*倒计时*/
  let self = this;
  let downTime = '2000/01/01';
  console.log(new Date(downTime + ' ' + countDownTime).getHours().toString() === '0' && new Date(downTime + ' ' + countDownTime).getMinutes().toString() === '0' && new Date(downTime + ' ' + countDownTime).getSeconds().toString() === '0');
  let timer = setInterval(function () {
    if (new Date(downTime + ' ' + countDownTime).getHours().toString() === '0' && new Date(downTime + ' ' + countDownTime).getMinutes().toString() === '0' && new Date(downTime + ' ' + countDownTime).getSeconds().toString() === '0') {
      countDownTime = '00:00:00';
      clearInterval(timer);
    } else {
      let times = new Date(new Date(downTime + ' ' + countDownTime).getTime() - 1000);
      countDownTime =
        (times.getHours().toString().length < 2 ? '0' + times.getHours() : times.getHours()) + ':' +
        (times.getMinutes().toString().length < 2 ? '0' + times.getMinutes() : times.getMinutes()) + ':' +
        (times.getSeconds().toString().length < 2 ? '0' + times.getSeconds() : times.getSeconds());
    }
    self.setData({
      restHour: countDownTime.substring(0, 2),
      restMinute: countDownTime.substring(3, 5),
      restSecond: countDownTime.substring(6)
    })
  }, 1000)
}
  


