import { commentService } from '../shared/comment.service';
import { errDialog, loading } from '../../../utils/util';
import { constant } from '../../../utils/constant';

var app = getApp()
Page({
  data: {
    starArr: [0, 1, 2, 3, 4],
    starCount: 0, //整体评价
    imageArr: [],
    commentContent: '',
    storeId: '',
    merchantId: '',
    pictureId: '',
    productId: '',
    staffId: '',
    pageNo: 1,
    pageSize: 1000,
    staffList: [],
    productList: [],
    selectProductName: '',
    selectStaffName: ''
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '发布评论',
    })
    this.setData({
      storeId: wx.getStorageSync(constant.STORE_INFO),
      merchantId: wx.getStorageSync(constant.MERCHANTID),
      productId: options.productId ? options.productId : '',
      staffId: options.staffId ? options.staffId : '',
      activityId: options.activityId ? options.activityId : ''
    })
  },

  // 整体评价
  onStarClick: function (e) {
    this.setData({
      starCount: e.currentTarget.dataset.index + 1
    })
  },

  // 评价内容
  commentContentChange: function (e) {
    this.setData({
      commentContent: e.detail.value
    })
  },


  // 添加图片
  addImage: function () {
    if (this.data.imageArr.length >= 5) {
      wx.showModal({
        title: '温馨提示',
        content: `最多可添加五张图片`,
        showCancel: false,
        success: function (res) {
        }
      });
      return;
    }
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          imageArr: that.data.imageArr.concat(tempFilePaths)
        });
        // POST /wxapp/upload/image.json
        loading();
        wx.uploadFile({
          url: constant.imgUrl + '/wxapp/upload/image.json',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'token': wx.getStorageSync(constant.TOKEN)
          },
          formData: {
            'imageScalingRulesJson': '[{"width":100,"height":100}]'
          },
          count: 1, // 默认9
          // 可以指定是原图还是压缩图，默认二者都有
          sizeType: ['original', 'compressed'],
          // 可以指定来源是相册还是相机，默认二者都有
          sourceType: ['album', 'camera'],
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          success: function (res) {
            var datajson = JSON.parse(res.data);
            console.log(datajson)
            let errorCode = datajson.errorCode
            that.setData({
              pictureId: that.data.pictureId 
              ? that.data.pictureId + ',' + datajson.data.pictureId 
              : datajson.data.pictureId,
            })
            if (errorCode != '10000') {
              wx.showModal({
                title: '温馨提示',
                content: `${datajson.errorInfo}`,
                showCancel: false,
                success: function (res) {
                }
              });
            } else {
              wx.hideToast();
            }
          }
        })
      }
    })
  },

  //提交评价 
  commit: function () {
    if (this.data.starCount == 0) {
      wx.showModal({
        title: '温馨提示',
        content: `请选择整体评价`,
        showCancel: false,
        success: function (res) {
        }
      });
      return;
    }
    if (!this.data.commentContent) {
      wx.showModal({
        title: '温馨提示',
        content: `请输入评价详情`,
        showCancel: false,
        success: function (res) {
        }
      });
      return;
    }
    let data = {
      merchantId: this.data.merchantId,
      storeId: this.data.storeId,
      productId: this.data.productId ? this.data.productId : '',
      craftsmanId: this.data.staffId ? this.data.staffId : '',
      score: this.data.starCount,
      content: this.data.commentContent,
      isShow: 1,
      imageIds: this.data.pictureId,
      activityId: this.data.activityId ? this.data.activityId : '',
    };

    commentService.making(data).subscribe({
      next: res => {
        wx.navigateBack({
          delta: 1
        })
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })


  }
})