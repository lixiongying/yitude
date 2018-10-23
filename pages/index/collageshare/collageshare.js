// pages/index/collageshare/collageshare.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var ids = options.ids;
    var userid = options.userid;
    var user_id = app.globalData.user_id;

    this.setData({
      ids: ids,
      userid: userid,
      user_id: user_id,
    })

    this.getgoods(ids, user_id)
    this.recommendgoods()
  },

  getgoods: function (ids, user_id) {
    var self = this;
    var ids = ids;
    var user_id = user_id;
   
    wx.request({
      url: jiekou + '/WXAPI/Order/GroupDetail',
      data: {
        groupid: ids,
        user_id: user_id
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          var datas = res.data.data;
          var entimelist = [];
          if (datas.stastes == 1) {
            entimelist.push(datas.groupinfo.end_time)
            self.setData({
              datas: datas,
              entimelist: entimelist
            })
            self.countDown()
          } else {
            self.setData({
              datas: datas,
            })
          }

        }
      },
      fall:function(res){

      }

    })
    
  
},
timeFormat: function(param) { //小于10的格式化函数
  return param < 10 ? '0' + param : param;
},
countDown: function() { //倒计时函数
  // 获取当前时间，同时得到活动结束时间数组
  var self = this;
  var newTime = new Date().getTime();
  var endTimeList = self.data.entimelist;
  // console.log(endTimeList);

  var countDownArr = [];

  // 对结束时间进行处理渲染到页面
  endTimeList.forEach(function(o) {
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
        sec: self.timeFormat(sec)
      }
    } else { //活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
      self.setData({
        collageflag: 1
      })
    }
    countDownArr.push(obj);
  })
  // 渲染，然后每隔一秒执行一次倒计时函数
  self.setData({
    countDownList: countDownArr
  })
  setTimeout(self.countDown, 1000);
},
recommendgoods: function() {
  var self = this;
  var city_id = app.globalData.city_id;
  wx.request({
    url: jiekou + '/WXAPI/Order/RecommendList',
    data: {
      city_id: 28241
    },
    method: 'post',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function(res) {

      if (res.data.code == 0) {
        var recommendlist = res.data.data.recommendlist;
        self.setData({
          recommendlist: recommendlist
        })
      }
    }
  })
},
// 跳转到商品详情
goodsdetail: function(e) {
  var sg_id = e.currentTarget.dataset.sg_id;
  wx.navigateTo({
    url: '../goodsdetail/goodsdetail?sg_id=' + sg_id,
  })
},
returnindex: function() {
  wx.switchTab({
    url: '../index',
  })
},
// 立即参团
gocollage: function(e) {
  var groupid = e.target.dataset.id;
  var sg_id = e.target.dataset.sg_id;
  // console.log(sg_id)
  wx.redirectTo({
    url: '../goodsdetail/goodsdetail?sg_id=' + sg_id + '&groupid=' + groupid,
  })
},
// 拼团失败，自己开团
opencollage: function(e) {

  var sg_id = e.target.dataset.sg_id;
  wx.redirectTo({
    url: '../goodsdetail/goodsdetail?sg_id=' + sg_id,
  })
},
/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function() {

},

/**
 * 生命周期函数--监听页面显示
 */
onShow: function() {

},

/**
 * 生命周期函数--监听页面隐藏
 */
onHide: function() {

},

/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function() {

},

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function() {

},

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function() {

},

/**
 * 用户点击右上角分享
 */
onShareAppMessage: function(e) {
  var user_id = app.globalData.user_id;
  if (e.from == "button") {
    var ids = e.target.dataset.id;
    if (ids) {
      return {
        title: '易涂得（邀请好友拼团）',
        path: '/pages/index/index?scene=' + user_id + ',10,' + ids
      }
    }
  }

}
})