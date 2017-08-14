import { commentService } from '../shared/comment.service';
import { errDialog, loading } from '../../../utils/util';
var app = getApp()
Page({
  data: {
    starArr: [0,1,2,3,4],
    starCount: 0, //整体评价
    imageArr: [],
    commentContent: ''
  },
  onLoad: function () {
    
  },

  // 整体评价
  onStarClick: function(e) {
    this.setData({
      starCount: e.currentTarget.dataset.index+1
    })
  },

  // 评价内容
  commentContentChange: function(e) {
    this.setData({
      commentContent: e.detail.value
    })
  },
  

  // 添加图片
  addImage: function() {
    if (this.data.imageArr.length >=5) {
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
      }
    })
  },

  //提交评价 
  commit: function() {
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




    wx.navigateBack({
      delta: 1
    })
  },
})