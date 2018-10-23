// pages/index/goodsorder/goodsorder.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    paystate: 0,
    goodsnum: '',
    // 施工的一些数据
    workflag:0,
    group:[],
    // 商品id
    sg_id: '',
    // 一次付清还是定金
    pay_stages: '',
    // 套餐id
    sp_id: '',
    user_id: '',
    datas: [],
    // 是否使用金币状态
    usecoinstate: 0,
    types: '',
    // 包邮
    freemoney: 0,
    // 金币转换后的钱
    coinmoney: 0,
    defaultaddress: [],
    shua: 0,
    shauxin: 0,
    selectaddresslist: [],
    // 是否有可使用的优惠券
    couponstatus:'',
    // 选择金币的数量
    coinvalue: 0,
    // 优惠券id
    coupon_id: '',
    // 是否余额不足的状态0：不足
    moneystate: 0,
    // passwprd: passwprd
    allinputF1: 1,
    allinputF1: true,
    inputArr: [],
    inputStr: '',
    focusF: [],
    allinput: '',
    order_package_id:'',
    order_id:'',
    userid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var data = JSON.parse(options.data);
    var goodsnum = data.goodsnum;
    var types = data.types;
    var groupid = data.groupid;
    var sg_id = data.sg_id;
    var sp_id = data.sp_id;
    var pay_stages = data.pay_stages;
    var user_id = app.globalData.user_id;
    this.setData({
      goodsnum: goodsnum,
      sg_id: sg_id,
      user_id: user_id,
      types: types,
      pay_stages: pay_stages,
      sp_id: sp_id,
      groupid: groupid
    })
    this.getorderinfo();
    this.getadddress();
    this.getmyself()
  },
  // 个人中心获得数据
  getmyself: function () {
    var self = this;
    var user_id = app.globalData.user_id;
    wx.request({
      url: jiekou + '/WXAPI/Personal/personalInfo',
      data: { user_id: user_id },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          // var datas = res.data.data;
          var psdtatus = res.data.data.userinfo.paypassword;
          self.setData({
            psdtatus: psdtatus
          })
        }
      }
    })
  },
  // 跳转到施工团队
  workgroup: function (){
    var sp_id = this.data.sp_id;
    wx.navigateTo({
      url: '../workgroup/workgroup?sp_id=' + sp_id,
    })
  },

  // 获取下单信息
  getorderinfo: function() {
    var self = this;
    var goodsnum = self.data.goodsnum;
    var sg_id = self.data.sg_id;
    var sp_id = self.data.sp_id;
    var user_id = app.globalData.user_id;
    var types = self.data.types;
    var pay_stages = self.data.pay_stages;
    var datas = self.data.datas;
    
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou + '/WXAPI/Goods/orderinfo',
      data: {
        user_id: user_id,
        sg_id: sg_id,
        goods_num: goodsnum,
        types: types,
        sp_id: sp_id,
        pay_stages: pay_stages
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        // console.log(res)
       wx.hideLoading()
        if (res.data.code == 0) {
          datas = res.data;
          var couponstatus = res.data.couponstatus;
          self.setData({
            datas: datas,
            couponstatus: couponstatus
          })
          self.totalmoney()
        }

      },
      fail:function(res){
         wx.showModal({
           title: '提示',
           content: '网络错误',
         })
      }
    })
  },

  // 提交订单
  submitorder: function() {
    var self = this;
    var types = self.data.types;
    var user_id = app.globalData.user_id;
    var sg_id = self.data.sg_id;
    var goods_num = self.data.goodsnum;
    var coupon_id = self.data.coupon_id;
    var address_id = self.data.address_id;
    var gold = self.data.coinvalue;
    var totalmoney = self.data.totalmoney;
    var datas = self.data.datas;
    var groupid = self.data.groupid;
    var sp_id = self.data.sp_id;
    var pay_stages = self.data.pay_stages;
    var userid=self.data.userid;
  
    var Url;
    var data = {};
    if (types == 0) {
      Url = jiekou + '/WXAPI/Goods/PlaceAnOrder';
      data = {
        user_id: user_id,
        sg_id: sg_id,
        goods_num: goods_num,
        coupon_id: coupon_id,
        address_id: address_id,
        gold: gold
      };
    } else if (types == 1) {
      Url = jiekou + '/WXAPI/Goods/GrounpPlaceAnOrder';
   
      data = {
        user_id: user_id,
        sg_id: sg_id,
        goods_num: goods_num,
        groupid: groupid,
        address_id: address_id,
        gold: gold
      };
    } else {
      Url = jiekou + '/WXAPI/Goods/PackagePlaceAnOrder';
      data = {
        user_id: user_id,
        sp_id: sp_id,
        pay_stages: pay_stages,
        coupon_id: coupon_id,
        address_id: address_id,
        gold: gold,
        userid: userid
      };
    }
    if (parseInt(datas.user.user_money) <= parseInt(totalmoney)) {
      self.setData({
        moneystate: 0
      })
    } else {
      self.setData({
        moneystate: 1
      })
    }
    wx.showModal({
      title: '提示',
      content: '确定要提交订单么',
      success:function(sm){
        wx.showLoading({
          title: '正在加载',
        })
        if(sm.confirm){
          wx.request({
            url: Url,
            data: data,
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              wx.hideLoading()
              if (res.data.code == 0) {
                if (res.data.status == 1) {
                  if (types == 2) {
                    var order_package_id = res.data.order_package_id;
                    self.setData({
                      paystate: 0,
                      order_package_id: order_package_id,
                      pay_stages: pay_stages
                    })
                  } else {
                    var order_id = res.data.order_id;
                    self.setData({
                      paystate: 0,
                      order_id: order_id
                    })
                  }
                  wx.showToast({
                    title: '下单成功',
                  })
                  setTimeout(function () {
                    wx.hideToast();
                    wx.navigateBack();
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2] //上一个页面
                    prevPage.setData({
                      shua: 1,
                    })
                  }, 500);
                } else {
                  setTimeout(function () {
                    wx.hideToast();
                    if (types == 2) {
                      self.setData({
                        paystate: 1,
                        order_package_id: res.data.order_package_id,
                        pay_stages: pay_stages
                      })
                    } else {
                      self.setData({
                        paystate: 1,
                        order_id: res.data.order_id
                      })
                    }
                  }, 500);
                }
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                })
              }
            }
          })
        }else{

        }
      }
    })
    
   
  },
  //调微信支付接口
  getWxPay: function () {
    var that = this;
    var order_id = that.data.order_id;
    var user_id = app.globalData.user_id;
    var order_package_id = that.data.order_package_id;
    var pay_stages = that.data.pay_stages;
    var urls;
    var datas={};
    if (order_id){
      datas.user_id = user_id;
      datas.order_id = order_id;
      urls =jiekou + '/WXAPI/Payment/getWXPayData';
    }else{
      datas.user_id = user_id;
      datas.pay_staste = pay_stages;
      datas.order_package_id = order_package_id;
      datas.userid = userid;
      urls = jiekou + '/WXAPI/Packpayment/getWXPayData';
    }
    wx.request({
      url: urls,
      data:datas,
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
            console.log(res)
            //清除订单id
            that.setData({
              order_id: '',
              order_package_id:''
            })
            wx.showModal({
              title: '提示',
              content: '支付成功',
              success: function (res) {
                // wx.switchTab({
                //   url: '../index'
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
              content: '支付已取消',
              
            })
           
          },
          'complete': function (res) { }
        })
      }
    });
  },
  // 余额支付商品（单品、拼团、套餐）
  moneyPay: function() {
    var self = this;
    var order_id = self.data.order_id;
    var order_package_id = self.data.order_package_id;
    var moneystate = self.data.moneystate;
    var pay_stages = self.data.pay_stages;
    var totalmoney = self.data.totalmoney;
    var psdstatus = self.data.psdtatus;
    var userid = self.data.userid;
    if (pay_stages == 1) {
      pay_stages = 3
    }
    // console.log(psdstatus)
    if (psdstatus==0){
      
      wx.showModal({
        title: '提示',
        content: '你还未设置支付密码.请前往设置',
        success:function(sm){
          if(sm.confirm){
            wx.navigateTo({
              url: '../../myself/setting/setpsd/setpsd'
            })
            
          }else{

          }
        }
      })
      
    }else{
      if (order_id) {
        // console.log(order_id)
        wx.redirectTo({
          url: '../password/index?order_id=' + order_id + '&total_amount=' + totalmoney +'&returnflag=1',
        })
      }
      if (order_package_id) {
        wx.redirectTo({
          url: '../password/index?order_package_id=' + order_package_id + '&pay_stages=' + pay_stages + '&total_amount=' + totalmoney + '&userid=' + userid + '&returnflag=1',
        })
      }
    }
    
  },

  cancelpay: function() {
    this.setData({
      paystate: 0
    })
  },
  //使用优惠券
  usecoupon: function() {
    var self = this;
    var types = self.data.types;
  
    var sg_id = self.data.sg_id;
    var sp_id = self.data.sp_id;
    var goodsnum = self.data.goodsnum;
    var pay_stages = self.data.pay_stages;
    // app.globalData.refreshFlag = false;
    var datas = {
      types: types,
      sg_id: sg_id,
      sp_id: sp_id,
      goodsnum: goodsnum,
      pay_stages: pay_stages
    }
    wx.navigateTo({
      url: '../usecoupon/index?datas=' + JSON.stringify(datas)
    })
  },
  // 添加地址
  addRess: function() {
    wx.navigateTo({
      url: '../../myself/setting/addaddress/addaddress',
    })
  },
  // 使用金币
  usecoin: function() {
    var self = this;
    var usecoinstate = self.data.usecoinstate;
    if (usecoinstate == 0) {
      usecoinstate = 1
    } else {
      usecoinstate = 0
    }
    self.setData({
      usecoinstate: usecoinstate
    })
  },
  paycoins: function(e) {
    var self = this;
    var datas = self.data.datas;
    //  要使用的金币数量
    var coinvalue = e.detail.value;

    //  持有的金币数量
    var coinsnum = datas.user.gold;
    // 金币转换后的钱 
    var coinmoney;
    //  商品合计后的总价

    var datas = self.data.datas;
    var totalmoney = self.data.totalmoney;
    //  邮费
    var shippingfree = datas.shippingfree;
    // 小计
    var xiaojifree = datas.xiaojifree;
    // 优惠券
    var freemoney = self.data.freemoney;
    var extramoney = xiaojifree - parseInt(shippingfree) - parseInt(freemoney);
    // 如果金币数量小于输入的金币数量
    if (coinsnum <= coinvalue && coinsnum / 100 < extramoney) {
      coinvalue = coinsnum;
      coinmoney = coinvalue / 100;
      coinmoney = coinmoney.toFixed(2);
      self.setData({
        coinmoney: coinmoney,
        coinvalue: coinvalue
      })
      self.totalmoney()
    } else {
      if (coinvalue >= extramoney * 100) {
        coinvalue = extramoney * 100;
        coinmoney = coinvalue / 100;
        coinmoney = coinmoney.toFixed(2);
        self.setData({
          extramoney: extramoney,
          coinvalue: coinvalue,
          coinmoney: coinmoney
        })
        self.totalmoney()
      } else {
        coinvalue = coinvalue;
        coinmoney = coinvalue / 100;
        coinmoney = coinmoney.toFixed(2);
        self.setData({
          extramoney: extramoney,
          coinvalue: coinvalue,
          coinmoney: coinmoney
        })
        self.totalmoney()
      }
    }

  },
  // 计算总价
  totalmoney: function() {

    var self = this;
    var datas = self.data.datas;
    var totalmoney = self.data.totalmoney;
    // 使用金币
    var coinmoney = self.data.coinmoney;
    //  邮费
    var shippingfree = datas.shippingfree;
    // 小计
    var xiaojifree = datas.xiaojifree;
    // 优惠券
    var freemoney = self.data.freemoney;

    totalmoney = xiaojifree - parseFloat(coinmoney) - parseInt(shippingfree) - parseInt(freemoney);

    totalmoney = totalmoney.toFixed(2)

    self.setData({
      totalmoney: totalmoney
    })
  },
  // 获取收货地址
  getadddress: function() {
    var self = this;
    var user_id = this.data.user_id;

    wx.request({
      url: jiekou + '/WXAPI/Personal/addressList',
      data: {
        user_id: user_id,
        cu_page: 1,
        page_size: 10
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        if (res.data.code == 0) {
          var addresslist = res.data.data.addresslist;
  
          if (addresslist) {

            var defaultaddress = []
            for (var i = 0; i < addresslist.length; i++) {
              if (addresslist[i].is_default == 1) {
                var index = i
                defaultaddress.push(addresslist[index]);
              }
            }
            self.setData({
              defaultaddress: defaultaddress,
              addresslist: addresslist,
              address_id: defaultaddress[0].address_id
            })
          } else {
            self.setData({

              addresslist: ''
            })
          }

          // console.log(datas)
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })
  },
  // 选择收获地址
  selectaddress: function() {
    wx.navigateTo({
      url: '../../myself/setting/goodsaddress/goodsaddress?selectstatus=1',
    })
    app.globalData.adsflag=1
  },

  getselectadddress: function() {
    var self = this;
    var user_id = self.data.user_id;
    var ids = self.data.address_id;
    wx.request({
      url: jiekou + '/WXAPI/Personal/getAddress',
      data: {
        user_id: user_id,
        address_id: ids
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {

        var defaultaddress = self.data.defaultaddress;
        var selectaddresslist = self.data.selectaddresslist;
        defaultaddress = '';
        selectaddresslist = res.data.data;
        self.setData({
          defaultaddress: defaultaddress,
          selectaddresslist: selectaddresslist
        })

      }
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
    var self = this;
    var refreshFlag = app.globalData.refreshFlag;
    var shua = this.data.shua;
    var shauxin = this.data.shauxin;
    var workflag=self.data.workflag;
    if (refreshFlag) {
      self.totalmoney()
    }
    if (shauxin == 1) {
      self.getselectadddress();

    }
    if (shua == 1) {
      self.getadddress();

    }
   

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
  onShareAppMessage: function() {

  }
})