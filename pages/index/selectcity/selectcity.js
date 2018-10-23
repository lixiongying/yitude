// pages/index/selectcity/selectcity.js
const app = getApp()
var jiekou = app.globalData.jiekou;
var amapFile = require('../../libs/amap-wx.js');
var markersData = {
  latitude: '', //纬度
  longitude: '', //经度
  key: "e900949c44c6b003468bcba32bbe3acc"
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    citylist:[],
    dislist:[],
    hotcitylist:[],
    msg:'',
    cityid:1,
    cityname:'',
    cityresult:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getcitylist();
    var cityname = app.globalData.cityname;
    
    this.setData({
      cityname: cityname
    })
    wx.hideShareMenu() 
  },
  // 搜索城市
  cityinput:function(e){
     
    var cityresult = e.detail.value;
    this.setData({
      cityresult: cityresult
    })
  },
  searchcity:function(){
    var cityresult = this.data.cityresult;
   
    this.getcityid(cityresult);
    
    
  },
  // 获取省
  getcitylist:function(){
    var self=this;
    var citylist = self.data.citylist;
    var hotcitylist = self.data.hotcitylist;
    wx.request({
      url: jiekou +'/WXAPI/Index/ProvinceCityList',
      method: 'post',
      success: function (res){
  
        var dislist = [];
        if (res.data.code==0){
          
            citylist = res.data.data.provincelist;
            hotcitylist = res.data.data.hotcitylist;
            for (var i = 0; i < citylist.length; i++) {
              dislist.push(citylist[i])
            }
           
         
        }else{
          self.setData({
            msg: res.data.data.msg,
          })
        }
       
          self.setData({
            citylist: citylist,
            hotcitylist: hotcitylist,
            dislist: dislist
          })
      }
    })
  },
// 获取市区
  getdistrict:function(e){
    var self=this;
    var cityid = e.target.dataset.id;
   
    self.setData({
      cityid: cityid,
   
    })
   
  },
  // 点击获取城市id
  getcityinfo:function(e){

    var cityid = e.currentTarget.dataset.id;
 
    var cityname= e.currentTarget.dataset.name;
   
    app.globalData.cityid = cityid;
    app.globalData.cityname = cityname;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
     city: cityname, cityid: cityid 
    })
    app.globalData.refreshFlag = true;
    wx.navigateBack();
  },
  bindscroll:function(e){
   
  },
  // 获取城市id
  getcityid: function (city) {
    var self = this;
    var city = city;

    if (city) {
      wx.request({
        url: jiekou + '/WXAPI/Index/Locacity',
        data: { city: city },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.data.code == 0) {
            var cityid = res.data.data.id;
          
            app.globalData.cityid = cityid;
            app.globalData.cityname = city;
            app.globalData.refreshFlag = true;
            wx.navigateBack()
          }else{
            wx.showModal({
              title: '提示',
              content: '该城市找不到',
            })
            return;
          }

          // self.getcory();
        }
      })
    }
  },
  
  getShow: function () {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则定位功能将无法使用',
            success: function (res) {
              if (res.cancel) {
                // console.info("1授权失败返回数据");

              } else if (res.confirm) {
                //village_LBS(that);
                wx.openSetting({
                  success: function (data) {
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
  getloca: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
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
  //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
  loadCity: function (latitude, longitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: markersData.key
    });
    myAmapFun.getRegeo({
      location: longitude + ',' + latitude, //location的格式为'经度,纬度'
      success: function (data) {
        // console.log(data)
        var city = data[0].regeocodeData.addressComponent.city;
        that.setData({
          cityname: data[0].regeocodeData.addressComponent.city,
        })
        that.getcityid(city);
        app.globalData.cityname = city;
        app.globalData.ress = JSON.stringify(data[0].regeocodeData.addressComponent);
      },
      fail: function (info) { }
    });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})