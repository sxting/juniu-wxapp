import { orderService} from 'shared/service.js'
import { errDialog } from '../../utils/util';
//获取应用实例
var app = getApp()
Page({
  data: {
    showPreventBox: true,
    storeId: '1498790748991165413217',
    reserveType: '', //预约配置类型 MAN、PRODUCT、TIME 
    dateList: [],
    date: '',
    timeList: [],
    reserveTimeArr: [],
    craftsmanId: '',
    craftsmanName: '',
    productId: '',
    productName: '',
    price: '',
  },
  onLoad: function (options) {
    let today = changeDate.call(this,new Date());
    let dateArr = [];
    for(let i=0; i<7; i++) {
      dateArr.push(getAfterSomeDay.call(this, today, i))
    }
    dateArr[0].week = '今天';
    dateArr[1].week = '明天';
    
    this.setData({
      dateList: dateArr,
      date: dateArr[0].dateData,
      craftsmanId: options.craftsmanId ? options.craftsmanId : this.data.craftsmanId,
      productId: options.productId,
      craftsmanName: options.craftsmanName ? options.craftsmanName : this.data.craftsmanName,
      productName: options.productName,
      price: options.price
    })

    reserveConfig.call(this)
  },

  // 选择手艺人
  onCraftsmanClick: function() {
    wx.navigateTo({
      url: '/pages/craftsman/select/select',
    })
  },

  // 选择商品
  onProductClick: function() {
    if (this.data.reserveType === 'MAN' && !this.data.craftsmanId) {
      errDialog('请选择手艺人');
      return;
    }
    wx.navigateTo({
      url: `/pages/product/select/select?craftsmanId=${this.data.craftsmanId}&craftsmanName=${this.data.craftsmanName}`,
    })
  },

  // 选择日期
  onDateClick: function(e) {
    console.log(e)
    if (this.data.showPreventBox) {return;}
    this.setData({
      date: e.currentTarget.dataset.date
    })

    if (this.data.reserveType === 'MAN') {
      getStaffReserve.call(this);
    }

  },

  // 选择时间
  onTimeClick: function() {
    if (this.data.showPreventBox) {return;}
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
        timeArr.timeShow[i] = {
          time: (timeArr.timeShow[i].getHours().toString().length > 1 ? timeArr.timeShow[i].getHours() : '0' + timeArr.timeShow[i].getHours()) + ':' +
          (timeArr.timeShow[i].getMinutes().toString().length > 1 ? timeArr.timeShow[i].getMinutes() : '0' + timeArr.timeShow[i].getMinutes()),
          reserve: false
        }
      }
      //生成时间end

      this.setData({
        reserveType: res.reserveType,
        timeList: timeArr.timeShow
      })

      if (this.data.reserveType === 'MAN') {
        if (this.data.craftsmanId && this.data.productId) {
          this.setData({showPreventBox: false})
          getStaffReserve.call(this)
        } else {
          this.setData({showPreventBox: true})
        }
      } else if (this.data.reserveType === 'PRODUCT') {
        if (this.data.productId) {
          this.setData({
            showPreventBox: false
          })
        } else {
          this.setData({
            showPreventBox: true
          })
        }
      } else if (this.data.reserveType === 'TIME') {
        this.setData({
          showPreventBox: false
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 查询手艺人预约信息
function getStaffReserve() {
  let data = {
    token: '27f3733b5daeb3d89a53b6c561f5c753',
    staffId: this.data.craftsmanId,
    date: this.data.date,
    storeId: this.data.storeId
  }
  orderService.reserveStaff(data).subscribe({
    next: res => {
      // 如果查询的手艺人当前的日期下不上班，则返回的data='';
      if(res) {
        let workTimeList = res.timeList;
        let reserveTimeArr = [];
        for (let i = 0; i < res.reservations.length; i++) {
          reserveTimeArr.push(res.reservations[i].time)
        }
        for (let i = 0; i < res.timeList.length; i++) {
          workTimeList[i] = {
            time: res.timeList[i],
            reserve: false
          }
        }

        for (let i = 0; i < reserveTimeArr.length; i++) {
          for (let j = 0; j < workTimeList.length; j++) {
            if (reserveTimeArr.indexOf(workTimeList[j].time) > -1) {
              workTimeList[j].reserve = true;
            }
          }
        }
        this.setData({
          timeList: workTimeList
        })
      } else {
        this.setData({
          timeList: []
        })
      }
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
      week: changeDayToChinese.call(this,odate.getDay()),
      dateData: odate.getFullYear() + '-' + (odate.getMonth() + 1) + '-' + dateNum
    };
  } else {
    return {
      date: '0' + (odate.getMonth() + 1) + '.' + dateNum,
      year: odate.getFullYear(),
      week: changeDayToChinese.call(this,odate.getDay()),
      dateData: odate.getFullYear() + '-' + '0' + (odate.getMonth() + 1) + '-' + dateNum
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