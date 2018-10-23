// pages/myself/setting/setting.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_id = app.globalData.user_id;
    var userinfo = app.globalData.userInfo;
    var psdstatus = app.globalData.psdtatus;
   
    this.setData({
      userinfo: userinfo,
      psdstatus: psdstatus
    })
    this.getmyself()
  },
  // 个人中心获得数据
  getmyself: function () {
    var self = this;
    var user_id = app.globalData.user_id;

    wx.request({
      url: jiekou + '/WXAPI/Personal/personalInfo',
      data: { user_id: user_id },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {

        if (res.data.code == 0) {
          var datas = res.data.data;

          var psdtatus = datas.userinfo.paypassword;

          app.globalData.psdtatus = psdtatus;
          self.setData({
            datas: datas
          })
        }

      }
    })
  },

  // 跳到我的二维码
  Myqrcode:function(){
    wx.navigateTo({
      url: './Myqrcode/Myqrcode',
    })
  },
  // 跳到我的收货地址
  goodsaddress: function () {
    wx.navigateTo({
      url: './goodsaddress/goodsaddress',
    })
    app.globalData.adsflag=0;
  },
  // 跳到意见反馈
  feedback: function () {
    wx.navigateTo({
      url: './feedback/feedback',
    })
  },
// 跳到关于我们
  aboutus: function () {
    wx.navigateTo({
      url: './aboutus/aboutus',
    })
  },
  // 设置密码
  setpsd: function () {
    wx.navigateTo({
      url: 'setpsd/setpsd',
    })
  },
  // 修改支付密码
  changepsd: function () {
    wx.navigateTo({
      url: 'changepsd/changepsd',
    })
  },
  // 找回支付密码
  findpsd: function () {
    wx.navigateTo({
      url: 'findpsd/findpsd',
    })
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