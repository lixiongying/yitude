// pages/myself/myassets/getcoin/getcoin.js
const app = getApp()
var jiekou = app.globalData.jiekou;
var innerAudioContext = wx.createInnerAudioContext();

var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coinlist:'',
    user_id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_id = app.globalData.user_id;
    this.setData({
      user_id: user_id
    })
     this.getcoin()
  },
  getcoin:function(){
    var that = this;
    wx.request({
      url: jiekou +'/WXAPI/Personal/clockrule',
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res){
        if(res.data.code==0){
          var contents = res.data.data.clockrule.clockrule_content
          WxParse.wxParse('content', 'html', contents, that, 5);
        }else{
          wx:wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: true,
            success: function(res) {
              wx.navigateBack({
                
              })
            },
          })
        }
      }
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