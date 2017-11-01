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
    showRecord: true
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '我的会员卡',
    });
    let storeId = wx.getStorageSync(constant.STORE_INFO);
    getCardList.call(this, storeId);
  },
  goConsume: function () {
    wx.navigateTo({
      url: `/pages/personal/member-card/consume/consume?cardId=${this.data.cards[this.data.selectCardIndex].cardId}&cardType=${this.data.cards[this.data.selectCardIndex].cardType}`,
    })
  },
  goDetail: function () {
    wx.navigateTo({
      url: `/pages/personal/member-card/detail/detail?cardId=${this.data.cards[this.data.selectCardIndex].cardId}`,
    })
  },
  bindMemberCard: function() {
    wx.navigateTo({
      url: '/pages/personal/member-card/band/band',
    });
  },
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
      self.setData({
        cards: res.cards,
        showClickBind: res.showClickBind
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}