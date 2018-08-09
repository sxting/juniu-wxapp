// pages/personal/comment/detail/detail.js
import { collageService } from '../shared/collage.service';
import { errDialog, loading } from '../../../utils/util';
import { constant } from '../../../utils/constant';
import { homeService } from '../../home/shared/home.service';
import { service } from '../../../service';

Page({
  data: {
    jnImg: '/asset/images/product.png',
    storeName: wx.getStorageSync('storeName'),
    address: '学清路静淑里6号楼底商',
    merchantPid: wx.getStorageSync(constant.MERCHANTID),
    pinTuanId: '',
    groupId: '', //通过分享的链接点进来 带的参数； 通过 来判断高级插件区点进来的还是分享的链接点进来的
    joinNumber: 0,
    qmArr: [],
    sharedHours: '',
    sharedMinites: '',
    sharedSeconds: '',
    sharedTime: '',
    data: '',
    tel: '',
    length: 0,
    presentPrice: '',//现价
    originalPrice: '',//原价
    showAlert: false,
    collageList: [],
    imgs: [], //轮播图
    sharedPicUrl: [],
    applyStores: [],
    token: wx.getStorageSync(constant.TOKEN),
    shopId: '',
    getUserInfo: true
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '项目详情',
    })

    this.setData({
      storeName: wx.getStorageSync('storeName'),
      pinTuanId: options.activityId ? options.activityId : '',
      groupId: options.groupId ? options.groupId : '',
      shopId: wx.getStorageSync(constant.STORE_INFO)
    })

    if (wx.getStorageSync(constant.TOKEN)) {
      getProductDetail.call(this);
    } else {
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
              console.log(result.code);
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
    }
   
  },

  onShow: function () {
    if (wx.getStorageSync(constant.STORE_INFO)) {
      getStoreInfo.call(this)
    }
  },

  onStoreClick() {
    wx.navigateTo({
      url: '/pages/index/index?productId=' + this.data.pinTuanId,
    })
  },

  // 拨打电话
  onTelClick() {
    let self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.tel
    })
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

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/collage/product-detail/product-detail?storeId=' + this.data.storeId + '&activityId=' + this.data.pinTuanId,
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

  // 开团 
  onOpenGroupBtnClick() {
    let data = this.data.data, 
    pic = data.picUrls[0] ? data.picUrls[0] : this.data.jnImg,
    pTId = this.data.pinTuanId, 
    actName = data.activityName,
    ppN = data.peopleCount,
    dGN = data.openedGroupCount,
      aPrice = data.product.activityPrice,
      oPrice = data.product.originalPrice ;
    
    wx.navigateTo({
      url: `/pages/collage/collage-submit/collage-submit?pic=${pic}&pinTuanId=${pTId}&activityName=${actName}&peopleNumber=${ppN}&dealGroupNumber=${dGN}&activityPrice=${aPrice}&originalPrice=${oPrice}`,
    })
  },

  //参团
  onGoJoinCollageClick() {

  },
})

