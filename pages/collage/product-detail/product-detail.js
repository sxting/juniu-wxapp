// pages/personal/comment/detail/detail.js
import { collageService } from '../shared/collage.service';
import { errDialog, loading } from '../../../utils/util';
import { constant } from '../../../utils/constant';
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
    length: 1,
    presentPrice: '',//现价
    originalPrice: '',//原价
    showAlert: false,
    collageList: [],
    imgs: [], //轮播图
    sharedPicUrl: [],
    productName: '',
    shops: [],
    token: wx.getStorageSync(constant.TOKEN),
    loading: false,
    shopId: '',
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '项目详情',
    })

    this.setData({
      storeName: wx.getStorageSync('storeName'),
      pinTuanId: options.pinTuanId,
      groupId: options.groupId,
      shopId: wx.getStorageSync(constant.STORE_INFO)
    })

    if (wx.getStorageSync(constant.TOKEN)) {
      // getProductDetail.call(this);
    } else {
      
    }
   
  },

  onShow: function () {


  }
})

function getProductDetail() {
  let data = {
    pinTuanId: this.data.pinTuanId,
    token: this.data.token
  };
  if (this.data.groupId) {
    data.groupId = this.data.groupId
  }

  this.setData({
    loading: true
  })
  let self = this;
  collageService.getProductDetail(data).subscribe({
    next: res => {
      self.setData({
        loading: false
      })
      if (res.data) {
        self.setData({
          data: res.data
        })

        if (res.data.groups && res.data.groups.length) {
          this.length = res.data.groups.length;
          self.setData({
            length: res.data.groups.length
          })
        }

        let length;

        if (self.data.groupId) {
          let data2 = self.data.data;
          data2.currentGroup.expireTime = data2.currentGroup.expireTime.replace(/-/g, '/');
          self.setData({
            data: data2,
            length: data2.currentGroup.picUrls.length
          })
        }

        self.setData({
          presentPrice: res.data.presentPrice / 100,
          originalPrice: res.data.originalPrice / 100,
          joinNumber: length,
          tel: self.data.data.storePhones[0]
        })

        let nowTime = new Date();

        if (self.data.data.picUrls) {
          self.data.data.picUrls.forEach(function (item) {
            self.data.imgs.push(
              { url: `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${item}/resize_375_210/mode_fill` }
            )
          });
        }

        self.setData({
          productName: self.data.data.pinTuanName,
          shops: self.data.data.shops,
          collageList: self.data.data.groups
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
