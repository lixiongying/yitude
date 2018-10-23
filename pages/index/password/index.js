//index.js
//获取应用实例
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({
  data: {
    // 输入框参数设置
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "98rpx",//输入框高度
      width: "604rpx",//输入框宽度
      see: false,//是否明文展示
      interval: true,//是否显示间隔格子,
      val_arr:[],
      order_id:''
    },
    jiekou: jiekou
  },

  // 当组件输入数字6位数时的自定义函数
  valueSix(input_value) {
    var that=this;
    var input_value = input_value;
    var input_value = JSON.stringify(input_value.detail);
    var reg = /\"|’|‘/g;
    input_value = input_value.replace(reg, "");
    // input_value = parseInt(input_value)
    var order_id = that.data.order_id;
    var order_package_id = that.data.order_package_id;
    var user_id = app.globalData.user_id;
    var returnflag = that.data.returnflag;
    
    var urL;
    var pay_stages = that.data.pay_stages;
    var datas = {};
    var userid = that.data.userid;
    if (pay_stages==0){
      pay_stages=3
    } else if (pay_stages==3){
      pay_stages = 0
    }
   
    if (order_id){
      datas.user_id = user_id;
      datas.order_id = order_id;
      datas.passwprd = input_value;
      urL= jiekou + '/WXAPI/Goods/moneyPay';
    }
    if (order_package_id){
      datas.user_id = user_id;
      datas.pay_staste = pay_stages;
      datas.userid = userid;
      datas.passwprd = input_value;
      datas.order_package_id = order_package_id;
      urL = jiekou + '/WXAPI/Orderpackage/moneyPay';
    }
//  console.log(datas)
    // return;
    wx.request({
      url: urL,
      data:datas,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res)
        if (res.data.code == 0) {
          
          // 模态交互效果
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            success:function(){
              if (order_id){
                setTimeout(function () {
                  if (returnflag==1){
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2]  //上一个页面
                    prevPage.setData({
                      showflag: 1,
                    })
                  }
                  wx.navigateBack();
                }, 1000)
                app.globalData.infoflags=1
              }else{
                setTimeout(function(){
                  if (returnflag == 1) {
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2]  //上一个页面
                    prevPage.setData({
                      showflag: 1,
                    })
                  }
              
                  wx.navigateBack()
                },600)
                app.globalData.infoflags=1
              }
              
            }
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
          var datas = res.data.data;
          self.setData({
            datas: datas
          })
        }

      }
    })
  },

  onLoad: function (options) {
    var order_id=options.order_id;
    var order_package_id = options.order_package_id;
    var pay_stages = options.pay_stages;
    var total_amount = options.total_amount;
    var userid = options.userid;
    var returnflag = options.returnflag;
    // console.log(order_package_id);
    // console.log(pay_stages)
    if (order_id){
      this.setData({
        order_id: order_id,
         total_amount: total_amount,
        returnflag: returnflag
      })
    }
    if (order_package_id){
      this.setData({
        userid: userid,
        order_package_id: order_package_id,
        pay_stages: pay_stages,
        total_amount: total_amount,
        returnflag: returnflag
      })
    }
    this.getmyself()
  },
  forgetpsd: function (){
    wx.navigateTo({
      url: '../../myself/setting/findpsd/findpsd'
    })
  },

})