function getProductDetail() {
  let data = {
    activityId: this.data.pinTuanId,
    storeId: wx.getStorageSync(constant.STORE_INFO),
    belongTo: wx.getStorageSync(constant.MERCHANTID),
    buyerId: wx.getStorageSync(constant.USER_ID)
  };
  if (this.data.groupId) {
    data.groupId = this.data.groupId
  }

  let self = this;
  collageService.getProductDetail(data).subscribe({
    next: res => {
      if (res) {
        self.setData({
          data: res
        })

        if (res.openedGroups && res.openedGroups.length) {
          this.length = res.openedGroups.length;
          self.setData({
            length: res.openedGroups.length
          })
        }

        let length = 0;

        if (self.data.groupId) {
          let data2 = self.data.data;
          data2.currentGroup.expireTime = data2.currentGroup.expireTime.replace(/-/g, '/');
          self.setData({
            data: data2
          })
          length = data2.currentGroup.picUrls.length
        }

        self.setData({
          presentPrice: res.product.activityPrice / 100,
          originalPrice: res.product.originalPrice / 100,
          joinNumber: length,
          // tel: self.data.data.storePhones[0]
        })        

        let nowTime = new Date();

        if (self.data.data.picUrls) {
          let imgs = []
          self.data.data.picUrls.forEach(function (item) {
            imgs.push(
              { url: `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${item}/resize_375_210/mode_fill` }
            )
          });
          self.setData({
            imgs: imgs
          })
        }

        self.setData({
          applyStores: self.data.data.applyStores,
          collageList: self.data.data.openedGroups
        })

        /*倒计时*/
        if (!self.data.groupId) {
          self.data.collageList.forEach(function (item) {
            item.expireTime = item.expireTime.replace(/-/g, '/');
            let time = new Date(item.expireTime).getTime() - nowTime.getTime();
            if (time <= 0) {
              item.time = '00:00:00'
            } else {
              let hours = parseInt(time / 1000 / 60 / 60 + '');
              let minutes = parseInt(time / 1000 / 60 - hours * 60 + '');
              let seconds = parseInt(time / 1000 - minutes * 60 - hours * 3600 + '');
              item.time = (hours.toString().length < 2 ? '0' + hours : hours) + ':' +
                (minutes.toString().length < 2 ? '0' + minutes : minutes) + ':' +
                (seconds.toString().length < 2 ? '0' + seconds : seconds);
            }
          });

          setInterval(function () {
            self.data.collageList.forEach(function (item) {
              if (new Date('2000/01/01 ' + item.time).getHours().toString() === '0' && new Date('2000/01/01 ' + item.time).getMinutes().toString() === '0' && new Date('2000/01/01 ' + item.time).getSeconds().toString() === '0') {
                item.time = '00:00:00'
              } else {
                let time = new Date(new Date('2000/01/01 ' + item.time).getTime() - 1000);
                item.time =
                  (time.getHours().toString().length < 2 ? '0' + time.getHours() : time.getHours()) + ':' +
                  (time.getMinutes().toString().length < 2 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
                  (time.getSeconds().toString().length < 2 ? '0' + time.getSeconds() : time.getSeconds());
              }
            })
          }, 1000);
        }

        if (self.data.groupId) {
          if (self.data.data.peopleNumber > 4) {
            if (length >= 3) {

            } else {
              for (let i = 0; i < 3 - length; i++) {
                self.data.qmArr.push('')
              }
            }
          } else {
            for (let i = 0; i < self.data.data.peopleNumber - length; i++) {
              self.data.qmArr.push('')
            }
          }

          let time2 = new Date(self.data.data.currentGroup.expireTime).getTime() - nowTime.getTime();
          if (time2 <= 0) {
            self.data.sharedHours = '00';
            self.data.sharedMinites = '00';
            self.data.sharedSeconds = '00';
          } else {
            let a = time2 / 1000 / 60 / 60;
            let hours = parseInt(a + '');
            let minutes = parseInt(time2 / 1000 / 60 - hours * 60 + '');
            let seconds = parseInt(time2 / 1000 - minutes * 60 - hours * 3600 + '');
            self.data.sharedHours = hours.toString().length < 2 ? '0' + hours : hours;
            self.data.sharedMinites = minutes.toString().length < 2 ? '0' + minutes : minutes;
            self.data.sharedSeconds = seconds.toString().length < 2 ? '0' + seconds : seconds;
          }

          //倒计时
          setInterval(function () {
            if (new Date('2000/01/01 ' + self.data.sharedHours + ':' + self.data.sharedMinites + ':' + self.data.sharedSeconds).getHours().toString() === '0' && new Date('2000/01/01 ' + self.data.sharedHours + ':' + self.data.sharedMinites + ':' + self.data.sharedSeconds).getMinutes().toString() === '0' && new Date('2000/01/01 ' + self.data.sharedHours + ':' + self.data.sharedMinites + ':' + self.data.sharedSeconds).getSeconds().toString() === '0') {
              self.data.sharedHours = '00';
              self.data.sharedMinites = '00';
              self.data.sharedSeconds = '00';
            } else {
              let time = new Date(new Date('2000/01/01 ' + self.data.sharedHours + ':' + self.data.sharedMinites + ':' + self.data.sharedSeconds).getTime() - 1000);
              self.data.sharedHours = time.getHours().toString().length < 2 ? '0' + time.getHours() : time.getHours();
              self.data.sharedMinites = time.getMinutes().toString().length < 2 ? '0' + time.getMinutes() : time.getMinutes();
              self.data.sharedSeconds = time.getSeconds().toString().length < 2 ? '0' + time.getSeconds() : time.getSeconds();
            }
          }, 1000)
        }
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

//获取门店信息
function getStoreInfo() {
  let self = this;
  let data = {
    storeId: wx.getStorageSync(constant.STORE_INFO)
  }
  homeService.storeInfoDetail(data).subscribe({
    next: res => {
      self.setData({
        address: res.address,
        tel: res.mobie
      });
      wx.setStorageSync(constant.address, res.address)
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

function logIn(code, appid, rawData) {
  let self = this;
  service.logIn({ code: code, appid: appid, rawData: rawData, tplid: constant.TPLID }).subscribe({
    next: res => {
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
      wx.setStorageSync(constant.MERCHANTID, res.merchantId ? res.merchantId : '153179997107784038184');
      wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg);
      wx.setStorageSync(constant.sessionKey, res.sessionKey)

      if (res.ver == '2') {
        wx.setStorageSync(constant.VER, 2);
      } else {
        wx.setStorageSync(constant.VER, 1);
      }

      wx.setStorage({
        key: constant.TOKEN,
        data: res.juniuToken,
        success: function (res) {}
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
