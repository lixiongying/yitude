// pages/myself/setting/editaddress/editaddress.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region:'',
    jiekou: jiekou,
    user_id:'',
    // 地址id
    adsid:'',
    province: '',
    city: '',
    district: '',
    region: '',
    name:'',
    mobile:'',
    is_default:'',
    address2:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var adsid = options.adsid;
    var user_id = app.globalData.user_id;
    this.setData({
      user_id: user_id,
      adsid: adsid
    })

    
    this.geteditaddress()
  },
  //弹框
  showAlert: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
    })
  },
  // 设置联系人地区
  bindRegionChange: function (e) {
 
    var datas = e.detail.value;
    var province = datas[0];
    var city = datas[1];
    var district = datas[2];
    var region = datas[0] + ' ' + datas[1] + ' ' + datas[2];
    this.setData({
      province: province,
      city: city,
      district: district,
      region: region
    })
  },
  // 设置联系人姓名
  setName: function (e) {
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
    // console.log(val)
    this.setData({
      address2: val
    })
  },
  // 获取地址信息
  geteditaddress:function(){
    var self=this;
    var adsid = self.data.adsid;
    var user_id = self.data.user_id;
    wx.request({
      url: jiekou+'/WXAPI/Personal/getAddress',
      data: { user_id: user_id, address_id: adsid },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
        // console.log(res)
        if(res.data.code==0){
          var editaddress=res.data.data;
          var region = res.data.data.province + ' ' + res.data.data.city + ' ' +res.data.data.district;
        
          var address2 = res.data.data.address2;
          var name = res.data.data.name;
          var province = res.data.data.province;
          var mobile = res.data.data.phone;
          var is_default = res.data.data.is_default;
          var city = res.data.data.city;
          var district = res.data.data.district;
          self.setData({
            editaddress: editaddress,
            region: region,
            address2: address2,
            mobile: mobile,
            name: name,
            is_default: is_default,
            province: province,
            district: district,
            city: city
          })
        }
      }
    })
  },
  //保存地址信息
  saveRess: function () {
    var that = this;
    var address_id = that.data.adsid;
    var consignee = that.data.name;
    var mobile = that.data.mobile;
    var province = that.data.province;
    var city = that.data.city;
    var district = that.data.district;
    var address2 = that.data.address2;
    var user_id = that.data.user_id;
    var is_default = that.data.is_default;
    // console.log(city)
    if (!consignee) {
      that.showAlert('请填写联系人姓名');
    } else if (!mobile) {
      that.showAlert('请填写联系人电话');
    } else if (!province) {
      that.showAlert('请选择地区');
    } else if (!address2) {
      that.showAlert('请输入详细地址');
    } else {
      var getUrls = jiekou + '/WXAPI/Personal/addOrEditAddress';
      wx.request({
        url: getUrls,
        data: {
          address_id: address_id,
          phone: mobile,
          province: province,
          city: city,
          district: district,
          name: consignee,
          address: address2,
          user_id: user_id,
          is_default: is_default
        },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },

        success: function (res) {
          // console.log(res)
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
              })
            }, 500);
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
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