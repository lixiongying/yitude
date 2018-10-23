// pages/goods/index.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    none: 0,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    navList: ['早起榜', '早睡榜'],
    datas: [[], []],
    jiekou: jiekou,
    user_id: '',
  },
  hideModel: function(){
    this.setData({
      none: 0,
    })
  },
  showModel: function () {
    this.setData({
      none: 1,
    })
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    var num = e.detail.current;
    that.setData({
      navScrollLeft: num * 90,
      currentTab: num
    })

  },
  swichNav: function (e) {

    var that = this;
    var current = e.currentTarget.dataset.current;
    if (this.data.currentTab === current) {
      return false;
    } else {
      that.setData({
        currentTab: current
      })
    }
  },
  //选项卡到底部
  bindDownLoad: function(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_id = app.globalData.user_id;
    this.setData({
      user_id: user_id
    })
    wx.getSystemInfo({

      success: function (res) {
        // console.log(res)
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    //调用pk列表
    that.getList(1);
    that.getList(2);
  },
  getList: function (types) {
    var that = this;
    var data = {};
    var types = types;
    var list = that.data.datas;
    var user_id = that.data.user_id;
    var advertiseUrls = jiekou + '/WXAPI/ClockIn/seePk';
    wx.request({
      url: advertiseUrls,
      data: { user_id: user_id, type: types},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          var datas = res.data.data;
          list[types - 1] = datas;
          that.setData({
            datas: list
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
    var that = this;
    var user_id = that.data.user_id;
    return {
      title: '易涂得（邀请一起打卡赚金币）',
      path: '/pages/index/index?user_id' + user_id + '&index=3',
    }
  }
})