import {constant} from 'constant';
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();



  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function errCheck(res) {
  if(res.errorCode === '0'){
    return true;
  } else {
    return false;
  }
}
//设置标题
function setTitle() {
  wx.getStorage({
    key: constant.STORE_INFO,
    success: (res) => {
      wx.setNavigationBarTitle({
        title: JSON.parse(res.data).storeName
      });
    }
  });
}

function errDialog(content) {
  wx.hideToast();
  wx.showModal({
    title: '温馨提示',
    content: `${content}`,
    showCancel: false,
    success: function (res) {
    }
  });
}
function checkMobile(sMobile){
  if(!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(sMobile))){
    return false;
  }else {
    return true;
  }
}

function checkPhone(str){
  var re = /^0\d{2,3}-?\d{7,8}$/;
  if(re.test(str)){
    return true;
  }else{
    return false;
  }
}
/**
 * 获取路径参数
 * @param url
 * @param name
 * @returns {null}
 */
function getUrlParma(url, name)
{
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = url.substr(url.indexOf("\?")+1).match(reg);
  if (r!=null) return unescape(r[2]); return null;
}

function getUserInfo() {
  return JSON.parse(wx.getStorageSync(constant.USER_INFO));
}
module.exports = {
  formatTime: formatTime,
  errCheck: errCheck,
  setTitle: setTitle,
  errDialog: errDialog,
  checkMobile: checkMobile,
  checkPhone: checkPhone,
  getUserInfo: getUserInfo
}
