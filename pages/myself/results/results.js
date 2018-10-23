// pages/myself/results/results.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    user_id: '',
    cu_page: 1,
    page_size: 10,
    datas: [],
    newpage: 10,
    flag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_id = app.globalData.user_id;
    this.setData({
      user_id: user_id
    })
    this.getaddress();
  },
  //进入结果页面
  linkresult: function(e){
    var ids = e.currentTarget.dataset.id;
    if(ids){
      wx.navigateTo({
        url: '../../selectcolor/result/index?ids='+ ids,
      })
    }
  },
  // 获取收获地址列表
  getaddress: function () {
    var that = this;
    var user_id = that.data.user_id;
    var cu_page = that.data.cu_page;
    var page_size = that.data.page_size;
    var page = that.data.page;
    this.setData({
      flag: false
    })
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou + '/WXAPI/Game/testList',
      data: { user_id: user_id, p: cu_page, pagesize: page_size },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        var newpage = 0;
        that.setData({
          cu_page: cu_page+ 1,
          flag: true,
        })
        if (res.data.code == 0) {
          var datas = that.data.datas;
          var data = res.data.data.root;
          if(data.length > 0) {
            newpage = data.length;
            for(let i = 0; i < data.length; i++) {
              datas.push(data[i]);
            }
            that.setData({
              datas: datas,
              newpage: newpage
            })
          }else {
            that.setData({
              newpage: 0
            })
          }
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
    var that = this;
    var cu_page = that.data.cu_page;
    var newpage = that.data.newpage;
    var page_size = that.data.page_size;
    var flag = that.data.flag;
    if (flag) {
      if (newpage >= page_size) {
        that.getaddress();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})