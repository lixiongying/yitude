// pages/myself/myassets/myassets.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    showflag:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    this.getmyasset()
  },
  getmyasset: function (){
    var self=this;
    var user_id = app.globalData.user_id;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou+'/WXAPI/Personal/MyMoney',
      data: { user_id: user_id},
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        wx.hideLoading()
        // console.log(res)
        var datas=res.data.data.users;
        self.setData({
          datas: datas
        })
      }
    })
  },
  mingxi:function(e){
   
    var curtab = e.currentTarget.dataset.current;
    wx.navigateTo({
      url: './mingxi/mingxi?curtab=' + curtab,
    })
    
  },
  withdrawl:function(){
    wx.navigateTo({
      url: './withdrawl/withdrawl',
    })
  },
  // 跳转到我的银行卡列表
  mycard:function(){
    wx.navigateTo({
      url: './mybankcard/mybankcard?flag=1',
    })
    
  },
  getcoin:function(){
    wx.navigateTo({
      url: './getcoin/getcoin',
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
    var showflag = this.data.showflag;
    if (showflag==1){
      this.getmyasset()
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