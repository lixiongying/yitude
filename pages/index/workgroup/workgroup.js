// pages/index/workgroup/workgroup.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({
  /**
   * 页面的初始数据
   */
  data: {
   jiekou:jiekou,
   sp_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sp_id = options.sp_id;
    this.setData({
      sp_id: sp_id
    })
    this.getworkgroup()
  },
  // 获取施工团队列表
  getworkgroup: function () {
    var self=this;
    var user_id = app.globalData.user_id;
    var sp_id = self.data.sp_id;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou+'/WXAPI/Orderpackage/ChoiceConstruc',
      data: {
        user_id: user_id,
        sp_id: sp_id
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
        wx.hideLoading();
        if(res.data.code==0){
          var construclist = res.data.data.construclist;
          for (var i = 0; i < construclist.length;i++){
            construclist[i].color = self.randColor()
          }
          // console.log(construclist)
          self.setData({
            construclist: construclist
          })
        }
    
      } 
    })
  },
  // 随机颜色
  rand: function (min, max){
    return parseInt(Math.random() * (max - min + 1) + min);
  },
  randColor: function () {
    var self=this;
    var r = self.rand(0, 255);
    var g = self.rand(0, 255);
    var b = self.rand(0, 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  },
  // 选择某个施工团队
  selectgroup: function (e) {
    var self=this;
    var index = e.currentTarget.dataset.index;
    var construclist = self.data.construclist;
    var userid = e.currentTarget.dataset.user_id;
    var group=[];
    group.push(construclist[index]);
  
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]  //上一个页面
 
    prevPage.setData({
      group: group,
      workflag:1,
      userid: userid
    })
    wx.navigateBack()
  }, 
  noselectgroup: function (){
   wx.showModal({
     title: '提示',
     content: '该施工队正忙，请选择其他',
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