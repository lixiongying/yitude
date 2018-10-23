// pages/myself/setting/changepsd/changepsd.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    newpsd: null,
    //  确认密码
    comfirmpsd: null,
    //  原密码
    old_pwd: '',
    // //  验证码
    // phone_code: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  findpsd: function () {
    wx.navigateTo({
      url: '../findpsd/findpsd',
    })
    
  },
  getoldpsd: function (e) {
    var old_pwd=e.detail.value;
    // console.log(typeof (old_pwd))
    this.setData({
      old_pwd: old_pwd
    })
  },
  getnewpsd: function (e) {
    var newpsd = e.detail.value;
    this.setData({
      newpsd: newpsd
    })
  },
  getcomfirmpsd: function (e) {
    var comfirmpsd = e.detail.value;
    this.setData({
      comfirmpsd: comfirmpsd
    })
  },
  save: function (){
    var self=this;
    var old_pwd = self.data.old_pwd;
    var newpsd = self.data.newpsd;
    var comfirmpsd = self.data.comfirmpsd;
    var user_id = app.globalData.user_id;
    if (!old_pwd){
      wx.showModal({
        title: '提示',
        content: '请输入密码',
      })
    } else if (old_pwd.length<6){
      wx.showModal({
        title: '提示',
        content: '密码长度不得小于6位',
      })
    } else if (!newpsd) {
      wx.showModal({
        title: '提示',
        content: '请输入新密码',
      })
    } else if (newpsd.length < 6) {
      wx.showModal({
        title: '提示',
        content: '密码长度不得小于6位',
      })
    } else if (newpsd != comfirmpsd) {
      wx.showModal({
        title: '提示',
        content: '两次输入的密码不一致',
      })
    }else{
      wx.request({
          url: jiekou + '/WXAPI/Personal/editPayPwd',
        data: { old_pwd: old_pwd, new_pwd: newpsd, confirm_pwd: comfirmpsd, types: 1, user_id: user_id},
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res){
            console.log(res)
            if(res.data.code==0){
               wx.showToast({
                 title: '修改成功',
               })
               setTimeout(function(){
                 wx.hideToast();
                 wx.navigateBack()
               },600)
            }else{
              wx.showModal({
                title: '提示',
                content: res.data.msg
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