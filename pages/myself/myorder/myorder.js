// pages/myself/myorder/myorder.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head_state:'',
    currtab:0,
    jiekou: jiekou,
    num:1,
    limit:5,
    datas:[],
    falg:true,
    paystate:0,
    total_amount:'',
    order_id:'',
    moneystate:'',
    orderflag:0,
    show:'',
    showflag:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currtab = options.currtab;
    var head_state = this.data.head_state;
    var BarTitle;
    if (currtab == 0) {
      BarTitle = '待成团';
    } else if (currtab == 1) {
      BarTitle = '待付款';
      head_state = '待付款'
    } else if (currtab == 2) {
      BarTitle = '待发货'
      head_state = '待发货'
    } else if (currtab == 3){
      BarTitle = '送货中'
      head_state = '送货中'
    }else{
      BarTitle = '待评价'
      head_state = '待评价'
    }
    wx.setNavigationBarTitle({
      title: BarTitle
    })
    this.setData({
      head_state: head_state,
      currtab: currtab
    })
    this.getcaroy(currtab);
    this.getuserinfo()
  },
  // 待付款去支付
  payfor: function (e){
    var self=this;
    var total_amount = e.currentTarget.dataset.price;
    var order_id = e.currentTarget.dataset.orderid;
    self.setData({
       paystate:1,
       total_amount: total_amount,
       order_id: order_id
     })
    var user_money = self.data.user_money;
    var total_amount = self.data.total_amount;
    total_amount = parseInt(total_amount);
    user_money = parseInt(user_money)
    if (total_amount > user_money){
      self.setData({
        moneystate:0
      })
    }else{
      self.setData({
        moneystate: 1
      })
    }
  },
  // 查看物流
  checklogistics: function (e){
    var order_id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../logistics/logistics?order_id=' + order_id,
    })
  },
  getuserinfo: function (){
    var user_id = app.globalData.user_id;
    var self=this;
    wx.request({
      url: jiekou+'/WXAPI/Personal/MyMoney',
      data: { user_id: user_id},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
        var user_money = res.data.data.users.user_money;
      
        self.setData({
          user_money: user_money
        })
      }
    })
  },
  cancelpay: function () {
    this.setData({
      paystate:0,
      total_amount:'',
      order_id:''
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
        self.setData({
          paystate: 0
        })
        wx.navigateTo({
          url: '../../index/password/index?order_id=' + order_id + '&total_amount=' + total_amount+'&returnflag=1',
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
              content: '支付成功',
              success: function (res) {
                // wx.switchTab({
                //   url: '../../index/index'
                // })
                that.setData({
                  paystate: 0,
                  datas: [],
                  num: 1
                })
                that.getcaroy(curtab)

              }
            })
            app.globalData.infoflags = 1;
          },
          'fail': function (res) {
            wx.showModal({
              title: '提示',
              content: '支付已取消',

            })

          },
          'complete': function (res) { }
        })
      }
    });
  },
  // 获取订单列表
  getcaroy: function (currtab){
    var self=this;
    var currtab = currtab;
   
    var orderStatus=null;
    var user_id = app.globalData.user_id;
    var limit = self.data.limit;
    var num=self.data.num;
    var Url = jiekou + '/WXAPI/Order/OrderList';
   
    switch (currtab){
     case '1':
        orderStatus=0;
      
        break;
     case '2':
        orderStatus = 1;
        break;

     case '3':
      orderStatus = 2;
      break;

     case '4':
      orderStatus = 3;
      break;

     default:
      Url = jiekou + '/WXAPI/Order/GroupOrderList';
      break;
    }
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: Url,
      data: { user_id: user_id, orderStatus: orderStatus, num: num, limit: limit},
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
       wx.hideLoading()
        var datas=self.data.datas;
        var orderlist = res.data.data.orderlist;
        // console.log(orderlist)
        if (orderlist.length!=0){
          for (var i = 0; i < orderlist.length;i++){
            datas.push(orderlist[i])
          }
          self.setData({
            datas: datas,
            page:res.data.data.page
          })
        }else{
          self.setData({
            orderflag: 1,
           
          })
        }
      
      }
    })
  },
  // 取消订单
  cancelorder: function (e){
    var self = this;
    var orderid = e.currentTarget.dataset.orderid;
    var user_id = app.globalData.user_id;
    var currtab = self.data.currtab;
    wx.showModal({
      title: '提示',
      content: '确定要取消吗？',
      success: function (sm){
        if(sm.confirm){
          wx.request({
            url: jiekou + '/WXAPI/User/cancelOrder',
            data: { user_id: user_id, order_id: orderid },
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
            
              if(res.data.code==0){
                wx.showToast({
                  title: res.data.msg,
                })
                self.setData({
                  datas: [],
                  num:1
                })
               
                self.getcaroy(currtab);
              }else{

              }
            }
          })
        }
      }
    })
    
  },
  // 跳到订单详情
  orderdetail:function(e){
    var self=this;
    var orderid = e.currentTarget.dataset.orderid;
    var comment = e.currentTarget.dataset.comment;
    var currtab = self.data.currtab;
    // var currentid = e.currentTarget.dataset.current
    wx.navigateTo({
      url: '../orderdetail/orderdetail?orderid=' + orderid + '&currtab=' + currtab + '&comment=' + comment,
    })
  },
  // 提醒发货
  remindgoods:function(e){
    var order_id = e.currentTarget.dataset.orderid;
    var user_id=app.globalData.user_id;
    wx.request({
      url: jiekou+'/WXAPI/Order/RemindShip',
      data: { user_id: user_id, order_id: order_id},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
  //  console.log(res)
        if (res.data.status==0){
          wx.showModal({
            title: '提示',
            content: '已提醒发货,卖家将尽快处理您的货件',
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
  // 确认收货
  surereceive: function (e) {
    var order_id = e.currentTarget.dataset.orderid;
    var user_id=app.globalData.user_id;
    wx.request({
      url: jiekou+'/WXAPI/Order/orderConfirm',
      data: { user_id: user_id, order_id: order_id },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
         if(res.data.code==0){
           wx.showToast({
             title: res.data.msg,
           })
           self.setData({
             datas: [],
             num: 1
           })

           self.getcaroy(currtab);
         }else{
           wx.showModal({
             title: '提示',
             content: res.data.msg,
           })
         }
      }
    })
  },
  // 跳到商品评价
  gocomment: function (e) {
    var order_id = e.currentTarget.dataset.orderid;
    var comment = e.currentTarget.dataset.comment;
    wx.navigateTo({
      url: '../ordercomment/ordercomment?order_id=' + order_id + '&comment=' + comment,
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
    var self=this;
    var show = self.data.show;
    var currtab = self.data.currtab;
    var showflag = self.data.showflag;
   
    if(show==1){
      self.setData({
        datas: [],
        num:1
      })
      self.getcaroy(currtab)
    }
    if (showflag==1){
      self.setData({
        datas: [],
        num: 1
      })
      self.getcaroy(currtab)
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var num = that.data.num;
    var page = that.data.page;
    var falg = that.data.falg;
    var currtab = that.data.currtab;
  
    if (falg) {
      if (page.cu_page == page.total_page) {
        // wx.showModal({
        //   title: '提示',
        //   content: '已经到底啦',
        // })
       
      } else {
        wx.showLoading({
          title: '正在加载',
        })
        setTimeout(function () {
          wx.hideLoading()
          that.setData({ num: num + 1 });
          that.getcaroy(currtab);

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