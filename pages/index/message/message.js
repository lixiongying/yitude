// pages/index/message/message.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    infoflag:0 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getmessage();
    this.getinfostates()
  },
  getinfostates: function() { 
    var self = this;
    var user_id = app.globalData.user_id;
    wx.request({
      url: jiekou + '/WXAPI/Message/checkNewMessage',
      data: {
        user_id: user_id
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          var fw_new = res.data.data.fw_new;
          var yh_new = res.data.data.yh_new;
         
          self.setData({
            fw_new: fw_new,
            yh_new: yh_new,
            infoflag: 1
          })
         
        }else{
          self.setData({
            fw_new: 0,
            yh_new: 0,
            infoflag: 0
          })
        }
      }
    })
  },
  getmessage: function (){
    var user_id = app.globalData.user_id;
    var self=this;
    wx.request({
      url: jiekou+'/WXAPI/Message/getNewOne',
      data: { user_id: user_id},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
        if(res.data.code==0){
          var datas=res.data.data;
           self.setData({
             datas: datas
           })
        }
      }
    })
  },
  messageinfo: function (e) {
    var types = e.currentTarget.dataset.type;
    var fw_new = this.data.fw_new;
    var yh_new = this.data.yh_new;
    if (types == 1) {
      if (fw_new > 0) {
        app.globalData.infoflags = 1
      }else {
        app.globalData.infoflags = 0
      }
    }else {
      if (yh_new > 0) {
        app.globalData.infoflags = 1
      } else {
        app.globalData.infoflags = 0
      }
    }
   wx.navigateTo({
     url: './messageinfo/messageinfo?types=' + types,
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
    this.getinfostates()
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