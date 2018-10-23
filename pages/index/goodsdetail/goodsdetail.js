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
    jiekou:jiekou,
    state:'0',
    current: 0,
    paystate:0,
    sg_id:'',
    goods_content:[],
    goodsimg:[],
    goodsinfo:[],
    group_list2:[],
    goodsnum:1,
    sg_stock:'',
    gr_status:0,
    is_collect:'',
    groupid:0,
    entimelist:[],
    entimelist2:[],
    relayflag: 0,
    collageflag:0,
    showflag:0,
    shua:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sg_id = options.sg_id;
  
    var groupid = options.groupid;
    if (groupid){
      this.setData({
        groupid: groupid,
        paystate:1,
        groupstatus:1
      })
    }
    var user_id = app.globalData.user_id;
    var userInfo = app.globalData.userInfo;
    this.setData({
      sg_id: sg_id,
      user_id: user_id,
      userInfo: userInfo
    })
    this.getgoodsdetail(sg_id)
   
  },
  // 预览图片
  onPreviewTap: function (e) {
    var src = e.currentTarget.dataset.src;
    var reg = new RegExp('"', "g");
    src = src.replace(reg, "");  
    var imgstr=[];
    imgstr.push(src)
    wx.previewImage({
      urls: imgstr,
    });
  },
  giads: function () {
    wx.redirectTo({
      url: "../../myself/myorder/myorder?currtab=2"
    })
  },
   timeFormat:function(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown: function () {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    var self = this;
    var newTime = new Date().getTime();
    var endTimeList = this.data.entimelist;
    var countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(function(o){
    // 苹果机上有bug
      // var endTime = new Date(o).getTime();
      // 兼容苹果安卓
      var arr = o.split(/[- :]/);
      var nndate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
      nndate = Date.parse(nndate)
      var endTime = nndate;
      var obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        var time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        var day = parseInt(time / (60 * 60 * 24));
        var hou = parseInt(time % (60 * 60 * 24) / 3600);
        var min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        var sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: self.timeFormat(day),
          hou: self.timeFormat(hou),
          min: self.timeFormat(min),
          sec: self.timeFormat(sec),
          collageflag: 0
        }
      } else {//活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00',
          collageflag:1
        }
        // self.setData({
        //   collageflag:1
        // })
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    self.setData({ countDownList: countDownArr })
    setTimeout(self.countDown, 1000);
  },
  
  // 调商品详情接口
  getgoodsdetail: function (sg_id){
   
    wx.showLoading({
      title: '正在加载',
    })
    var self=this;
    var packagelist = self.data.goodslist;
    var goodsimg = self.data.goodsimg;
    var goodsinfo = self.data.goodsinfo;
    var goods_content = self.data.goods_content;
    var sg_id = sg_id;
   
    var user_id = app.globalData.user_id;
    // console.log(user_id)
    // 库存
    var sg_stock = self.data.sg_stock;
    
    wx.request({
      url: jiekou+'/WXAPI/Goods/goodsDetail',
      data: { user_id: user_id, sg_id: sg_id},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
        wx.hideLoading()
        // console.log(res)
        var goods_content = res.data.data.info.goods_content;
        var comlist=res.data.data.comlist;
        var group_list2 = res.data.data.group_list2;
        var comcount = res.data.data.comcount;
        var entimelist=[];
        if (group_list2.length!=0){
          for (var i = 0; i < group_list2.length; i++) {
            entimelist.push(group_list2[i].endtime)
          }
        }
        
        if (comcount>2){
          self.setData({
            comstatus:1
          })
        }
  
        WxParse.wxParse('content', 'html', goods_content, self, 5);
        app.globalData.store_id = res.data.data.info.store_id;
        self.setData({
          goodsimg: res.data.data.goods_images,
          goodsinfo: res.data.data.info,
          goods_content: goods_content,
          comlist: res.data.data.comlist,
          packagelist: res.data.data.packagelist,
          sg_stock: res.data.data.info.sg_stock,
          is_collect: res.data.data.is_collect,
          info: res.data.data,
          group_list2: res.data.data.group_list2,
          entimelist: entimelist,
          comcount: res.data.data.comcount
        })
        self.countDown(1);
      }
    })
    
  },
  //点击收藏和取消收藏
  collect: function () {
    var self = this;
    var type = 0;
    var sg_id = self.data.sg_id;
    var is_collect = self.data.is_collect;
    var user_id = app.globalData.user_id;
    var data = {};
    data.sg_id = sg_id;
    data.type = type;
    data.user_id = user_id;
    // console.log(is_collect)
    
    if (is_collect == 0) {
      self.getcollect(data)
    } else {
      self.cancelcollect(data)
    }
  },
  getcollect: function (data) {
    var data = data;
    var self = this;
    var is_collect = self.data.is_collect;
    wx.request({
      url: jiekou + '/WXAPI/Goods/collectGoodsPackage',
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
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            refreshfalg: 1
          })
          self.setData({
            is_collect: 1
          })
        }
      }
    })
  },
  // 取消收藏
  cancelcollect: function (data) {
    var self = this;
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
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            refreshfalg:1
          })
          self.setData({
            is_collect: 0
          })
        }
      }
    })
  },
