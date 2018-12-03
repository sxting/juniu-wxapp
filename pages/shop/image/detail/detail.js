import { constant } from '../../../../utils/constant';
import { service } from '../../../../service';
import { shopService } from '../../shared/shop.service.js'
import { errDialog, workDataFun } from '../../../../utils/util';

Page({
  data: {
    bigImage: '',
    imageList: [],
    worksList: [],
    imageWidth: 168,
    getUserInfo: true,
    productionId: ''
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '图片详情',
    })
    this.setData({
      productionId: options.productionId
    })
    if (options.type && options.type === 'share') {
      let self = this;
      wx.login({
        success: function (result) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              self.setData({
                getUserInfo: true
              })
              let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
              let appId = 'wx3bb038494cd68262';
              if (result.code) {
                logIn.call(self, result.code, extConfig.theAppid ? extConfig.theAppid : appId, res.rawData);
              } else {
                console.log('获取用户登录态失败！' + result.errMsg)
              }
            },
            fail: function () {
              self.setData({
                getUserInfo: false
              })
            }
          });
        },
        fail: function (res) {
          self.setData({
            getUserInfo: false
          })
        },
        complete: function (res) { },
      });
    } else {
      getData.call(this);
    }
  },

  bindgetuserinfo(e) {
    let self = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.login({
        success: function (result) {
          self.setData({
            getUserInfo: true
          })
          let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
          let appId = 'wx3bb038494cd68262';
          console.log(result.code);
          if (result.code) {
            logIn.call(self, result.code, extConfig.theAppid ? extConfig.theAppid : appId, e.detail.rawData);
          } else {
            console.log('获取用户登录态失败！' + result.errMsg)
          }
        },
        fail: function (res) {
          self.setData({
            getUserInfo: false
          })
        },
        complete: function (res) { },
      });
    }
  },

  onLittleImgClick(item) {
    let index = item.currentTarget.dataset.item.index;
    this.setData({
      bigImage: this.data.imageList[index]
    })
  },

  onShareAppMessage: function (res) {
    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/shop/image/detail/detail?type=share',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    }
  },

  /*点击其他作品*/
  onOtherWorkItemClick(item) {

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
        worksList: workDataFun(res.other, self.data.imageWidth)
      })
      this.setData({
        imageList: [
          {
            url: '/asset/images/pintuan_head1.jpg',
            index: 0
          },
          {
            url: '/asset/images/pintuan_head2.jpg',
            index: 1
          },
          {
            url: '/asset/images/pintuan_head3.jpg',
            index: 2
          },
          {
            url: '/asset/images/pintuan_head4.jpg',
            index: 3
          },
          {
            url: '/asset/images/pintuan_head5.jpg',
            index: 4
          },
          {
            url: '/asset/images/pintuan_head3.jpg',
            index: 5
          }
        ],
      })

      this.setData({
        bigImage: this.data.imageList[0]
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

function logIn(code, appid, rawData) {
  let self = this;
  console.log(rawData)
  service.logIn({ code: code, appid: appid, rawData: rawData, tplid: constant.TPLID }).subscribe({
    next: res => {
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
      wx.setStorageSync(constant.MERCHANTID, res.merchantId ? res.merchantId : '153179997107784038184');
      wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg);
      wx.setStorageSync(constant.sessionKey, res.sessionKey);
      wx.setStorageSync(constant.USER_ID, res.userId)

      if (res.ver == '2') {
        wx.setStorageSync(constant.VER, 2);
      } else {
        wx.setStorageSync(constant.VER, 1);
      }

      wx.setStorage({
        key: constant.TOKEN,
        data: res.juniuToken,
        success: function (res) {  
          getData.call(self)
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}