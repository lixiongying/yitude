// pages/member/referrals/index.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    user_id: '',
    datas: '',
    relayflag: 0
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
    this.getInfos();
  },
  
  //获取合伙人优惠券
  getInfos: function () {
    var that = this;
    var user_id = that.data.user_id;
    wx.showLoading({
      title: '正在加载',
    })
    var urls = jiekou + '/WXAPI/Personal/couponList';
    wx.request({
      url: urls,
      data: {
        user_id: user_id
      },
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          var datas = res.data.data.coupon_list;
          that.setData({
            datas: datas,
          })
        }else {
          wx:wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: true,
            success: function(res) {
              wx.navigateBack({

              })
            }
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
  Ikonw: function () {
    this.setData({
      relayflag: 0
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var that=this;
    var user_id = this.data.user_id;
    if(e.from == "button"){
      var ids = e.target.dataset.id;
      if(ids){
        return {
          title: '易涂得（分享优惠券）',
          path: '/pages/logo/index?scene='+ user_id + ',6,' + ids,
          success: function (res) {
            wx.request({
              url: jiekou + '/WXAPI/ClockIn/shareFlag',
              data: { user_id: user_id },
              method: 'post',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {

                if (res.data.code == 0) {

                  var relaydata = res.data.data;
                  var percent = parseInt(res.data.data.percent * 100);

                  var totalgold = parseInt(res.data.data.now_gold) + parseInt(res.data.data.maybe_gold);
                  setTimeout(function () {
                    that.setData({
                      relaydata: relaydata,
                      relayflag: 1,
                      percent: percent,
                      totalgold: totalgold
                    })
                  }, 600)

                } else {
                  var relaydata = res.data.msg
                  setTimeout(function () {
                    that.setData({
                      relaydata: relaydata,
                      relayflag: 1,
                      relaynone: 0
                    })
                  }, 600)
                }
              }
            })


          }
        }
      }
    }
  }
})