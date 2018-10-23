// pages/index/goodsdetail/goodsdetail.js
const app = getApp()
var jiekou = app.globalData.jiekou;
var WxParse = require('../../../wxParse/wxParse.js');
var innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    current: 0,
    paystate: 0,
    gr_status:0,
    sg_id:'',
    relayflag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var spid = options.sp_id;
    // console.log(spid)
    this.setData({
      spid: spid
    })
    this.getpackageinfo(spid)
  }, 
  packagelist: function (){
    wx.navigateTo({
      url: '../packagelist/index',
    })
  },
  // 保证服务的显示和隐藏
  guarantee: function () {
    var self = this;
    var gr_status = self.data.gr_status;
    if (gr_status == 0) {
      gr_status = 1
    }

    self.setData({
      gr_status: gr_status
    })
  },
  grstatus: function () {
    var self = this;
    var gr_status = self.data.gr_status;
    if (gr_status == 1) {
      gr_status = 0
    }
    self.setData({
      gr_status: gr_status
    })
  },
  // 跳转下单页面
  paydingjin: function (e){
    var self=this;
    var pay = e.currentTarget.dataset.pay;
    var goodsnum = 1;
    var spid = self.data.spid;
    var data = {
      goodsnum: goodsnum,
      sg_id: '',
      types: 2,
      pay_stages: pay,
      sp_id: spid,
      groupid:''
    }
    wx.navigateTo({
      url: "../goodsorder/goodsorder?data=" + JSON.stringify(data),
    })
  },
  // 获取套餐详情信息
  getpackageinfo: function (spid){
    var self=this;
    var spid = spid;
    var user_id = app.globalData.user_id;
    wx.showLoading({
      title: '正在加载',
     
    })
   
    wx.request({
      url: jiekou + '/WXAPI/Goods/packageDetail',
      data: { sp_id: spid, user_id: user_id },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        if(res.data.code==0){
          var goods_content = res.data.data.packdetail.pa_details;
          // 判断用户是否可以预付定金
          var is_stages = res.data.data.packdetail.is_stages;
          
          WxParse.wxParse('content', 'html', goods_content, self, 5);
          var packagelist = res.data.data.packagelist;
          var packdetail = res.data.data.packdetail;
          var is_collect = res.data.data.is_collect;
          self.setData({
            packagelist: packagelist,
            packdetail: packdetail,
            is_collect: is_collect,
            goods_content: goods_content,
            is_stages: is_stages
          })
        }
      
      },
    })
    
  },
  //点击收藏和取消收藏
  collect: function(){
    var self=this;
    var type=1;
    var sp_id = self.data.spid;
    var is_collect = self.data.is_collect;
    var user_id = app.globalData.user_id;
    var data={};
    data.sp_id = sp_id;
    data.type = type;
    data.user_id = user_id;
    if (is_collect==0){
      self.getcollect(data)
    }else{
      self.cancelcollect(data)
    }
  },
  getcollect:function(data){
   var data=data;
   var self=this;
   var is_collect = self.data.is_collect;
   wx.request({
     url: jiekou+'/WXAPI/Goods/collectGoodsPackage',
     data:data,
     method:'post',
     header: {
       'content-type': 'application/x-www-form-urlencoded' // 默认值
     },
     success: function (res){
    
       if(res.data.code==0){
         wx.showToast({
           title: res.data.msg
         })
         self.setData({
           is_collect:1
         })
       }
     } 
   })
  },
  // 取消收藏
  cancelcollect: function(data){
    var self=this;
    var data = data;
   
    var is_collect = self.data.is_collect;
    wx.request({
      url: jiekou + '/WXAPI/Goods/QXCollectGoodsPackage',
      data: data,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
       
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg
          })
          self.setData({
            is_collect: 0
          })
        }
      }
    })
  },
  //轮播图滑动
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  },
  cancelbo: function () {
    this.setData({ paystate: 0 })
  },
  payforbo: function () {
    this.setData({ paystate: 1 })
  },
  surebuy: function () {
    wx.navigateTo({
      url: '../goodsorder/goodsorder',
    })
  },
  // 回到首页
  returnhomepage: function () {
    wx.switchTab({
      url: '../index'
    })
  },
  // 跳到套餐详情
  gopackagedetail: function(e){
    var sp_id = e.currentTarget.dataset.sp_id;
    wx.navigateTo({
      url: '../packagedetail/index?sp_id=' + sp_id,
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
  Ikonw: function () {
    this.setData({
      relayflag: 0
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var user_id = app.globalData.user_id;
    var ids=that.data.spid;
    var share_pic = 'http://yitude.sxnet.cc/Public/upload/logo/2018/09-20/5ba35a80cc192.png';
    // var share_pic = this.data.share_pic;
    return {
      title: '易涂得（邀请一起来易涂得）',
      path: '/pages/index/index?scene=' + user_id + ',9,' + ids,
      imageUrl: share_pic,
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
})