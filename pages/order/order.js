import { orderService} from 'shared/service.js'
import { errDialog } from '../../utils/util';
//获取应用实例
var app = getApp()
Page({
  data: {
    storeId: '1498113571836349700342',
    reserveType: '', //预约配置类型 MAN、PRODUCT、TIME 
    dateList: [],
    timeList: [],
    craftsmanId: '',
    productId: '',
  },
  onLoad: function () {
    let today = changeDate.call(this,new Date());
    let dateArr = [];
    for(let i=0; i<7; i++) {
      dateArr.push(getAfterSomeDay.call(this, today, i))
    }
    dateArr[0].week = '今天';
    dateArr[1].week = '明天';
    this.setData({
      dateList: dateArr
    })

    reserveConfig.call(this)
  },

  onCraftsmanClick: function() {
    wx.navigateTo({
      url: '/pages/craftsman/select/select',
    })
  },

  onProductClick: function() {
    wx.navigateTo({
      url: '/pages/product/select/select',
    })
  }
})

// 查询店铺预约配置
function reserveConfig() {
  let data = {
    token: '27f3733b5daeb3d89a53b6c561f5c753',
    storeId: this.data.storeId
  }

  orderService.reserveConfig(data).subscribe({
    next: res => {
      console.log(res);
      let todayDay = changeDate.call(this, new Date())
      let timeArr = {
        time: [],
        timeShow: []
      };

      //生成时间start
      let timeData = res.businessStart + '-' + res.businessEnd;
      // let timeData = '09:00-19:30';
      let timeDataArr = timeData.split('-');
      let startTime = new Date(todayDay + ' ' + timeDataArr[0] + ':00').getTime();
      let endTime = new Date(todayDay + ' ' + timeDataArr[1] + ':00').getTime();
      for (let i = 0; i < ((endTime - startTime) / 1000 / 60 / 30); i++) {
        timeArr.timeShow.push(new Date(new Date(todayDay + ' ' + timeDataArr[0] + ':00').getTime() + 30 * 60 * 1000 * i));
        timeArr.time.push(new Date(new Date(todayDay + ' ' + timeDataArr[0] + ':00').getTime() + 30 * 60 * 1000 * i));
      }
      for (let i = 0; i < timeArr.timeShow.length; i++) {
        timeArr.timeShow[i] = (timeArr.timeShow[i].getHours().toString().length > 1 ? timeArr.timeShow[i].getHours() : '0' + timeArr.timeShow[i].getHours()) + ':' +
          (timeArr.timeShow[i].getMinutes().toString().length > 1 ? timeArr.timeShow[i].getMinutes() : '0' + timeArr.timeShow[i].getMinutes());
      }
      //生成时间end

      this.setData({
        reserveType: res.reserveType,
        timeList: timeArr.timeShow
      })

    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 获取未来N天的日期
function getAfterSomeDay(date, num) {
  date = date.replace(/-/g, '/');
  let odate = new Date(date);
  odate = odate.valueOf();
  odate = odate + num * 24 * 60 * 60 * 1000;
  odate = new Date(odate);
  let dateNum = odate.getDate() < 10 ? '0' + odate.getDate() : odate.getDate();
  if ((odate.getMonth() + 1) >= 10) {
    return {
      date: (odate.getMonth() + 1) + '.' + dateNum,
      year: odate.getFullYear(),
      week: changeDayToChinese.call(this,odate.getDay())
    };
  } else {
    return {
      date: '0' + (odate.getMonth() + 1) + '.' + dateNum,
      year: odate.getFullYear(),
      week: changeDayToChinese.call(this,odate.getDay())
    };
  }
}

//将日期时间戳转换成日期格式
function changeDate(date) {
  console.log(date);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day));
}

function changeDayToChinese(num) {
  let result = '';
  switch (num) {
    case 0:
      result = '周日';
      break;
    case 1:
      result = '周一';
      break;
    case 2:
      result = '周二';
      break;
    case 3:
      result = '周三';
      break;
    case 4:
      return '周四';
    case 5:
      result = '周五';
      break;
    case 6:
      result = '周六';
      break;
  }
  return result;
}