import { personalService } from '../../shared/service.js';
import { errDialog, loading } from '../../../../utils/util';
import { constant } from '../../../../utils/constant'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [
      { 
        typeText: '全部',
        status: ''
      },
      {
        typeText: '待付款',
        status: 'PRE_PAYMENT'
      },
      {
        typeText: '待成团',
        status: 'JOINING_GROUP'
      },
      {
        typeText: '待消费',
        status: 'FINISHED_GROUP'
      },
      {
        typeText: '已完成',
        status: 'FINISHED'
      }
    ],
    tabIndex: 0,
    status: '', // CLOSE 已取消， 
    productImg: '/asset/images/product.png',
    collageListInfor: [],
    groupId: '',
    storeId: ''
  },

  onLoad: function () {
    let self = this;
    this.setData({
      storeId: wx.getStorageSync(constant.STORE_INFO)
    })
    wx.setNavigationBarTitle({
      title: '拼团订单',
    })
    // 获取拼团订单列表
    getCollageOrderList.call(self);
  },

  // tab切换 
  onTabClick(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index,
      status: e.currentTarget.dataset.status
    })
  },

  /**
   * 立即支付
   */ 
  payImmediate: function () {
    orderPayment.call(this);
  },

  /** 取消 */ 
  cancelClick: function (e) {
    console.log(e.currentTarget.dataset.orderno);
    let orderId = e.currentTarget.dataset.orderno;
    let data = {
      orderNo: orderId,
      platform: 'WECHAT_SP'
    }
    personalService.cancelFunction(data).subscribe({
      next: res => {
        if (res) {
          console.log(res);
          wx.navigateTo({
            url: '/pages/personal/collage-order/detail/?orderNo=' + orderId
          })
        }
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let self = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      let activityId = res.target.dataset.activityid;
      let groupNo = res.target.dataset.groupid;

      console.log(groupNo)
      return {
        title: wx.getStorageSync('订单分享'),
        path: '/pages/collage/product-detail/product-detail?groupId=' + groupNo + '&activityId=' + activityId + '&storeId=' + self.data.storeId + '&type=share',
        success: function (res) {
          // 转发成功
          console.log(res);
        },
        fail: function (res) {
          // 转发失败
          console.log(res);
        }
      }
    }
  },
  
  //  立即评价
  evaluationImmediate: function(e){
    console.log(e.currentTarget.dataset.activityid);
    wx.navigateTo({
      url: '/pages/comment/making/making?productId=' + e.currentTarget.dataset.activityid
    })
  }
})

/**  获取拼团列表 ***/ 
function getCollageOrderList(){
  let data = {
    // belongTo: wx.getStorageSync(constant.MERCHANTID),
    // buyerId: wx.getStorageSync(constant.USER_ID),
    platform: 'WECHAT_SP'
  }
  console.log(data);
  personalService.getCollageListInfor(data).subscribe({
    next: res => {
      if (res) {
        console.log(res);
        let arrCollagesList = res.elements ? res.elements : [];
        arrCollagesList.forEach(function(item){
          item.activityName = item.activityName&&item.activityName.length > 8 ? item.activityName.substring(0, 8) + '...' : item.activityName;
          item.picUrl = item.imageUrl ? constant.OSS_IMAGE_URL + `${item.imageUrl}/resize_750_360/mode_fill` : '';
        })
        this.setData({
          collageListInfor: arrCollagesList
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

/*** 立即支付 ***/ 
function orderPayment() {
  let self = this;
  let data = {
    activityId: this.data.activityId,
    appid: this.data.appid,
    storeId: wx.getStorageSync(constant.STORE_INFO),
    platform: 'WECHAT_SP'
  }
  personalService.paymentSubmit(data).subscribe({
    next: res => {
      console.log(res);
      if (res){
        /** 微信支付 */ 
        wx.requestPayment({
          success: function (res) {

          },
          fail: function (result) {
            console.log(result);
          },
          complete: function (result) {
            console.log(result);
          }
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}