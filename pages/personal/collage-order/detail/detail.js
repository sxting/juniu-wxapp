import { personalService } from '../../shared/service.js';
import { errDialog, loading } from '../../../../utils/util';

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
    phone: '',
    groupId: '',
    activityId: '',
    collageStatus: '',
    orderDetailArr: {},//订单信息
    activityName: '',
    collageNumber: 0,
    remainingNumber: 0,
    hadCollageNumber: 0,
    groupNo: '',
    arrCollageImageShow: [ ],
    remainingCollages: [],
    settleCode: '',
    voucherOrderTime: '',
    voucherStatus: ''
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
    // 调取订单详情接口
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
      path: '/pages/collage/product-detail/product-detail?groupId='+ this.data.groupId + '&activityId=' + this.data.activityId + 'type=share',
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
  },
})


// 获取订单详情页面
function getCollageOrderDetail() {
  let self = this;
  let data = {
    orderNo: this.data.orderNo
  }
  // personalService.getCollageOrderDetail(data).subscribe({
  //   next: res => {
  //     if (res) {
  //       console.log(res);

  //     }
  //   },
  //   error: err => errDialog(err),
  //   complete: () => wx.hideToast()
  // })
  let res = {
    activityCover: '',
    activityId: '111111',
    activityName: '发型总监设计发型总监设计哈哈哈哈',
    activityPrice: 18800,
    applyStores: [
      {
        current: true,
        storeAddress: '学清路静淑里6号楼底商',
        storeId: '8888888888',
        storeName: '丽韵尚度美发沙龙',
        storePhones: [
          '15210921650'
        ]
      }
    ],
    currentGroup: {
      expireTime: '2018-08-11T06:58:11.936Z',
      picUrls: [
        '/asset/images/head-portrait.png', '/asset/images/head-portrait.png'
      ],
      status: ''
    },
    finishedGroupCount: 888,
    groupNo: '21667439824673289497',
    groupStatus: '',
    orderNo: '21667439824673289488',
    orderStatus: 'CLOSE',
    orderTime: '2018-08-11 12:30:16',
    paymentPrice: 10000,
    peopleCount: 10,
    voucher: {
      enableRefund: true,
      orderNo: '',
      orderStatus: '',
      phone: '15210921650',
      settleCode: '4385 4754 5457',
      settleStatus: '',
      settleStoreName: '发型总监设计拼团活动周年庆',
      settleTime: '2018-08-11T06:58:11.936Z'
    }
  };
  let remainingNumber = res.currentGroup ? Number(res.peopleCount) - Number(res.currentGroup.picUrls.length) : 0;//剩余拼团人数
  /*图片逻辑*/
  let collagesImage = res.currentGroup ? res.currentGroup.picUrls : [];
  if (res.peopleCount > 4) {
    this.data.arrCollageImageShow = collagesImage.slice(0, 3);
  } else {
    this.data.arrCollageImageShow = collagesImage;
  }
  /* 未拼团图像*/
  let remainingCollagesArr = [];
  if (remainingNumber > 0 && res.currentGroup) {
    if (Number(res.peopleCount) > 4 && Number(res.currentGroup.picUrls.length) === 1) {
      for (let i = 0; i < 2; i++) {
        let list = '';
        remainingCollagesArr.push(list);
      }
    } else if (Number(res.peopleCount) > 4 && Number(res.currentGroup.picUrls.length) === 2) {
      for (let i = 0; i < 1; i++) {
        let list = '';
        remainingCollagesArr.push(list);
      }
      return;
    } else if (Number(res.peopleCount) > 4 && Number(res.currentGroup.picUrls.length) >= 3) {
      remainingCollagesArr = [];
    } else {
      for (let i = 0; i < remainingNumber; i++) {
        let list = '';
        remainingCollagesArr.push(list);
      }
    }
  }
  /* 拼团成功 */
  let settleCode = res.voucher ? res.voucher.settleCode : '';
  // let voucherOrderTime = res.voucher ? formatDateTime.call(self,new Date(res.voucher.settleTime.replace(/-/g, '/'))) : '';
  let voucherOrderTime = res.voucher.settleTime;
  let voucherStatus = '';//拼团成功以后的状态
  if (res.orderStatus == 'FINISH') {
    if (res.voucher.settleStatus === 'VALID') {
      voucherStatus = '未使用';
    } else if (res.voucher.settleStatus === 'SETTLE') {
      voucherStatus = '已核销';
    } else if (res.voucher.settleStatus === 'EXPIRE_REFUND') {
      voucherStatus = '已过期';
    } else {
      voucherStatus = '已退款';
    }
  }

    this.setData({
      activityName: res.activityName.length > 8 ? res.activityName.substring(0, 8) + '...' : res.activityName,
      collageStatus: res.orderStatus,
      orderDetailArr: res,
      activityId: res.activityId,
      collageNumber: res.peopleCount,
      phone: res.applyStores[0].storePhones[0],
      hadCollageNumber: res.currentGroup.picUrls.length,
      remainingNumber: remainingNumber,
      arrCollageImageShow: this.data.arrCollageImageShow,
      remainingCollages: remainingCollagesArr,
      settleCode: settleCode,
      voucherOrderTime: voucherOrderTime,
      voucherStatus: voucherStatus
    })
    console.log(this.data.arrCollageImageShow);
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
    let downTime = '2000/01/01';
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
