//获取应用实例
import { personalService } from '../../shared/service.js'
import { errDialog } from '../../../../utils/util';
import { constant } from '../../../../utils/constant';
import { memberCardService } from '../shared/service';
var app = getApp()
Page({
  data: {

  },
  onLoad: function () {
    getCardList.call(this);
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
  }
})

// 获取卡列表
function getCardList() {
  console.log(memberCardService)
  memberCardService.cardList().subscribe({
    next: res => {
      console.log(res);
     },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}