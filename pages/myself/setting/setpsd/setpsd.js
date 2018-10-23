// pages/myself/setting/setpsd/setpsd.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
   jiekou:jiekou,
  //  新密码
   new_pwd:null,
  //  确认密码
   confirm_pwd: null,
  //  原密码
   old_pwd:'',
  //  验证码
    phone_code:'',
    // 手机号码
    card_phone:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getpsd: function (e) {
    var new_pwd=e.detail.value;
    this.setData({
      new_pwd: new_pwd
    })
  },
  surepsd: function (e) {
    var confirm_pwd = e.detail.value;
    this.setData({
      confirm_pwd: confirm_pwd
    })
  },
  // 获取手机号
  getPhoneNumber: function (e) {
    var self=this;
    var session_key = app.globalData.session_key;
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
     wx.request({
       url: jiekou+'/WXAPI/Personal/StayPhone',
       data: { iv: iv, appid: 'wx500b6916bb5ef2e3', session_key: session_key, encryptedData: encryptedData},
       method: 'post',
       header: {
         'content-type': 'application/x-www-form-urlencoded' // 默认值
       },
       success:function(res){
         if(res.data.code==0){
           var mobile = res.data.mobile;
          
           self.setData({
             card_phone: mobile
           })
         }else{
           wx.showModal({
             title: '提示',
             content: res.data.msg,
           })
         }
       
       }
     })
  },
  // 获取验证码
  getcodenumber: function (){
    var card_phone = this.data.card_phone;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

    if (!card_phone) {
      wx.showModal({
        title: '提示',
        content: '请输入手机号码',
      })
    } else if (!myreg.test(card_phone)) {
      wx.showModal({
        title: '提示',
        content: '手机号码格式有误',
      })
    } else {
      wx.request({
        url: jiekou + '/WXAPI/Personal/sendValidateCode',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: { mobile: card_phone },
        success: function (res) {

          if (res.data.code == 0) {
            wx.showToast({
              title: '发送成功',
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }
        }
      })
    }
  },
  getcode: function (e) {
    var phone_code=e.detail.value;
    this.setData({
      phone_code: phone_code
    })
  },
  save: function () {
   
    var old_pwd = this.data.old_pwd;
    var new_pwd = this.data.new_pwd;

    var user_id = app.globalData.user_id;
    var confirm_pwd = this.data.confirm_pwd;
    var card_phone = this.data.card_phone;
    var phone_code = this.data.phone_code;
    var types=0;
    if (!new_pwd) {
      wx.showModal({
        title: '提示',
        content: '密码不能为空',
      })
    } else if (new_pwd.length<6){
      wx.showModal({
        title: '提示',
        content: '密码长度不能小于6位',
      })
    } else if (new_pwd != confirm_pwd){
      wx.showModal({
        title: '提示',
        content: '两次输入密码不一致',
      })
    } else if (!card_phone) {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
      })
    } else if (!phone_code) {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
      })
    }else{
      wx.request({
        url: jiekou+'/WXAPI/Personal/editPayPwd',
        data: { user_id: user_id, old_pwd: old_pwd, new_pwd: new_pwd, confirm_pwd: confirm_pwd, phone_code: phone_code, card_phone: card_phone,types:types},
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success:function(res){
          if(res.data.code==0){
            wx.showToast({
              title: res.data.msg,
            })
            setTimeout(function () {
              wx.hideToast();
              wx.navigateBack()
              // wx.switchTab({
              //   url: '../../myself',
              // })
            },1000)
          }else{
            wx.showToast({
              title: res.data.msg,
            });
            
          }
        },
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})