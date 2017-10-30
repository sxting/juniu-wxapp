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
    indicatorDots: true
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '我的会员卡',
    });
    let storeId = wx.getStorageSync(constant.STORE_INFO);
    getCardList.call(this, storeId);
  },
  goConsume: function () {
    wx.redirectTo({
      url: '/pages/personal/member-card/consume/consume',
    })
  },
  goDetail: function () {
    wx.redirectTo({
      url: '/pages/personal/member-card/detail/detail',
    })
  },
  bindMemberCard: function() {
    wx.redirectTo({
      url: '/pages/personal/member-card/band/band',
    });
  },
  showMemberCardNumber: function(e) {
    wx.redirectTo({
      url: `/pages/personal/member-card/show/show?phone=${e.currentTarget.dataset.phone}`,
    })
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