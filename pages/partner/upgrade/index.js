// pages/partner/upgrade/index.js
const app = getApp();
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: '',
    jiekou: jiekou,
    user_id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_id = app.globalData.user_id;
    that.setData({
      user_id: user_id
    })
    that.getlistinfo();
  },
  //跳转申请
  linkapplying: function(e){
    var ids = e.currentTarget.dataset.id;
    var names = e.currentTarget.dataset.names;
    if(ids){
      wx.navigateTo({
        url: '../applying/index?ids=' + ids + '&names=' + names,
      })
    }
  },
  //获取生活方式数据
  getlistinfo: function () {
    var that = this;
    var user_id = that.data.user_id;
    var urls = jiekou + '/WXAPI/Personal/partnerList';
    wx.request({
      url: urls,
      data: {
        user_id: user_id
      },
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.code == 0) {
          var data = res.data.data.partnerlist;
          that.setData({
            datas: data,
          })
        }
      }
    });
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