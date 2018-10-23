// pages/myself/setting/addaddress/addaddress.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //省
    province: '',
    //市
    city: '',
    //区或县
    district: '',
    //详细地址
    ress: '',
    //联系人电话
    mobile: '',
    //联系人名称
    name: '',
    //地址id
    ids: 0,
    jiekou: jiekou,
    user_id: 840,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    var that = this;
    var user_id = app.globalData.user_id;
    this.setData({     
      user_id: user_id
    })
    
    
  },
  // 设置联系人地区
  bindRegionChange:function (e){
    
    var self=this;
    var datas = e.detail.value;
    var province = datas[0];
    var city = datas[1];
   
    var district = datas[2];
    var region = datas[0] + ' ' + datas[1] + ' ' + datas[2];
  
    self.setData({
      province: province,
      city: city,
      district: district,
      region: region
    })
  },
  // 设置联系人姓名
  setName:function(e){
    var val = e.detail.value;
    this.setData({
      name: val
    }) 
  },
  //设置联系人电话
  setPhone: function (e) {
    var val = e.detail.value;
    this.setData({
      mobile: val
    })
  },
  //设置详细地址
  setRess: function (e) {
    var val = e.detail.value;

    this.setData({
      ress: val
    })
  },
  //弹框
  showAlert: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
    })
  },
  //保存地址信息
  saveRess: function () {
    var that = this;
    var address_id = that.data.ids;
    var consignee = that.data.name;
    var mobile = that.data.mobile;
    var province = that.data.province;
    var city = that.data.city;
    var district = that.data.district;
    var address2 = that.data.ress;
    var user_id = that.data.user_id;
    if (!consignee) {
      that.showAlert('请填写联系人姓名');
    } else if (!mobile) {
      that.showAlert('请填写联系人电话');
    } else if (!province) {
      that.showAlert('请选择地区');
    } else if (!address2) {
      that.showAlert('请输入详细地址');
    }else {
      var getUrls = jiekou + '/WXAPI/Personal/addOrEditAddress';
      wx.request({
        url: getUrls,
        data: {
          address_id: '',
          phone: mobile,
          province: province,
          city: city,
          district: district,
          address_id: address_id,
          name: consignee,
          address: address2,
          user_id: user_id,
          is_default: 0
        },
        method:'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },

        success: function (res) {
     
          if (res.data.code == 0) {
            wx.showToast({
              title: '操作成功',
            });
            setTimeout(function () {
              wx.hideToast();
              wx.navigateBack();
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]  //上一个页面
              var show = that.data.show;
              prevPage.setData({
                shua: 1,
                address_id: res.data.data
              })
            }, 500);
          } else {
            that.showAlert(res.data.msg);
          }
        }
      });
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