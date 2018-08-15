import { personalService } from '../../shared/service.js';
import { errDialog, loading } from '../../../../utils/util';
import { constant } from '../../../../utils/constant'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{ typeText: '全部',status: ''},{ typeText: '待付款',status: 'PRE_PAYMENT'},{ typeText: '待成团',status: 'JOINING_GROUP'},{ typeText: '待消费',status: 'FINISHED_GROUP'},{ typeText: '已完成',status: 'FINISHED'}],
    tabIndex: 0,
    status: '', // CLOSE 已取消， 
    productImg: '/asset/images/product.png',
    collageListInfor: [],
    groupId: '',
    storeId: '',
    prePaymentArrData: [],//待付款
    joiningGroupArrData: [],//待成团
    finishedGroupArrData: [],//待消费
    finishedArrData: []//已完成
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
    console.log(this.data.status);
    let arrData = [];
    if (this.data.status === 'PRE_PAYMENT'){//待付款
      arrData = this.data.prePaymentArrData;
    } else if (this.data.status === 'JOINING_GROUP') {//待成团
      arrData = this.data.joiningGroupArrData;
    } else if (this.data.status === 'FINISHED_GROUP'){//待消费
      arrData = this.data.finishedGroupArrData;
    } else if (this.data.status === 'FINISHED'){//已完成
      arrData = this.data.finishedArrData;
    }else{//全部
      getCollageOrderList.call(this);
    }
    this.setData({
      collageListInfor: arrData
    })
  },

  /** 点击团单到订单详情页 */ 
  checkOrderDetailInfor: function(e){
    console.log(e.currentTarget.dataset.orderno);
    let orderno = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: '/pages/personal/collage-order/detail/detail?orderNo=' + orderno
    })
  },

  /*** 立即支付 */ 
  payImmediate: function (e) {
    let orderno = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: '/pages/personal/collage-order/detail/detail?orderNo=' + orderno
    })
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
    platform: 'WECHAT_SP'
  }
  personalService.getCollageListInfor(data).subscribe({
    next: res => {
      if (res) {
        console.log(res);
        /** orderStatus的状态值
         * 
         * 预支付: PRE_PAYMENT
         * 
         * 已支付: PAID
         * 
         * 支付超时: PAYMENT_TIMEOUT
         * 
         * 支付取消: CANCEL
         * 
         **/ 
        let arrCollagesList = res.elements ? res.elements : [];
        let prePaymentArr = []; 
        let joiningGroupArr = []; 
        let finishedGroupArr = []; 
        let finishedArr = [];
        arrCollagesList.forEach(function(item){
          item.activityName = item.activityName&&item.activityName.length > 8 ? item.activityName.substring(0, 8) + '...' : item.activityName;
          item.picUrl = item.imageUrl ? constant.OSS_IMAGE_URL + `${item.imageUrl}/resize_100_75/mode_fill` : '';
          if (item.orderStatus === 'PAID'){//已经支付





          }else{
            if (item.orderStatus === 'PRE_PAYMENT'){
              item.orderStatusText = '待付款';
            } else if (item.orderStatus === 'PAYMENT_TIMEOUT' || item.orderStatus === 'CANCEL'){
              item.orderStatusText = '已关闭';
            }
          }
          /** 分类 */ 
          if (item.tabStatus === 'PRE_PAYMENT') {//待付款
            prePaymentArr.push(item);
          } else if (item.tabStatus === 'JOINING_GROUP') {//待成团
            joiningGroupArr.push(item);
          } else if (item.tabStatus === 'FINISHED_GROUP') {//待消费
            finishedGroupArr.push(item);
          } else if (item.tabStatus === 'FINISHED') {//已完成
            finishedArr.push(item);
          }
        })
        this.setData({
          collageListInfor: arrCollagesList,
          prePaymentArrData: prePaymentArr,
          joiningGroupArrData: joiningGroupArr,//待成团
          finishedGroupArrData: finishedGroupArr,//待消费
          finishedArrData: finishedArr
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
