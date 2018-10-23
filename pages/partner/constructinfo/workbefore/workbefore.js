// pages/partner/constructinfo/workbefore/workbefore.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    datas:[],
    num:1,
    limit:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getconstrucLog()
  },
  getconstrucLog: function () {
    var self = this;
    var user_id = app.globalData.user_id;
    var datas=self.data.datas;
    var limit = self.data.limit;
    var num=self.data.num;
    var number=[];
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou + '/WXAPI/Personal/construcLog',
      data: {
        user_id: user_id,
        limit: limit,
        num: num
      },
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        wx.hideLoading()

        if (res.data.code == 0) {
           
          var construc_order = res.data.data.construc_order;
          if (construc_order.length!=0){
            for (var i = 0; i < construc_order.length;i++){
              datas.push(construc_order[i]);
              if (construc_order[i].construc_comment != '' || construc_order[i].construc_comment != undefined) {
                number.push( parseInt(construc_order[i].construc_comment.score));
              }
            }
          }
          console.log(number)
          num = parseInt(num) + 1;
          self.setData({
            datas: datas,
            page: res.data.data.page,
            num: num,
            number: number
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
    var page = that.data.page;

    if (page.cu_page > page.total_page) {

    } else {
      that.getconstrucLog()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})