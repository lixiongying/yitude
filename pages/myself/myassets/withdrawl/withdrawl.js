// pages/myself/myassets/withdrawl/withdrawl.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    shauxin:0,
    text:'请选择银行卡'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getmoney()
  },
  getmoney: function () {
    var user_id = app.globalData.user_id;
    var self=this;
    wx.request({
      url: jiekou + '/WXAPI/Personal/MyMoney',
      data: { user_id: user_id},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        //  console.log(res)
         if(res.data.code==0){
           var datas = res.data.data.users;
           var usermoney = datas.user_money;
           self.setData({
             datas: datas,
             usermoney: usermoney
           })
         }
      }
    })
  },
  // 输入的金额
  moneys: function (e) {
    var extravalue = e.detail.value; 
  
    this.setData({
      extravalue: extravalue
    })
  },
  // 
  account:function(){
    wx.navigateTo({
      url: '../mybankcard/mybankcard?flag=0',
    })
    // app.globalData.bankflag = 1
  },
  // 提现
  withdrawl: function () {
    var self=this;
    var text=self.data.text;
    var usermoney = self.data.usermoney;
    var bank_id = self.data.bank_id;
    var extravalue = self.data.extravalue;
    var user_id = app.globalData.user_id;
    wx.showLoading({
      title: '正在加载',
    })
    if (parseInt(extravalue) > parseInt(usermoney)) {
      wx.showModal({
        title: '提示',
        content: '可提现余额不足',
      })
    }else if (extravalue == '' || extravalue == undefined || extravalue==null){
      wx.showModal({
        title: '提示',
        content: '请选择要提现的金额',
      })
    } else if (!bank_id) {
      wx.showModal({
        title: '提示',
        content: '请选择银行卡',
      })
    } else{
      wx.hideLoading();
      wx.request({
        url: jiekou+'/WXAPI/Money/withdrawApply',
        data: { user_id: user_id, bank_id: bank_id, money: extravalue},
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res){
  
          if(res.data.code==0){
            wx.showToast({
              title: res.data.msg,
             
            })

            var pages=getCurrentPages();
            var prevpage=pages[pages.length-2]
            prevpage.setData({
             showflag:1
            })
            setTimeout(function(){
              wx.navigateBack()
            },600)
           
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var shauxin = this.data.shauxin;
    // var bankflag=app.globalData.bankflag;
    if (shauxin==1){
      app.globalData.bankflag=0
    }
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