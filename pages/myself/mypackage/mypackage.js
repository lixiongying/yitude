// pages/myself/mypackage/mypackage.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head_state:'',
    curtab:'',
    jiekou:jiekou,
    num:1,
    limit:10,
    datas:[],
    packageflag:0,
    showflag:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var curtab = options.currtab;
    
    var head_state = this.data.head_state;
    var BarTitle;
    if (curtab==0){
      BarTitle='待付款',
      head_state = '待付款'
    } else if (curtab == 1){
      BarTitle = '待发货';
      head_state = '待发货'
    } else if (curtab == 2) {
      BarTitle = '发货中'
      head_state = '发货中'
    } else if (curtab == 3) {
      BarTitle = '装修中'
      head_state = '装修中'
    }  else{
      BarTitle = '已完成'
      head_state = '已完工'
    }
    wx.setNavigationBarTitle({
      title: BarTitle
    })
    this.setData({
      head_state: head_state, 
      curtab: curtab
    })
    this.getpackagelist(curtab)
    this.getuserinfo()
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
  // 获取套餐列表
  getpackagelist: function (curtab){
    var self=this;
    var curtab = curtab;
    var user_id = app.globalData.user_id;
    var num = self.data.num;
    var limit = self.data.limit;
    wx.showLoading({
      title: '正在加载',
    })
    if (curtab){
      wx.request({
        url:jiekou + '/WXAPI/Orderpackage/OrderPackageList',
        data: { user_id: user_id, num: num, limit: limit, orderStatus:curtab},
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res){
          wx.hideLoading()
          if(res.data.code==0){
            var packagelist = res.data.data.packagelist;
            var datas=self.data.datas;
            if (packagelist.length!=0){
              for (var i = 0; i < packagelist.length;i++){
                datas.push(packagelist[i])
              }
              self.setData({
                datas: datas,
                page: res.data.data.page
              })
            }else{
              self.setData({
                packageflag:1
              })
            }
        
            

          }
        }
      })
    }

  },
  // 跳到订单套餐详情
  mypackageorder:function(e){
    var curtab = this.data.curtab;
   
    var construcstatus = e.currentTarget.dataset.construcstatus;
    var packageid = e.currentTarget.dataset.packageid;
    if (construcstatus){
      wx.navigateTo({
        url: './mypackageorder/mypackageorder?packageid=' + packageid + '&curtab=' + curtab + '&construcstatus=' + construcstatus,
      })
    }else{
      wx.navigateTo({
        url: './mypackageorder/mypackageorder?packageid=' + packageid + '&curtab=' + curtab
      }) 
    }
    
    
  },
  // 开始动工和已完工(一次付清的前提下)
  startwork: function (e) {
    var packageid = e.currentTarget.dataset.packageid;
    var pay_staste = e.currentTarget.dataset.pay_staste; 
    var user_id=app.globalData.user_id;
    wx.request({
      url: jiekou+'/WXAPI/Orderpackage/clickstatus',
      data: { order_package_id: packageid, pay_staste: pay_staste, user_id: user_id},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
        // console.log(res)
        if(res.data.code==0){
          wx.showToast({
            title: res.data.msg,
          })
          self.setData({
            datas: [], 
            num: 1   
          })
          self.getpackagelist()
        }else{
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
  payfor: function (e){
    var curtab = this.data.curtab;
    var packageid = e.currentTarget.dataset.packageid;
    wx.navigateTo({
      url: './mypackageorder/mypackageorder?packageid=' + packageid + '&curtab=' + curtab,
    })
  },
  // 一次付清 交定金 开始动工 已完工付的钱
  payInfull:function(e){
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
    var packageid = that.data.packageid;
    var paytype = that.data.paytype;
    var curtab = that.data.curtab;
    if (paytype==0){
      paytype=3
    }else if(paytype==3){
      paytype=0
    }
    var user_id = app.globalData.user_id;
    var order_package_id = that.data.packageid;
    var urls;
    var datas = {};
    if (order_package_id){
      datas.user_id = user_id;
      datas.pay_staste = paytype;
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
        console.log(res)
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
           
              order_package_id: ''
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
                  datas:[],
                  num:1
                })
                that.getpackagelist(curtab)
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
      self.setData({
        paystate: 0
      })
      if (packageid) {
        wx.navigateTo({
          url: '../../index/password/index?order_package_id=' + packageid + '&pay_stages=' + paytype + '&total_amount=' + total_amount +'&returnflag=1',
        })
      }
    } 

  },
  // 评价施工员
  packagecomment: function (e) {
    var packageid = e.currentTarget.dataset.packageid;
    wx.navigateTo({
      url: '../packagecomment/packagecomment?packageid=' + packageid,
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
    var showflag = self.data.showflag;
    var curtab = self.data.curtab;
    // this.getpackagelist(curtab)
    if (showflag == 1) {
      self.setData({
        datas: [],
        num: 1
      })
      self.getpackagelist(curtab)
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

    var curtab = that.data.curtab;

  
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
          that.getpackagelist(curtab);

        }, 500);
      }
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})