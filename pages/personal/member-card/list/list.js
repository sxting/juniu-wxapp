import { errDialog } from '../../../../utils/util';
import { constant } from '../../../../utils/constant';
import { memberCardService } from '../shared/service';

Page({

  data: {
    cards: '',
    showClickBind: 'F',
    productId: '',
    jnImg: '/asset/images/card-bg.png',
    price: ''
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的会员卡',
    });
    let storeId = wx.getStorageSync(constant.STORE_INFO)
    if (options.productId) {
      this.setData({
        productId: options.productId,
        price: options.price
      })
      productCardList.call(this)
    } else {
      getCardList.call(this, storeId);
    }
  },

  onCardItemClick(e) {
    if (this.data.productId) {
      if ((e.currentTarget.dataset.type == 'STORED' || e.currentTarget.dataset.type == 'REBATE') && e.currentTarget.dataset.balance < this.data.price ) {
        return;
      }
      wx.setStorageSync(constant.cardId, e.currentTarget.dataset.cardid)
      wx.setStorageSync(constant.cardName, e.currentTarget.dataset.cardname)
      wx.navigateBack({ 
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: '/pages/personal/member-card/index/index?cardId=' + e.currentTarget.dataset.cardid,
      })
    }
  },

  // 跳转到绑定手机号
  bindMemberCard: function () {
    wx.navigateTo({
      url: '/pages/personal/member-card/band/band',
    });
  },

})

// 获取卡列表
function getCardList(storeId) {
  let self = this;
  memberCardService.cardList({ storeId: storeId }).subscribe({
    next: res => {
      res.cards.forEach((item) => {
        if (item.background) {
          item.background = constant.OSS_IMAGE_URL + `${item.background}/resize_345_120/mode_fill`;
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

// 适用于某商品的会员卡列表
function productCardList() {
  let self = this;
  let data = {
    productId: this.data.productId,
    storeId: wx.getStorageSync(constant.STORE_INFO)
  };
  memberCardService.productCard(data).subscribe({
    next: res => {
      res.forEach((item) => {
        if (item.background) {
          item.background = constant.OSS_IMAGE_URL + `${item.background}/resize_345_120/mode_fill`;
        }
      });
      self.setData({
        cards: res
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}