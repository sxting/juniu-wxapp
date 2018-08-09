// pages/collage/product-list/product-list.js
import { constant } from '../../../utils/constant';
import { collageService } from '../shared/collage.service';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '/asset/images/product.png',
    jnImgUrl: '/asset/images/product.png',
    collageProductList: [' ', ' ', ' '],
    storeId: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.storeId = wx.getStorageSync(constant.STORE_INFO);
    this.setData({
      storeId: this.data.storeId,
    })
    let self = this;
    let data = {
      storeId: this.data.storeId,
      belongTo: '',
      buyerId: '',
      pageSize: 10,
      platform: ''
    }
    collageService.getProductList(data).subscribe({
      next: res => {
        if(res){
          console.log(res);
        }
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
    
  },

 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
})