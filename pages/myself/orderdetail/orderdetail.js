// pages/myself/orderdetail/orderdetail.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currid:null,
    jiekou: jiekou,
    datas:[],
    endTimelist:[],
    relayflag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    var currtab = options.currtab;
    var orderid = options.orderid;
    var comment = options.comment;
    // console.log(comment)
    this.setData({
      currtab: currtab,
      orderid: orderid,
      comment: comment
    })
    this.getorderdetail()
    this.getuserinfo()
  },
  getorderdetail:function(){
    var self=this;
    var currtab = self.data.currtab;
    var orderid = self.data.orderid;
    var user_id=app.globalData.user_id;
    var Url;
    if (currtab==0){
      Url = jiekou +'/WXAPI/Order/GroupOrderDetail';
     
    }else{
      Url = jiekou + '/WXAPI/Order/OrderDeail';
    }
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: Url,
      data: { user_id: user_id, order_id: orderid },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
        wx.hideLoading();
      // console.log(res)
        if(res.data.code==0){
         
          if (currtab==0){

            if (res.data.data.orderinfo.stastes == 3) {
              wx.showModal({
                title: '提示',
                content: '很遗憾拼团失败',
              })
              var datas = self.data.datas;
              self.setData({
                datas: res.data.data.orderinfo,
                userlist: res.data.data.userlist,
              
              })
             
              // self.clearTimeout(countDown)
         

            }else{
              var TimeList = res.data.data.orderinfo.end_time;

              var endTimelist = self.data.endTimelist;

              endTimelist.push(TimeList);
            
              self.setData({
                datas: res.data.data.orderinfo,
                userlist: res.data.data.userlist,
                endTimelist: endTimelist
              })
              self.countDown()
            }
           
          }else{
            self.setData({
              datas: res.data.data.orderinfo,
            })
          }
          
        }
      }
    })
  },
  gocomment:function(e){
    var order_id = e.currentTarget.dataset.orderid;
    // console.log(order_id)
    wx.navigateTo({
      url: '../ordercomment/ordercomment?order_id=' + order_id,
    })
  },
  timeFormat: function (param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown: function () {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    var self = this;
    var newTime = new Date().getTime();
    var endTimeList = this.data.endTimelist;
    // console.log(endTimeList)
    var countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(function (o) {
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
      } else {//活动已结束，全部设置为'00'
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
    self.setData({ countDownList: countDownArr })
    setTimeout(self.countDown, 1000);
  },
  // 取消订单
  cancelorder: function (e) {
    var self = this;
    var orderid = e.currentTarget.dataset.orderid;
    var user_id = app.globalData.user_id;
    var currtab = self.data.currtab;
    wx.showModal({
      title: '提示',
      content: '确定要取消吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: jiekou + '/WXAPI/User/cancelOrder',
            data: { user_id: user_id, order_id: orderid },
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {

              if (res.data.code == 0) {
               wx.showToast({
                 title: '取消成功',
               })
               setTimeout(function(){
                 var pages = getCurrentPages();
                 var prevPage = pages[pages.length - 2]  //上一个页面
                 
                 prevPage.setData({
                   show: 1,

                 })
                 wx.navigateBack();
                 
               },600)
                
              } else {

              }
            }
          })
        }
      }
    })

  },
  // 确认收货
  surereceive: function (e) {
    var order_id = e.currentTarget.dataset.orderid;
    var user_id = app.globalData.user_id;
    wx.request({
      url: '/WXAPI/Order/orderConfirm',
      data: { user_id: user_id, order_id: order_id },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })
  },
  // 待付款去支付
  payfor: function (e) {
    var self = this;
    var total_amount = e.currentTarget.dataset.price;
    var order_id = e.currentTarget.dataset.orderid;
    self.setData({
      paystate: 1,
      total_amount: total_amount,
      order_id: order_id
    })
    var user_money = self.data.user_money;
    var total_amount = self.data.total_amount;
    total_amount = parseInt(total_amount);
    user_money = parseInt(user_money)
    if (total_amount > user_money) {
      self.setData({
        moneystate: 0
      })
    } else {
      self.setData({
        moneystate: 1
      })
    }
  },
  getuserinfo: function () {
    var user_id = app.globalData.user_id;
    var self = this;
    wx.request({
      url: jiekou + '/WXAPI/Personal/MyMoney',
      data: { user_id: user_id },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var user_money = res.data.data.users.user_money;

        self.setData({
          user_money: user_money
        })
      }
    })
  },
  cancelpay: function () {
    this.setData({
      paystate: 0,
      total_amount: '',
      order_id: ''
    })
  },
  // 余额支付商品（单品、拼团）
  moneyPay: function () {
    var self = this;
    var order_id = self.data.order_id;
    var total_amount = self.data.total_amount;
    var moneystate = self.data.moneystate;
    var psdstatus = app.globalData.psdtatus;
    if (psdstatus == 0) {
      wx.showModal({
        title: '提示',
        content: '你还未设置支付密码.请前往设置',
        success: function (sm) {
          if (sm.confirm) {
            wx.navigateTo({
              url: '../setting/setpsd/setpsd'
            })
          } else {

          }
        }
      })
    } else {
      if (order_id) {
       
        wx.redirectTo({
          url: '../../index/password/index?order_id=' + order_id + '&total_amount=' + total_amount +'&returnflag=1',
        })

      }
    }
    

  },
  //调微信接口
  getWxPay: function () {
    var that = this;
    var order_id = that.data.order_id;
    var urls = jiekou + '/WXAPI/Payment/getWXPayData';
    var user_id = app.globalData.user_id;
    wx.request({
      url: urls,
      data: {
        user_id: user_id,
        order_id: order_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        var data = res.data.result.wdata;
        wx.requestPayment({
          'timeStamp': String(data.timeStamp),
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.sign,
          'success': function (res) {

            //清除订单id
            that.setData({
              order_id: '',
            })

            wx.showModal({
              title: '提示',
              content: '支付成功,请前往订单查看',
              success: function (res) {
                // wx.switchTab({
                //   url: '../../index/index'
                // })
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2]  //上一个页面
                prevPage.setData({
                  showflag: 1,
                })
                wx.navigateBack()
              }
            })
            app.globalData.infoflags = 1;
          },
          'fail': function (res) {
            wx.showModal({
              title: '提示',
              content: '支付已取消，可前往订单可查看',

            })
            // wx.redirectTo({
            //   url: "../myorder/myorder?currtab=1"
            // })
          },
          'complete': function (res) { }
        })
      }
    });
  },
  // 提醒发货
  remindgoods: function (e) {
    var order_id = e.currentTarget.dataset.orderid;
    var user_id = app.globalData.user_id;
    wx.request({
      url: jiekou + '/WXAPI/Order/RemindShip',
      data: { user_id: user_id, order_id: order_id },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
      
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
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
    var user_id = app.globalData.user_id;
    if (e.from == "button") {
      var ids = e.target.dataset.id;
     
      if (ids) {
        return {
          title: '易涂得（邀请好友拼团）',
          path: '/pages/index/index?scene=' + user_id + ',10,' + ids,
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