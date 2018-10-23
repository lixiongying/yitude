// pages/index/message/messageinfo/messageinfo.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    pageSize:5,
    datas:[],
    currPage:1,
    falg:true,
    botataus:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var types=options.types;
    this.setData({
      types: types
    })
    this.getmessage(types)
  },

  getmessage: function (types) {
   
    var types=types;
    var user_id = app.globalData.user_id;
    
    var self = this;
    var p=self.data.p;
    var pageSize = self.data.pageSize;
    var currPage = self.data.currPage;
    wx.request({
      url: jiekou + '/WXAPI/Message/getMsgList',
      data: { user_id: user_id, category: types, p: currPage, pageSize: pageSize },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
      
        if (res.data.code == 0) {
          var data = res.data.data.root;
          var datas = self.data.datas;
          if (data){
            for (var i = 0; i < data.length; i++) {
              datas.push(data[i])
            }
          }
          var totalPage=res.data.data.totalPage
        
          self.setData({
            datas: datas,
            totalPage: totalPage,
            currPage: res.data.data.currPage
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
    var currPage = that.data.currPage;
    var types = that.data.types;
    var falg = that.data.falg;
    var totalPage = that.data.totalPage;
    // console.log(currPage)
    // console.log(totalPage)
    if (falg) {
      if (currPage == totalPage) {
        // wx.showModal({
        //   title: '提示',
        //   content: '已经到底啦'
        // })
        that.setData({
          botataus: 1
        })

      } else {
        wx.showLoading({
          title: '正在加载',
        })
        setTimeout(function () {
          wx.hideLoading({
            
          })
          currPage = parseInt(currPage)+1;
          that.setData({ currPage: currPage });
          that.getmessage(types);
        }, 500);
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})