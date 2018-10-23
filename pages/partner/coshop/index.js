// pages/partner/coshop/index.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    addressindex: '',
    //省
    province: '',
    //市
    city: '',
    //区或县
    district: '',
    region: '',
    user_id: '',
    keyword: '',
    cu_page: 1,
    page_size: 10,
    datas: [],
    newpage: 10,
    flag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_id = app.globalData.user_id;
    this.setData({
      user_id: user_id,
    })
  },
  // 点击确定
  returntixian: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var datas = that.data.datas;
    var objs = datas[index];
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]  //上一个页面
    prevPage.getshop(JSON.stringify(objs));
    wx.navigateBack();
  },
  //点击搜索
  search: function(){
    var that = this;
    that.setData({
      cu_page: 1,
      page_size: 10,
      datas: [],
      flag: true,
      newpage: 10,
    })
    that.getStoreList();
  },
  getStoreList: function(){
    var that = this;
    var keyword = that.data.keyword;
    var province = that.data.province;
    var city = that.data.city;
    var district = that.data.district;
    var user_id = app.globalData.user_id;
    var cu_page = that.data.cu_page;
    var page_size = that.data.page_size;
    this.setData({
      flag: false
    })
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou + '/WXAPI/Partner/getStoreList',
      data: { 
        user_id: user_id, 
        p: cu_page, 
        pagesize: page_size,
        province: province,
        district: district,
        city: city,
        key: keyword
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        var newpage = 0;
        that.setData({
          cu_page: cu_page + 1,
          flag: true,
        })
        if (res.data.code == 0) {
          var datas = that.data.datas;
          var data = res.data.data.root;
          if (data.length > 0) {
            newpage = data.length;
            for (let i = 0; i < data.length; i++) {
              datas.push(data[i]);
            }
            that.setData({
              datas: datas,
              newpage: newpage
            })
          } else {
            that.setData({
              newpage: 0
            })
          }
        }
      }
    })
  },
  //设置关键字
  setkeyword: function(e){
    var val = e.detail.value;
    this.setData({
      keyword: val
    })
  },
  // 设置联系人地区
  bindRegionChange: function (e) {
    var self = this;
    var datas = e.detail.value;
    var datacode = e.detail.code;
    var province = datas[0];
    var city = datas[1];
    var district = datas[2];
    var region = datas[0] + ' ' + datas[1] + ' ' + datas[2];
    self.setData({
      province: province,
      city: city,
      district: district,
      region: region,
      addressindex: datas
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
    var that = this;
    var cu_page = that.data.cu_page;
    var newpage = that.data.newpage;
    var page_size = that.data.page_size;
    var flag = that.data.flag;
    if (flag) {
      if (newpage >= page_size) {
        that.getStoreList();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})