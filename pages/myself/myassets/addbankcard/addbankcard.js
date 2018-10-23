// pages/myself/myassets/addbankcard/addbankcard.js
const card = require('../../../../wxParse/card.js');
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setCard:'',
    code:'',
    username:'',
    phone:'',
    idcard:'',
    timeflag:0,
    value: '发送验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  getbanknumber: function (e) {
    var that = this;
    var value = e.detail.value;

    var setCard = that.data.setCard;
    setCard=value;
    if (setCard == '' || setCard == undefined || setCard==null){

    }else{
      wx.showLoading({
        title: '正在查找',
      })
      card.getBankBin(setCard, function (err, data) {
        wx.hideLoading();

        if (!err) {
          that.setData({
            cardname: data.bankName,
            cardid: data.bankCode,
            setCard: setCard
          });
        } else {
          wx: wx.showModal({
            title: '提示',
            content: err,
            showCancel: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      })
    }
    
  },
  // 获取真实姓名
  getusername: function (e) {
    var username = e.detail.value;
    this.setData({
      username: username
    })
  },
  // 获取身份证号码
  getidcard: function (e) {
    var idcard = e.detail.value;
    this.setData({
      idcard: idcard
    })
  },
  // 获取手机号码
  getphone: function (e) {
    var phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  // 获取验证码
  getcode: function (e) {
    var phone = e.detail.value;
    this.setData({
      code: phone
    })
  },
  // 手机验证码正则
  isPoneAvailable: function (str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  },
  // 发送验证码
  setcode: function () {
    var self=this;
    var phone = this.data.phone;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    
    if (!phone){
      wx.showModal({
        title: '提示',
        content: '请输入手机号码',
      })
    } else if (!myreg.test(phone)){
      wx.showModal({
        title: '提示',
        content: '手机号码格式有误',
      })
    }else{
     wx.request({
       url: jiekou + '/WXAPI/Personal/sendValidateCode',
       method: 'post',
       header: {
         'content-type': 'application/x-www-form-urlencoded' // 默认值
       },
       data: { mobile: phone},
       success: function (res){
        
         if(res.data.code==0){
           wx.showToast({
             title: '发送成功',
           })
           var time = 120;
           var countdown = setInterval(countDown, 1000);
           function countDown() {
             self.setData({
               timeflag: 1,
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
         }else{
           wx.showModal({
             title: '提示',
             content: res.data.msg,
           })
         }
       }
     })
    }
  },
  // 提交
  submit: function () {
    var self=this;
    var cardname = self.data.cardname;
    var cardid = self.data.cardid;
    var username = self.data.username;
    var code = self.data.code;
    var phone = self.data.phone;
    var idcard = self.data.idcard;
    var user_id = app.globalData.user_id;
    var setCard = self.data.setCard;

    if (!cardname){
      wx.showModal({
        title: '提示',
        content: '请输入银行卡',
      })
    
    } else if (!username){
      wx.showModal({
        title: '提示',
        content: '请输入银行卡',
      })
     
    } else if (!phone) {
      wx.showModal({
        title: '提示',
        content: '请输入手机号码',
      })

    } else if (!code) {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
      })

    }else{
       wx.request({
         url: jiekou + '/WXAPI/Money/addUserBank',
         method: 'post',
         data: { user_id: user_id, user_name: username, card_no: setCard, bank_code: cardid, bank_name: cardname, user_card_id: idcard, card_phone: phone, phone_code: code},
         header: {
           'content-type': 'application/x-www-form-urlencoded' // 默认值
         },
         success: function (res){
       
           if(res.data.code==0){
             wx.showToast({
               title: "操作成功，请等待审核",
               icon: 'success',
               duration: 1000,
             })
             var pages = getCurrentPages();
             var prevPage = pages[pages.length - 2]  //上一个页面

             prevPage.setData({
               shauxin: 1,

             })
             setTimeout(function () {
               wx.navigateBack()
             }, 2000)

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