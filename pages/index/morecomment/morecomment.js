// pages/index/morecomment/morecomment.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou:jiekou,
    num:1,
    limit:10,
    searchlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sg_id = options.sg_id;
    this.MoreCommentList(sg_id)
  },
  MoreCommentList: function (sg_id) {
    var self=this;
    var sg_id = sg_id;
    var num = self.data.num;
    var searchlist = self.data.searchlist;
    var limit = self.data.limit;
    wx.request({
      url: jiekou + '/WXAPI/Goods/MOreCommentList',
      data: { num: num, limit: limit, sg_id: sg_id},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        var newpage = 0;
        self.setData({
          num: num + 1,
         
        })
        if (res.data.code == 0) {
          if (res.data.data.commentlist.length > 0) {
            newpage = res.data.data.commentlist.length;

            for (var i = 0; i < res.data.data.commentlist.length; i++) {
              searchlist.push(res.data.data.commentlist[i])
            }
          }
          self.setData({
            searchlist: searchlist,
            page: res.data.data.page,
            newpage: newpage,
           
          })
        } else {
          self.setData({
            newpage: 0
          })
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })
  },
  // 预览图片
  onPreviewTap: function (e) {
    var src = e.currentTarget.dataset.src;
    var reg = new RegExp('"', "g");
    src = src.replace(reg, "");
    var imgstr = [];
    imgstr.push(src)
    wx.previewImage({
      urls: imgstr,
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
    var that = this;
    var sg_id=thta.data.sg_id;
    var num = that.data.num;
    var page = that.data.page;
    
    var newpage = that.data.newpage;
    var limit = that.data.limit;

  
    if (newpage >= limit) {
      that.MoreCommentList(sg_id);
    } else {
      that.setData({
       
        num: 1
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})