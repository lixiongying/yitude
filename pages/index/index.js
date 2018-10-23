//index.js
var amapFile = require('../libs/amap-wx.js');
var markersData = {
  latitude: '', //纬度
  longitude: '', //经度
  key: "e900949c44c6b003468bcba32bbe3acc"
}
//获取应用实例
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({
  data: {
    jiekou: jiekou,
    motto: 'Hello World',
    infoflags:'',
    userInfo: {},
    hasUserInfo: false,
    city: '',
    latitude: '',
    longitude: '',
    cardatas: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cityId: '',
    wxbroadcastList: [],
    glod: 0,
    relayflag: 0,
    pic: '../../images/add.png',
    share_pic: 'http://yitude.sxnet.cc/Public/upload/logo/2018/09-20/5ba35a80cc192.png',

  },
  // 生命周期函数
  onLoad: function(options) {
    var that = this;
    if (options.scene) {
      // console.log(options.scene)
      var scene = decodeURIComponent(options.scene);
      app.globalData.scene = scene;
    } else {
      var scene = '';
    }
 
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          //用户已经授权过
              var datainfo = {};
              var scene = app.globalData.scene;
              //  console.log(scene)
              if (scene) {
                var scenearr = scene.split(',');
                if (Array(scenearr)){
                  // console.log('sds')
                  var user_id = scene.split(',')[0];
                  var index = scene.split(',')[1];
                  var ids = scene.split(',')[2];
                  datainfo.user_id = user_id;
                  datainfo.index = index;
                  datainfo.ids = ids;
                }else {
                  // console.log('sddss')
                  datainfo.user_id = '';
                  datainfo.index = 1;
                  datainfo.ids = '';
                }
                // that.getOpenIds(datainfo);
                // that.getinfostates(); 
              }
              that.getShow();       
              that.getOpenIds(datainfo);
              
        } else {
          wx.redirectTo({
            url: '../logo/index?scene=' + scene,
          })
        }
      }
    })

  },
  // 获取首页消息状态
  getinfostates: function (user_id) {
    var self=this;
    var user_id = user_id;
    var infoflags = app.globalData.infoflags;
    
    wx.request({
      url: jiekou+'/WXAPI/Message/checkNewMessage',
      data: {
        user_id: user_id
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
         if(res.data.code==0){
             self.setData({
               infoflags:1
             })
           app.globalData.infoflags=1
         }else{
           self.setData({
             infoflags: 0
           })
           app.globalData.infoflags = 0
         }
      }
    })
  },
  gopad: function() {
    wx.navigateTo({
      url: './password/index',
      
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // var cityid=this.data.cityid;
    var refreshFlag = app.globalData.refreshFlag;  
    var infoflags = app.globalData.infoflags;
    if (refreshFlag) {
      var cityid = app.globalData.cityid;
      var city = app.globalData.cityname;
   
      this.setData({
        city: city
      })
      this.getcory(cityid);
      app.globalData.refreshFlag=false;
    }
    // console.log(infoflags)
    this.setData({
      infoflags: infoflags
    })
  },
  // 获取城市id
  getcityid: function(city) {
    var self = this;
    var city = city;
    if (city) {
      wx.request({
        url: jiekou + '/WXAPI/Index/Locacity',
        data: {
          city: city
        },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
          //  console.log(res)
          if (res.data.code == 0) {
            var cityid = res.data.data.id;
            wx.setStorage({
              key: 'cityid',
              data: cityid,
              success: function(res) {

              }
            })
            app.globalData.cityid = cityid;
            self.getcory(cityid);
            self.setData({
              cityId: cityid,
              glod: 1,
            })
          }

          // self.getcory();
        }
      })
    }
  },


  // 获取首页内容
  getcory: function(cityid) {
    var self = this;
    var cityid = cityid;
    wx.request({
      url: jiekou + '/WXAPI/Index/index',
      data: {
        city_id: cityid
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
    
      success: function(res) {
        // console.log(res)
        var cardatas = res.data;
        self.setData({
          cardatas: cardatas,
        })
      }
    })
  },
  // 获取首页优惠券
  getcoupon: function() {
    var self = this;
    var ids = self.data.ids;
    var userid = this.data.userid;

    wx.request({
      url: jiekou + '/WXAPI/Personal/CouponDetail',
      data: {
        user_id: userid,
        coupon_id: ids
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        if (res.data.code == 0) {
          var couponlist = res.data.data.couponinfo;
          self.setData({
            couponlist: couponlist
          })
        }
      }
    })
  },
  receivecoupon: function(e) {
    var self = this;
    var couponid = e.currentTarget.dataset.couponid;
    // var userid = this.data.userid
    var user_id = app.globalData.user_id;
    wx.request({
      url: jiekou + '/WXAPI/Personal/ObtainCoupon',
      data: {
        user_id: user_id,
        coupon_id: couponid
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {

        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
          })
          self.setData({
            coupon: 1
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function(sm) {
              if (sm.confirm) {
                self.setData({
                  coupon: 1
                })
              } else {
                self.setData({
                  coupon: 1
                })
              }
            }
          })
        }
      }
    })

  },
  Justhanging: function() {
    this.setData({
      coupon: 1
    })
  },
  // 跳到选择城市
  selectcity: function() {
    wx.navigateTo({
      url: './selectcity/selectcity'
    })
  },
  // 跳到商品分类
  goclassify: function(e) {

    var typeid = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: './classify/classify?typeid=' + typeid
    })
  },
  // 跳到搜索
  serach: function() {
    wx.navigateTo({
      url: './search/search'
    })
  },
  // 跳到商品列表
  more: function() {
    wx.navigateTo({
      url: './goodslist/goodslist'
    })
  },
  // 跳到消息
  message: function() {
    wx.navigateTo({
      url: './message/message'
    })
  },
  // 跳到商品详情
  goodsdetail: function(e) {

    var sg_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './goodsdetail/goodsdetail?sg_id=' + sg_id
    })
  },
  //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
  loadCity: function(latitude, longitude) {

    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: markersData.key
    });
    myAmapFun.getRegeo({
      location: longitude + ',' + latitude, //location的格式为'经度,纬度'
      success: function(data) {

        // console.log(data)
        var city = data[0].regeocodeData.addressComponent.city;
        that.setData({
          city: data[0].regeocodeData.addressComponent.city,
        })

        that.getcityid(city);
        app.globalData.cityname = city;
        app.globalData.ress = JSON.stringify(data[0].regeocodeData.addressComponent);
      },
      fail: function(info) {
        var info = JSON.stringify(info);
        wx.showModal({
          title: '12',
          content: info,
        })

      }
    });
  },

  getShow: function() {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则定位功能将无法使用',
            success: function(res) {
              if (res.confirm) {
                //village_LBS(that);
                wx.openSetting({
                  success: function(data) {
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 5000
                      })
                      //再次授权，调用getLocationt的API
                      that.getloca();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 5000
                      })
                    }
                  }
                })
              } else {
                app.globalData.cityid = 28241;
                that.setData({
                  cityId: 28241,
                  glod: 0,
                })
                that.getcory(28241);
              }
            }
          })
        } else { //初始化进入
          that.getloca();
        }
      }
    })

  },
  //获取地理位置
  getloca: function() {
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = res.latitude; //维度
        var longitude = res.longitude; //经度
        app.globalData.lat = latitude;
        app.globalData.long = longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
        that.loadCity(latitude, longitude);
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //跳转页面判断
  linkstatus: function(res) {
    if (res.index) {
      var userid = res.user_id;
      app.globalData.userid = userid;
      if (res.index == 2) {
        wx.switchTab({
          url: '../selectcolor/selectcolor'
        })
        
      }
      if (res.index == 3) {
        var userid = res.user_id;
        wx.switchTab({
          url: '../lifemethod/lifemethod'
        })
      }
      if (res.index == 4) {
       
        wx.switchTab({
          url: '../partner/partner'
        })
      }
      if (res.index == 5) {

        wx.switchTab({
          url: '../myself/myself'
        })
      }
      //优惠券
      if (res.index == 6) {
        var ids = res.ids;
        var userid = res.user_id;
        this.setData({
          coupon: 0,
          ids: ids,
          userid: userid
        });
        this.getcoupon()


      }
      // 商品详情
      if (res.index == 8) {
        var ids = res.ids;
        console.log(ids)
        wx.navigateTo({
          url: './goodsdetail/goodsdetail?sg_id=' + ids,
        })
      }
      // 套餐详情
      if (res.index == 9) {
        var ids = res.ids
        wx.navigateTo({
          url: './packagedetail/index?sp_id=' + ids,
        })
      }
      // 跳到分享拼团详情
      if (res.index == 10) {
        var ids = res.ids;
        var userid = res.user_id;
        wx.navigateTo({
          url: './collageshare/collageshare?ids=' + ids + '&userid=' + userid
        })
      }

      // 跳到分享海报详情
      if (res.index == 11) {
        // console.log(res)
        var ids = res.ids;
        var userid = res.user_id;
        wx.navigateTo({
          url: '../selectcolor/result/index?ids=' + ids
        })
      }
    }
  },

  more: function() {
    wx.navigateTo({
      url: './goodslist/goodslist'
    })
  },
  // 登录
  getOpenIds: function(datas) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    app.getOpenId(function() {
      var openId = app.globalData.openid;

      wx.request({
        url: jiekou + '/index.php/WXAPI/User/validateOpenid',
        data: {
          openid: openId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          var user_ids = datas.user_id;
          // console.log(user_ids)

          if (res.data.code == 200) {

            app.getUserInfo()
            getApp().globalData.userInfo = res.data.data;
            getApp().globalData.login = true;
            app.globalData.user_id = res.data.data.user_id;
            var user_id = res.data.data.user_id;
            // console.log(res.data.data.user_id)
            that.setData({
              user_id: res.data.data.user_id
            })
            that.linkstatus(datas);
            that.getinfostates(user_id); 
            wx.hideLoading();
          } else {
            if (res.data.code == 400) {
              app.register(function() {
                var userInfo = getApp().globalData.userInfo;
                // console.log(userInfo)
                getApp().globalData.login = true;
                that.setData({
                  user_id: userInfo.user_id
                })
                // that.getinfostates(user_id); 
                that.linkstatus(datas);
                wx.hideLoading();
              }, user_ids);
            }
          }
        }
      });

    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var glod = this.data.glod;
    var user_id = app.globalData.user_id;
    if (glod == 1) {
      var cityId = this.data.cityId;
      this.getcory(cityId);
      this.getinfostates(user_id)
    } else {
      this.getShow();
      this.getinfostates(user_id)
    }
    wx.stopPullDownRefresh()
  },
  Ikonw: function() {
    this.setData({
      relayflag: 0
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {
  //   var self=this;
  //   var refreshFlag = app.globalData.refreshFlag;
  //   if (refreshFlag){
  //     var cityid = this.data.cityid;
  //     console.log(cityid)
  //     console.log(cityid)
  //     self.getcory()
  //     pp.globalData.refreshFlag=false;
  //   }
  //   // this.getinfostates()
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    var that = this;
    var user_id = that.data.user_id;
    var share_pic = 'http://yitude.sxnet.cc/Public/upload/logo/2018/09-20/5ba35a80cc192.png';
    return {
      title: '易涂得（邀请一起玩色彩游戏）',
      path: '/pages/index/index?scene=' + user_id + ',1',
      imageUrl: share_pic,
      success: function(res) {
        wx.request({
          url: jiekou + '/WXAPI/ClockIn/shareFlag',
          data: {
            user_id: user_id
          },
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function(res) {

            if (res.data.code == 0) {

              var relaydata = res.data.data;
              var percent = parseInt(res.data.data.percent * 100);

              var totalgold = parseInt(res.data.data.now_gold) + parseInt(res.data.data.maybe_gold);
              setTimeout(function() {
                that.setData({
                  relaydata: relaydata,
                  relayflag: 1,
                  percent: percent,
                  totalgold: totalgold
                })
              }, 600)

            } else {
              var relaydata = res.data.msg
              setTimeout(function() {
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