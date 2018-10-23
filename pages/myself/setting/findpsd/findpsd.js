// pages/myself/setting/findpsd/findpsd.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changestatus:0,
    jiekou:jiekou,
    value:'发送验证码',
    timeflag:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取手机号
  getphone: function (e) {
    var phone=e.detail.value;
    this.setData({
      phone: phone
    })
  },
   // 获取验证码
  getcode: function (e) {
    var code = e.detail.value;
    this.setData({
      code: code
    })
  },
  // 获取验证码
  getcodenumber: function () {
    var self=this;
    var card_phone = this.data.phone;
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
      wx.showLoading({
        title: '正在发送',
      })
      wx.request({
        url: jiekou + '/WXAPI/Personal/sendValidateCode',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: { mobile: card_phone },
        success: function (res) {
          wx.hideLoading()
          if (res.data.code == 0) {
            wx.showToast({
              title: '发送成功',
            })
            var time = 120;
            var countdown = setInterval(countDown, 1000);
            function countDown() {
              self.setData({
                timeflag:1,
                value: time
              })
              if (time == 0) {
                self.setData({
                  timeflag: 0,
                  value: '发送验证码'
                })
                clearInterval(countdown);
              }
              time--
            }
           
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
  // 下一步
  next: function () {
    var self=this;
    var phone = self.data.phone;
    var code = self.data.code;
    var user_id = app.globalData.user_id;
    if (!phone){
      wx.showModal({
        title: '提示',
        content: '手机号不能为空',
      })
    } else if (!code){
      wx.showModal({
        title: '提示',
        content: '验证码不能为空',
      })
    }else{
      wx.request({
        url: jiekou + '/WXAPI/Personal/VerificationPhone',
        data: { user_id: user_id, mobile: phone, code: code },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res)
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.msg,
            })
            self.setData({
              changestatus: 1
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              image: '../../../../images/error.png',
              duration: 1000,
            })
          }
        }
      })
    }
    
  },

  // 设置新密码
  getpsd: function (e) {
    var newpsd=e.detail.value;
    this.setData({
      newpsd: newpsd
    })
  },
  // 设置新密码
  surepsd: function (e) {
    var surepsd = e.detail.value;
    this.setData({
      surepsd: surepsd
    })
  },
  complete: function (e) {
    var self=this;
    var surepsd = self.data.surepsd;
    var newpsd = self.data.newpsd;
    var user_id = app.globalData.user_id;
    if (!newpsd){
      wx.showModal({
        title: '提示',
        content: '请输入密码',
      })
    } else if (newpsd.length<6){
      wx.showModal({
        title: '提示',
        content: '密码长度不得小于六位',
      })
    } else if (newpsd != surepsd){
      wx.showModal({
        title: '提示',
        content: '两次密码输入不一致',
      })
    }else{
      wx.request({
        url: jiekou+'/WXAPI/Personal/editPayPwd',
        data: { new_pwd: newpsd, confirm_pwd: surepsd, user_id: user_id,types:2},
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res){
        
          if(res.data.code==0){
            wx.showToast({
              title: "成功修改", 
              icon: 'success',
              duration: 1000,
            })              
            
            setTimeout(function () { 
              wx.hideToast()
            wx.navigateBack()
            }, 1500)
          }
        }
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