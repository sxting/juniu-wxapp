// pages/personal/member-card/band/band.js
import { memberCardService } from '../shared/service';
import { errDialog, checkMobile } from '../../../../utils/util';
import { constant } from '../../../../utils/constant';
import { ticketService } from '../../../ticket/shared/ticket.service';
// import { WXBizDataCrypt } from '../../../../utils/WXBizDataCrypt';

let wait = 60;
Page({
  data: {
    sendMegLabel: '获取验证码',
    isDisabled: false,
    phoneNumber: null,
    remark: '',
    validCode: '',
    storeId: '',
    marketingid: '',
    form: '',
    loading: false,
    sceneType: false,//查看场景是不是从新人领券页面跳转过来的，是true 不是即为false
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '绑定手机号',
    });
    console.log(options);
    this.setData(
      {
        storeId: wx.getStorageSync(constant.STORE_INFO),
        marketingid: options.marketingid ? options.marketingid: '',
        form: options.from,
        sceneType: options.type && options.type == 'coupon'? true : false
      }
    )
  },

  getUserPhoneNumber: function (e) {
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    let data = {
      encryptData: encryptedData,
      iv: iv
    }
    memberCardService.decodeUserPhone(data).subscribe({
      next: res => {
        this.setData({
          phoneNumber: res.phoneNumber
        })
        wx.setStorageSync(constant.phoneNumber, res.phoneNumber)
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },

  getMsgCode: function () {
    let phone = this.data.phoneNumber;
    let self = this;
    if(this.data.loading) {
      return;
    }
    if (checkMobile(phone)) {
      this.setData({
        loading: true
      })
      memberCardService.getVaildCode({
        phone: phone,
        bizType: 'MEMBER_VALID'
      }).subscribe({
        next: res => {
          let changePhoneResult = phone.substring(0, 3)
            + '****'
            + phone.substring(phone.length - 4, phone.length);
          self.setData({
            remark: `验证码将发送到手机(${changePhoneResult}),请注意查收。`
          })
          time.call(self);
        },
        error: err => errDialog(err),
        complete: () => {
          wx.hideToast();
          self.setData({
            loading: false
          })
        }
      });
    } else {
      errDialog('请输入正确的手机号格式');
    }
  },
  getPhoneNumber: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  getValidCode: function (e) {
    this.setData({
      validCode: e.detail.value
    })
  },
  bindCard: function (e) {
    if (this.data.loading) {
      return;
    }
    if (this.data.validCode) {
      if (this.data.sceneType){//true 即为新人券
        bindMemberByGetCoupon.call(this, this.data.storeId, this.data.phoneNumber, this.data.validCode);
      }else{
        bindMemberCard.call(this, this.data.storeId, this.data.phoneNumber, this.data.validCode);
      }
    } else {
      errDialog('验证码不能为空');
    }
  }
})

// 领取优惠券
function reciveTicket() {
  let marketingId = this.data.marketingid;
  let storeId = wx.getStorageSync(constant.STORE_INFO);
  ticketService.receiveTicket({ marketingId: marketingId, storeId: storeId }).subscribe({
    next: res => {
      wx.showModal({
        title: '领取成功',
        content: '请到个中心我的优惠券中查看',
        showCancel: false,
        success: function (res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
//绑定会员卡
function bindMemberCard(storeId, phone, validCode) {
  let self = this;
  this.setData({
    loading: true,
  })
  memberCardService.bindCard({
    storeId: storeId,
    phone: phone,
    validCode: validCode
  }).subscribe({
    next: res => {
      if (res.showClickBind === 'F') {
        if (self.data.marketingid) {
          reciveTicket.call(self)
        } else if (self.data.form == 'product') {
          wx.navigateBack({
            delta: 1
          })
        } else if (self.data.form === 'personal') {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.redirectTo({
            url: '/pages/personal/member-card/index/index',
          })
        }
      } else {
        errDialog('未找到手机号相关的会员卡，请到店里办理')
      }
      self.setData({
        loading: false
      })
      // if (res.showClickBind === 'T') {
      //   errDialog('未找到手机号相关的会员卡，请到店里办理')
      // } else if (self.data.marketingid) {
      //   reciveTicket.call(self)
      // } else {
      //   wx.redirectTo({
      //     url: '/pages/personal/member-card/index/index',
      //   })
      // }
     
    },
    error: (err) => {
      errDialog(err);
      self.setData({
        loading: false
      })
    },
    complete: () => {
      wx.hideToast();
      self.setData({
        loading: false,
      })
    }
  });
}
/**
 * 发送验证码倒计时
 * @param o
 */
function time(o) {
  if (wait === 0) {
    this.setData({
      isDisabled: false,
      sendMegLabel: "获取验证码"
    });
    wait = 60;
  } else {
    this.setData({
      isDisabled: true,
      sendMegLabel: "重新发送(" + wait + ")"
    });
    wait--;
    setTimeout(() => {
      time.call(this);
    },
      1000);
  }
}

// 新人专享绑定手机号
function bindMemberByGetCoupon(storeId, phone, validCode) {
  let marketingId = this.data.marketingid;
  ticketService.bindMemberByGetCoupon(
    {
      marketingId: marketingId,
      storeId: storeId,
      phone: phone,
      validCode: validCode
    }).subscribe({
      next: res => {
        wx.showModal({
          title: '领取成功',
          content: '请到个中心我的优惠券中查看',
          cancelText: '返回',
          confirmText: '查看',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击查看');
              wx.redirectTo({
                url: 'pages/personal/ticket/ticket',
              })
            } else if (res.cancel) {
              console.log('用户点击返回');
              wx.redirectTo({
                url: '/pages/home/home',
              })
            }
          }
        })
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
}
