//获取应用实例
import { personalService } from '../../shared/service.js'
import { errDialog } from '../../../../utils/util';
import { constant } from '../../../../utils/constant';
import { memberCardService } from '../shared/service';
var app = getApp()
Page({
  data: {
    cards: [],
    showClickBind: 'T',
    indicatorDots: true,
    selectCardIndex: 0,
    showRecord: true,
    cardId: '',
    cardType: '',
    jnImg: '/asset/images/card-bg2.png',
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的会员',
    });
    this.setData({
      cardId: options.cardId
    })
  },
  onShow: function() {
    let storeId = wx.getStorageSync(constant.STORE_INFO);
    getCardList.call(this, storeId);
  },

  // 跳转到消费记录
  goConsume: function () {
    wx.navigateTo({
      url: `/pages/personal/member-card/consume/consume?cardId=${this.data.cardId}&cardType=${this.data.cardType}`,
    })
  },
  goDetail: function () {
    wx.navigateTo({
      url: `/pages/personal/member-card/detail/detail?cardId=${this.data.cardId}`,
    })
  },

  // 跳转到绑定手机号
  bindMemberCard: function() {
    wx.navigateTo({
      url: '/pages/personal/member-card/band/band',
    });
  },
  // 跳转到二维码展示页面
  showMemberCardNumber: function(e) {
    wx.navigateTo({
      url: `/pages/personal/member-card/show/show?phone=${e.currentTarget.dataset.phone}&barCode=${e.currentTarget.dataset.barcode}`,
    })
  },
  swiperChange: function(e) {
    this.setData({
      selectCardIndex: e.detail.current
    })
    if (this.data.cards[this.data.selectCardIndex].cardType !== 'TIMES') {
      this.setData({
        showRecord: true
      })
    } else {
      this.setData({
        showRecord: false
      })
    }
  }
})

// 获取卡列表
function getCardList(storeId) {
  let self = this;
  memberCardService.cardList({ storeId: storeId }).subscribe({
    next: res => {
      res.cards.forEach((item) => {
        if (item.background) {
          item.background = constant.OSS_IMAGE_URL + `${item.background}/resize_345_200/mode_fill`;
        }
        if (item.cardId == self.data.cardId) {
          self.setData({
            cardType: item.cardType
          });
        }
      });
      self.setData({
        cards: res.cards,
        showClickBind: res.showClickBind
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}