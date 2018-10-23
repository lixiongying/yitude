// pages/partner/coupon/index.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[],
    user_id:'',
    jiekou: jiekou,
    couponlist:[],
    create_time:[],
    end_time:[],
    totalmoney:'',
    couponstate:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var datas = options.datas;
    var user_id = app.globalData.user_id;
    datas = JSON.parse(datas);
    this.setData({
      datas: datas,
      user_id:user_id
    })
    this.getusecoupon()
  },
  // / 时间戳转换时间
    toDate:function (number) {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },

  getusecoupon:function(){
    var self=this;
    var datas = self.data.datas;
 
    var user_id = app.globalData.user_id;
    var type = datas.types;
    var sg_id = datas.sg_id;
    var sp_id = datas.sp_id;
    var goods_num = datas.goodsnum;
    var pay_stages = datas.pay_stages;
    var data={
      user_id: user_id,
      type: type,
      sp_id: sp_id,
      sg_id: sg_id,
      goods_num: goods_num,
      pay_stages: pay_stages
    };
    
    wx.request({
      url: jiekou +'/WXAPI/Goods/yesMyCoupon',
      data:data,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){

        if (res.data.code == 0){
          if (res.data.data.couponlist == '' || res.data.data.couponlist == undefined || res.data.data.couponlist == null) {
            self.setData({
              couponstate:0
            })
          }else{
            var couponlist = res.data.data.couponlist;
            var create_time = self.data.create_time;
            var end_time = self.data.end_time;

            for (var i = 0; i < couponlist.length; i++) {

              couponlist[i].create_time = self.toDate(couponlist[i].create_time)
              couponlist[i].end_time = self.toDate(couponlist[i].end_time)
            }
            
            self.setData({
              couponlist: couponlist,
            })

          }
        }else{
         wx.showModal({
           title: '提示',
           content: res.data.msg,
         })
        }
       
      }
    })
  },
  // 点击使用优惠券返回
  usecoupon:function(e){
    
    var self=this;
    var refreshFlag = app.globalData.refreshFlag;
    var freemoney = e.currentTarget.dataset.money;

    var coupon_id = e.currentTarget.dataset.coupon_id;
  
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      freemoney: freemoney,
      coupon_id: coupon_id
    })
    app.globalData.refreshFlag=true;
    wx.navigateBack()
  
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