import { craftsmanService } from '../shared/service.js'
import { errDialog } from '../../../utils/util'; 
import { constant } from '../../../utils/constant';
var app = getApp()
Page({
  data: {
    imgUrl: '/asset/images/head-portrait.png',
    starArr: [0,1,2,3,4],
    staffId: '',
    staffInfo: {},
    commentList: [],
    pageIndex: 1,
    pageSize: 10,
    countPage: 1,
    storeId: '',
    storeName: '',
  },
  
  onLoad: function (options) {
    this.setData({
      staffId: options.staffId,
      storeId: options.storeId,
      storeName: wx.getStorageSync('storeName')
    })

    let token = wx.getStorageSync(constant.TOKEN);
    if (token) {
      getStaffDetail.call(this);
      getComments.call(this)
    } else {
      wx.login({
        success: function (result) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
              let appId = 'wx3bb038494cd68262';
              if (result.code) {
                logIn.call(self, result.code, extConfig.theAppid ? extConfig.theAppid : appId, res.rawData);
              } else {
                console.log('获取用户登录态失败！' + result.errMsg)
              }
            }
          });
        },
        fail: function (res) { },
        complete: function (res) { },
      });
    }    
  },

  onShow: function() {
    if (this.data.storeId && this.data.staffId) {
      getStaffDetail.call(this);
      getComments.call(this);
    }
  },

  //分享 
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    // staffId = 1507865304614994341106 & storeId=1500534105280134281527
    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/craftsman/detail/detail?storeId=' + this.data.storeId + '&staffId=' + this.data.staffId,
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

  //上拉触底 
  onScrollTolower: function () {
    if (this.data.pageIndex == this.data.countPage) {
      return;
    }
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    getComments.call(this)
  },

  // 添加评论
  onCreateCommentClick() {
    wx.navigateTo({
      url: '/pages/comment/making/making?staffId=' + this.data.staffId,
    })
  }
})

// 查询员工详情
function getStaffDetail() {
  let data = {
    staffId: this.data.staffId
  }
  craftsmanService.getStaffDetail(data).subscribe({
    next: res => {
      res.headPortrait = constant.OSS_IMAGE_URL + `${res.headPortrait}/resize_80_80/mode_fill`;
      this.setData({
        staffInfo: res
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 查询员工评论列表
function getComments() {
  let data = {
    pageIndex: this.data.pageIndex,
    pageSize: this.data.pageSize,
    storeId: this.data.storeId,
    ctraftsmanId: this.data.staffId
  }
  craftsmanService.getStaffCommentList(data).subscribe({
    next: res => {
      res.comments.forEach((item) => {
        let dateArray = item.juniuoModel.dateCreated.split(' ');
        item.date = dateArray[0];
        item.time = dateArray[1];
        if (item.imagesUrl) {
          item.imagesUrl.forEach((img, index) => {
            item.imagesUrl[index] = constant.OSS_IMAGE_URL + `${img}/resize_80_80/mode_fill`;
          });
        }
      });
      this.setData({
        commentList: res.comments,
        countPage: res.pageInfo.countPage
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

function logIn(code, appid, rawData) {
  let self = this;
  service.logIn({ code: code, appid: appid, rawData: rawData }).subscribe({
    next: res => {
      // 1505274961239211095369
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
      wx.setStorageSync(constant.MERCHANTID, extConfig.theAppid ? res.merchantId : '1505100477335167136848');
      wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg);

      if (res.ver == '2') {
        wx.setStorageSync(constant.VER, 2);
      } else {
        wx.setStorageSync(constant.VER, 1);
      }

      wx.setStorage({
        key: constant.TOKEN,
        data: res.juniuToken,
        success: function (res) {
          getStaffDetail.call(this);
          getComments.call(this)
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}