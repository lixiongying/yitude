// pages/index/classify/classify.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    navelist: [],
    typeid: '',
    categorylist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self=this;
    var typeid = options.typeid;
    self.getcategorylist(typeid);  
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res)
        self.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
         
        });
      }
    });
  },
  getcory:function(e){
    var cat_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goodslist/goodslist?cat_id=' + cat_id,
    })

  },
   // 获取一级分类
  getcategorylist: function (typeid){
    var self = this;
    var typeid = typeid;
    var navelist = self.data.navelist;
    wx.request({
      url: jiekou+'/WXAPI/Goods/categorylist',
      method: 'post',
      success: function (res){
        // console.log(res)
         if(res.data.code==0){
           navelist = res.data.data.onelist;
           self.setData({
             navelist: navelist,
             typeid: typeid
           })
         }

      }
    })
  },
  // 获取二级分类
  getlist:function(e){
    var self = this;

    var typeid = e.currentTarget.dataset.id;
    self.setData({
      typeid: typeid
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