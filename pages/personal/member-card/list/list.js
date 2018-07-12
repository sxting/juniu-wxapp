import { errDialog } from '../../../../utils/util';
import { constant } from '../../../../utils/constant';
import { memberCardService } from '../shared/service';
Page({

  data: {
    cards: '',
    showClickBind: 'F'
  },

  onLoad: function (options) {
    let storeId = wx.getStorageSync(constant.STORE_INFO)
    getCardList.call(this, storeId);
  },

  onCardItemClick(e) {
    wx.navigateTo({
      url: '/pages/personal/member-card/index/index?cardId=' + e.currentTarget.dataset.cardid,
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