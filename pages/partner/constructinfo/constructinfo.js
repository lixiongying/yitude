// pages/partner/constructinfo/constructinfo.js
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
    this.getMyOrderInfo()
  },
  //点击拨打电话
  playPhone: function (e) {
    var phone = e.currentTarget.dataset.phone;;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    } else {
      wx: wx.showModal({
        title: '提示',
        content: '暂无联系方式',
        showCancel: true,
      })
    }
  },
  complete: function (e) {
    var order_package_id = e.currentTarget.dataset.order_package_id;
    var user_id = app.globalData.user_id;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou + '/WXAPI/Personal/ApplyForCompletion',
      data: {
        user_id: user_id,
        order_package_id: order_package_id
      },
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res){
        wx.hideLoading()
        // console.log(res)
        if(res.data.code==0){
          wx.showModal({
            title: '提示',
            content:res.data.msg,
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
  getMyOrderInfo: function () {
    var self=this;
    var user_id = app.globalData.user_id;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou +'/WXAPI/Personal/MyOrderInfo',
      data: {
        user_id: user_id
      },
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        wx.hideLoading()
     
        if (res.data.code == 0) {
          var construc_order = res.data.data.construc_order;
      
          var user = res.data.data.user;
          self.setData({
            construc_order: construc_order,
            user: user
          })
        }
      }
    })
  },
  workbefore: function () {
     wx.navigateTo({
       url: './workbefore/workbefore',
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