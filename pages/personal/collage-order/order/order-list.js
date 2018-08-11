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
        status: 'PAY'
      },
      {
        typeText: '待成团',
        status: 'REFUND'
      },
      {
        typeText: '待消费',
        status: 'VALID'
      },
      {
        typeText: '已完成',
        status: 'SETTLE'
      }
    ],
    tabIndex: 0,
    status: '', // CLOSE 已取消， 
    productImg: '/asset/images/product.png',
    collageListInfor: [],
    groupId: '',
  },


  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '拼团订单',
    })
    getCollageOrderList.call(this)
  },

  onTabClick(e) {
    let index = e.currentTarget.dataset.index;
    let status = '';
    if (index == 1) {
      status = 'INIT'
    } else if (index == 2) {
      status = 'PAID'
    } else if (index == 3) {
      status = 'FINISH'
    } else {
      status = ''
    }
    this.setData({
      tabIndex: index,
      status: status
    })
  },

  /**
   * 立即支付
   */
  payImmediate: function () {
  
  },
  /** 取消 */ 
  cancelClick: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e,res) {
    console.log(res);
    let activityId = e.target.dataset.activityid;
    return {
      title: wx.getStorageSync('订单分享'),
      path: '/pages/collage/product-detail/product-detail?groupId=' + this.data.groupId + '&activityId=' + activityId + 'type=share',
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
  
  //  立即评价
  evaluationImmediate: function(e){
    console.log(e.currentTarget.dataset.activityid);
    wx.navigateTo({
      url: '/pages/comment/making/making?productId=' + e.currentTarget.dataset.activityid
    })
  }

})

function getCollageOrderList(){
  let data = {
    belongTo: wx.getStorageSync(constant.MERCHANTID),
    buyerId: wx.getStorageSync(constant.USER_ID),
  }
  personalService.getCollageListInfor(data).subscribe({
    next: res => {
      if (res) {
        console.log(res);
        let arrCollagesList = [
          {
            activityName: '染烫护理三合一套餐111',
            groupNo: '111',
            groupStatus: 'PAY',
            openedTime: '2018-08-18 09:21:30',
            peopleCount: 0,
            totalAmount: 0,
            activityId: '1'
          },
          {
            activityName: '染烫护理三合一套餐222',
            groupNo: '111',
            groupStatus: 'SETTLE',
            openedTime: '2018-08-18 09:21:30',
            peopleCount: 0,
            totalAmount: 0,
            activityId: '2'
          },
          {
            activityName: '染烫护理三合一套餐333',
            groupNo: '111',
            groupStatus: 'REFUND',
            openedTime: '2018-08-18 09:21:30',
            peopleCount: 0,
            totalAmount: 0,
            activityId: '3'
          }
        ];
        this.setData({
          collageListInfor: arrCollagesList
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })

}