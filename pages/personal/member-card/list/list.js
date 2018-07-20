import { errDialog } from '../../../../utils/util';
import { constant } from '../../../../utils/constant';
import { memberCardService } from '../shared/service';
Page({

  data: {
    cards: '',
    showClickBind: 'F',
    productId: ''
  },

  onLoad: function (options) {
    let storeId = wx.getStorageSync(constant.STORE_INFO)
    if (options.productId) {
      this.setData({
        productId: options.productId
      })
      productCardList.call(this)
    } else {
      getCardList.call(this, storeId);
    }
  },

  onCardItemClick(e) {
    if (this.data.productId) {
      wx.setStorageSync(constant.cardId, e.currentTarget.dataset.cardid)
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: '/pages/personal/member-card/index/index?cardId=' + e.currentTarget.dataset.cardid,
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

// 适用于某商品的会员卡列表
function productCardList() {
  let data = {
    productId: this.data.productId,
    storeId: wx.getStorageSync(constant.STORE_INFO)
  };
  memberCardService.productCard().subscribe({
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