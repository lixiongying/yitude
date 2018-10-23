// pages/myself/mypackage/mypackageorder/mypackageorder.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    group: [],
    workflag:0,
    construc_order:[],
    userid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var packageid = options.packageid;
    var construcstatus = options.construcstatus;
    var curtab = options.curtab;
    
    this.setData({
      packageid: packageid,
      curtab: curtab,
      construcstatus: construcstatus
    })
    this.getpackagedetail(packageid)
    this.getuserinfo();
  },
  // 评价施工员
  packagecomment: function (e) {
    var packageid = e.currentTarget.dataset.packageid;
    wx.navigateTo({
      url: '../../packagecomment/packagecomment?packageid=' + packageid,
    })
  },
   //点击拨打电话
  playPhone: function(e){
    var phone = e.currentTarget.dataset.phone;;
    if(phone){
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }else {
      wx:wx.showModal({
        title: '提示',
        content: '暂无联系方式',
        showCancel: true,
      })
    }
  },
  // 获取用户的钱
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
  // 评价施工员
  packagecomment: function () {
    wx.navigateTo({
      url: '../../packagecomment/packagecomment',
    })
  },
  getpackagedetail: function (packageid) {
    var self=this;
    var packageid = packageid;
    var user_id = app.globalData.user_id;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou +'/WXAPI/Orderpackage/orderPackageDetail',
      data: { user_id: 1, order_package_id: packageid},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
        wx.hideLoading()
        if(res.data.code==0){
          // console.log(res)
          var orderPackDetail = res.data.data.orderPackDetail;
          var order_packpay = res.data.data.order_packpay;
          var constatus = res.data.data.constatus;
          var construc_order = self.data.construc_order;
          var construc_orders = res.data.data.construc_order;
          // console.log(construc_orders)
          self.setData({
            orderPackDetail: orderPackDetail,
            order_packpay: order_packpay,
            constatus: constatus,
            construc_order: construc_orders
          })
        }
      }
    })
  },
  // 开始动工和已完工(一次付清的前提下)
  startwork: function (e) {
    var packageid = e.currentTarget.dataset.packageid;
    var pay_staste = e.currentTarget.dataset.pay_staste;

    var user_id = app.globalData.user_id;
    wx.request({
      url: jiekouo + '/WXAPI/Orderpackage/clickstatus',
      data: { order_package_id: packageid, pay_staste: pay_staste, user_id: user_id },
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
  // 遮罩点击隐藏
  cancelpay: function () {
    this.setData({
      paystate: 0,
      total_amount: '',
      order_id: ''
    })
  },
  // 跳转到施工团队列表
  selectworkgroup: function (e){
    var self=this;
    var sp_id = e.currentTarget.dataset.sp_id;
    wx.navigateTo({
      url: '../../../index/workgroup/workgroup?sp_id=' + sp_id,
    })
    // self.setData({
    //   workflag:0,
    //   construc_order:[]
    // })
  },

  // 一次付清 交定金 开始动工 已完工付的钱
  payInfull: function (e) {
    var self = this;
    var total_amount = e.currentTarget.dataset.price;
    var paytype = e.currentTarget.dataset.paytype;
 
    var packageid = e.currentTarget.dataset.packageid;
    self.setData({
      paystate: 1,
      total_amount: total_amount,
      packageid: packageid,
      paytype: paytype
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
  //调微信支付接口
  getWxPay: function () {
    var that = this;
    var paytype = that.data.paytype;
    var userid = that.data.userid;
   
    if (paytype == 0) {
      paytype = 3
    } else if (paytype == 3) {
      paytype = 0
    }
    var user_id = app.globalData.user_id;
    var order_package_id = that.data.packageid;
   
    var urls;
    var datas = {};
    if (order_package_id) {
      datas.user_id = user_id;
      datas.pay_staste = paytype;
      datas.userid = userid;
      datas.order_package_id = order_package_id;
      urls = jiekou + '/WXAPI/Packpayment/getWXPayData';
    }
   
    wx.request({
      url: urls,
      data: datas,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
       
       
        if(res.data.code==0){
          var data = res.data.result.wdata;
          wx.requestPayment({
            'timeStamp': String(data.timeStamp),
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.sign,
            'success': function (res) {
              console.log(res)
              //清除订单id
              that.setData({
                order_id: '',
                order_package_id: ''
              })

              wx.showModal({
                title: '提示',
                content: '支付成功',
                success: function (res) {
                  // wx.switchTab({
                  //   url: '../../../index/index'
                  // })
                  // wx.navigateBack()
                  var pages = getCurrentPages();
                  var prevPage = pages[pages.length - 2]  //上一个页面
                  prevPage.setData({
                    showflag: 1,
                  })
                  wx.navigateBack()
                }
              })
            },
            'fail': function (res) {
              wx.showModal({
                title: '提示',
                content: '支付已取消',

              })
            },
            'complete': function (res) { }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
     
      }
    });
  },
  // 余额支付商品（单品、拼团）
  moneyPay: function () {
    var self = this;
    var packageid = self.data.packageid;
    var paytype = self.data.paytype;
    var moneystate = self.data.moneystate;
    var total_amount = self.data.total_amount;
    var constatus = self.data.constatus;
    var psdstatus = app.globalData.psdtatus;
    var userid = self.data.userid;
    if (constatus!=1){
      wx.showModal({
        title: '提示',
        content: '请选择施工团队',
      })
      return;
    }
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
      if (packageid) {
        // console.log(order_id)
        wx.redirectTo({
          url: '../../../index/password/index?order_package_id=' + packageid + '&pay_stages=' + paytype + '&total_amount=' + total_amount + '&userid=' + userid +'&returnflag=1',
        })
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
    var self=this;   
    var workflag = self.data.workflag;
    if(workflag==1){
      var construc_order = self.data.construc_order;
      var group = self.data.group;
      construc_order = group;

      self.setData({
        construc_order: construc_order,
        constatus:1
      })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})