// 保证服务的显示和隐藏
  guarantee:function(){
    var self=this;
    var gr_status = self.data.gr_status;
    if (gr_status==0){
      gr_status=1
    }
   
    self.setData({
      gr_status: gr_status 
    })
  },
  grstatus:function(){
    var self = this;
    var gr_status = self.data.gr_status;
    if (gr_status == 1) {
      gr_status = 0
    }
    self.setData({
      gr_status: gr_status
    })
  },
  // 拼团更多的弹框
  grouping:function(e){
    // var sg_id = e.currentTarget.dataset.sg_id;
    var state = this.data.state;
    var sg_id = this.data.sg_id;
    var self=this;
    this.setData({
      state: 1
    })
    wx.request({
      url: jiekou+'/WXAPI/Goods/MoreGroupList',
      data: {sg_id: sg_id },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
        if(res.data.code==0){
          var group_list = res.data.data.group_list;
          var entimelist2 = [];
          if (group_list.length!=0){
            for (var i = 0; i < group_list.length; i++) {
              entimelist2.push(group_list[i].endtime)
            }
           
            self.setData({
              group_list: res.data.data.group_list,
              entimelist: entimelist2
            })
            self.countDown();
          }
          
          
        }
      }
    })
  },
  // 跳到套餐列表
  packagelist:function(e){
    var self=this;
    var store_id = e.currentTarget.dataset.store_id;
    app.globalData.store_id = store_id;
    var sg_id = self.data.sg_id;
    var datas={};
    datas.sg_id = sg_id;
    datas.store_id = store_id;
    wx.navigateTo({
      url: '../packagelist/index?datas='+JSON.stringify(datas),
    })
  },
  // 跳到套餐详情
  gopackagedetail: function (e){
    var sp_id = e.currentTarget.dataset.sp_id;
    wx.navigateTo({
      url: '../packagedetail/index?sp_id=' + sp_id,
    })
  },
  // 跳到评论更多
  morecomment:function(){
  var sg_id = this.data.sg_id;
   wx.navigateTo({
     url: '../morecomment/morecomment?sg_id=' + sg_id,
   })
  },
  // 去拼团
  collage: function (e){
    var groupid = e.currentTarget.dataset.grouid;
    var usersid = e.currentTarget.dataset.usersid;
    var user_id = app.globalData.user_id;
    if (usersid == user_id){
      wx.showModal({
        title: '提示',
        content: '你不能参加自己的团',
      })
      return false;
    }else{
      this.setData({
        paytype: 1,
        paystate: 1,
        groupid: groupid
      })
    }
    
    
  },
  // 隐藏拼团
  hidegroup:function(){
    var state = this.data.state;
    state = 0;
    this.setData({
      state: state,
      groupid:0
    })
  },
  //轮播图滑动
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  },
  cancelbo:function(){
    var groupstatus = this.data.groupstatus;
    var self=this;
    if (groupstatus==1){
      wx.showModal({
        title: '提示',
        content: '你正在拼团，是否取消',
        success:function(sm){
          if(sm.confirm){
            self.setData({
              groupstatus:0,
              paystate: 0,
              groupid: 0
            })
          }else{
            self.setData({
              // groupstatus: 0,
              // paystate: 0,
              // groupid: 0
            })
          }
        }
      })
    }else{
      self.setData({
        paystate: 0,
        groupid: 0
      })
    }
    
  },
  payforbo: function (e) {
    var paytype = e.currentTarget.dataset.type;
    this.setData({
      paytype: paytype,
      paystate: 1 
    })
  },
  // 商品下单
  surebuy:function(){
    var self=this;
    var user_id = self.data.user_id;
    
    if (user_id){
      var goodsnum = self.data.goodsnum;
      var sg_stock = self.data.sg_stock;
      var sg_id = self.data.sg_id;
      var types = self.data.paytype;
      var groupid = self.data.groupid;
      var data={
        goodsnum: goodsnum,
        sg_id: sg_id,
        types: types,
        pay_stages:'',
        sp_id:'',
        groupid: groupid
      }
      
      if (goodsnum > sg_stock){
        wx.showModal({
          title: '提示',
          content: '库存不足',
        })
        return;
      }else{
        self.setData({
          paystate:0
        })
        wx.navigateTo({
          url: "../goodsorder/goodsorder?data=" + JSON.stringify(data) ,
        })
      }
      
    }else{
      wx.showModal({
        title: '提示',
        content: '请先登录',
      })
    }
   
  },
  // 商品数量的增减
  addgoodsnum:function(){
    var goodsnum = this.data.goodsnum;
    goodsnum+=1;
    this.setData({
      goodsnum: goodsnum
    })
  },
  mingoodsnum: function () {
    var goodsnum = this.data.goodsnum;
    goodsnum -= 1;
    if (goodsnum==0){
      return;

    }
    this.setData({
      goodsnum: goodsnum
    })
  },
  changegoodsnum:function(e){
    var goodsnum = this.data.goodsnum;
    goodsnum = parseInt(e.detail.value)
    if (goodsnum == 0 || goodsnum<0) {
       goodsnum=1
    }
    this.setData({
      goodsnum: goodsnum
    })
  },
  // 回到首页
  returnhomepage: function(){
    wx.switchTab({
      url: '../index'
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
    var self = this;
    var shua = this.data.shua;
    var showflag = this.data.showflag;
    var sg_id = self.data.sg_id;
    // console.log(showflag)
    // console.log(shua)
    if (shua==1){
      self.getgoodsdetail(sg_id)
    }
    if (showflag==1){
      self.getgoodsdetail(sg_id)
    }
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
    var self = this;
    var sg_id = self.data.sg_id;
    self.getgoodsdetail(sg_id)
    wx.stopPullDownRefresh()
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
    var ids=that.data.sg_id;
    var share_pic = 'http://yitude.sxnet.cc/Public/upload/logo/2018/09-20/5ba35a80cc192.png';
    // var share_pic = this.data.share_pic;
    return {
      title: '易涂得（邀请一起玩易涂得）',
      path: '/pages/index/index?scene=' + user_id + ',8,' + ids,
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