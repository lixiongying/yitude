// pages/myself/myself.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currtab:'0',
    currtabs: '0',
    jiekou:jiekou,
    relayflag:0,
    datas:[],
    // share_pic: 'http://yitude.sxnet.cc/Public/upload/logo/2018/09-20/5ba35a80cc192.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_id = app.globalData.user_id;
    var userInfo = app.globalData.userInfo;
    // console.log(user_id)
    this.setData({
      user_id: user_id,
      userInfo: userInfo
    })
    this.getmyself();
    
  },
  // 个人中心获得数据
  getmyself: function (){
    var self=this;
    var user_id = this.data.user_id;
    var datas=self.data.datas;
    wx.request({
      url: jiekou +'/WXAPI/Personal/personalInfo',
      data: { user_id: user_id},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
      
        if(res.data.code==0){
          // var datas = res.data.data;
          
          var psdtatus=res.data.data.userinfo.paypassword;
          
          app.globalData.psdtatus = psdtatus;
          self.setData({
            datas: res.data.data
          })
        }
        
      }
    })
  },
  // 更新资料
  updateprofile: function (){
    
    wx.getSetting({
      success: res => {
      
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
           
              var userInfo = res.userInfo;
             
              this.uploadinfo(userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  uploadinfo: function (userInfo){
    var userInfos = userInfo;
    
    var self=this;
    var userInfo = self.data.userInfo;
    var user_id = app.globalData.user_id;
    var nickname = userInfos.nickName;
    var sex = userInfos.gender;
    var head_pic = userInfos.avatarUrl;
    wx.showLoading({
      title: '正在更新',
    })
    wx.request({
      url: jiekou+'/WXAPI/User/get_user',
      data: { user_id: user_id, nickname: nickname, sex: sex, head_pic: head_pic},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
        // console.log(res)
        if (res.data.code==0){
           wx.showToast({
             title: res.data.msg,
           })
          //  console.log(res)
           self.setData({
             datas: res.data.data
           })
        }
        
      }
    })

  },
  // 跳到设置
  setting:function(){
   
    var user_id = this.data.user_id;
    if (user_id) {
      wx.navigateTo({
        url: './setting/setting',
      })
    } else {
      wx.showToast({
        title: '请先登录',
      })
    }
  },
  // 跳到我的收藏
  mycollect:function(){
    var user_id = this.data.user_id;
    if (user_id) {
      wx.navigateTo({
        url: './mycollect/mycollect',
      })
    } else {
      wx.showToast({
        title: '请先登录',
      })
    }
   
  },
    // 跳到最近浏览
  browse: function () {
    var user_id = this.data.user_id;
    if (user_id) {
      wx.navigateTo({
        url: './browse/browse',
      })
    } else {
      wx.showToast({
        title: '请先登录',
      })
    }
  },
  // 跳到优惠券
  coupon: function () {
    var user_id = this.data.user_id;
    if (user_id) {
      wx.navigateTo({
        url: './coupon/coupon',
      })
    } else {
      wx.showToast({
        title: '请先登录',
      })
    }
   
  },
  // 跳到我的套餐
  mypackage:function(e){
    var currtab = e.currentTarget.dataset.current;
    var user_id = this.data.user_id;
    if (user_id) {
      wx.navigateTo({
        url: './mypackage/mypackage?currtab=' + currtab,
      })
    } else {
      wx.showToast({
        title: '请先登录',
      })
    }
  },
  // 跳到我的订单
  myorder: function (e) {
    var currtabs = e.currentTarget.dataset.currents;
    var user_id = this.data.user_id;
    if (user_id) {
      wx.navigateTo({
        url: './myorder/myorder?currtab=' + currtabs,
      })
    } else {
      wx.showToast({
        title: '请先登录',
      })
    }
   
  },
  // 跳到我的资产
  myassets:function(){
    var user_id = this.data.user_id;
    if (user_id){
      wx.navigateTo({
        url: './myassets/myassets',
      })
    }else{
      wx.showToast({
        title: '请先登录',
      })
    }
   
  },
    // 跳到测试结果
  testresult:function(){
    var user_id = this.data.user_id;
    if (user_id) {
      wx.navigateTo({
        url: './results/results',
      })
    } else {
      wx.showToast({
        title: '请先登录',
      })
    }
    
  },
  //测试点击登录授权
  login(userinfo, callback) {

    // console.log(userinfo.detail.encryptedData)
    app.globalData.encryptedData = userinfo.detail.encryptedData;
    app.globalData.userInfo = userinfo.detail.userInfo;
    app.globalData.iv = userinfo.detail.iv;
    wx.login({}) // 现在，调用 wx.login 是一个可选项了。只有当你需要使用微信登录鉴别用户，才需要用到它，用来获取用户的匿名识别符

    if (userinfo.detail.errMsg == 'getUserInfo:ok') {
      // 将用户信息、匿名识别符发送给服务器，调用成功时执行 callback(null, res)
      var that = this;
      app.getOpenId(function () {
        var session_key = app.globalData.session_key;
        var openId = app.globalData.openid;
        console.log(openId)
        
        wx.request({
          url: jiekou + '/index.php/WXAPI/User/validateOpenid', //仅为示例，并非真实的接口地址
          data: { openid: openId },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
           
            if (res.data.code == 200) {
              
              app.getUserInfo()
              getApp().globalData.userInfo = res.data.data;
              // console.log(res.data.data.user_id)
              getApp().globalData.login = true;

              getApp().globalData.user_id = res.data.data.user_id;
              that.onLoad();


            } else {
              if (res.data.code == 400) {
                console.log("need register")
               
                app.registerceshi(function () {

                  getApp().globalData.login = true;
                  that.setData({
                    user_id: app.globalData.user_id,
                    userInfo: app.globalData.userInfo
                  })
                  that.onLoad();
                });
              }
            }
          }
        });

      });


    }
    else if (userinfo.detail.errMsg == 'getUserInfo:fail auth deny') { // 当用户点击拒绝时
      wx.showModal({
        title: '授权失败'
      }) // 提示用户，需要授权才能登录

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
    this.getmyself();
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
    this.getmyself();
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
    var share_pic = 'http://yitude.sxnet.cc/Public/upload/logo/2018/09-20/5ba35a80cc192.png';
    return {
      title: '易涂得（邀请一起玩色彩游戏）',
      path: '/pages/index/index?scene=' + user_id + ',5',
      imageUrl: share_pic,
      success: function (res) {
        // console.log(res)
        wx.request({
          url: jiekou + '/WXAPI/ClockIn/shareFlag',
          data: { user_id: user_id },
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            // console.log(res)
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