// pages/myself/coupon/coupon.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth:'0',
    winHeight:'0',
    navList: ['未使用', '已使用', '已过期'],
    currentTab:0,
    datas:[[],[],[]],
    num:[1,1,1],
    jiekou:jiekou,
    falg:true,
    user_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var user_id = app.globalData.user_id;
  
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res)
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          user_id: user_id
        });
      }
    });
    //调用收藏列表
    that.getlist(0);
    that.getlist(1);
    that.getlist(2);
  },
  // 获取优惠券列表
  getlist: function (types) {
    var that = this;
    var data = {};
    var types = types;
   
    var user_id = that.data.user_id;
    var num = that.data.num;

    data.user_id = user_id;
    data.types = types;
    data.num = num[types];
    data.limit = 10;

    that.getcoupon(data, types, function () {
      num[types] = parseInt(num[types]) + 1;
      that.setData({
        num: num,
        falg: true,
      })
    });

  },

  //获取优惠券列表
  getcoupon: function (data, types, call) {
    var data = data;
    var types = types;
    var that = this;
    var dataList = that.data.datas;

    var advertiseUrls = jiekou + '/WXAPI/Personal/MyCouponList'

    that.setData({ falg: false });
    wx.request({
      url: advertiseUrls,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          var datas = res.data.data.couponList;
          var page = res.data.data.page;
          if (page.cu_page > page.total_page) {
            // wx.showToast({
            //   title: '没有更多~~',
            //   image: '../../../images/error.png',
            //   duration: 1000,
            // })
          }
          if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
              dataList[types].push(datas[i]);
            }
       

            that.setData({
              datas: dataList,
              page: page
            })
          }
        }
        if (call) {
          call();
        }
      }
    });
  },
  // 滚动框到底部
  bindDownLoad: function (e) {

    var that = this;
    var index = e.currentTarget.dataset.index;
    var falg = that.data.falg;
    var page = that.data.page;
    if (falg) {
      if (page.cu_page > page.total_page) {

      } else {
        that.getlist(index);
      }
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
  bindChange:function(e){
    var that = this;
    var num = e.detail.current;
    that.setData({
      navScrollLeft: num * 90,
      currentTab: num
    })

  },
  swichNav: function (e) {

    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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