// pages/myself/setting/addaddress/addaddress.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lpid: '',
    //省
    province: '',
    //市
    city: '',
    //区或县
    district: '',
    //联系人电话
    mobile: '',
    //联系人名称
    name: '',
    //地址id
    ids: 0,
    jiekou: jiekou,
    user_id: '',
    array: [{text: '男',ids: 1},{text: '女',ids: 2}],
    sexindex: '',
    agearr: [],
    ageindex: '',
    addressindex: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_id = app.globalData.user_id;
    var lpid = options.ids;
    this.setData({
      user_id: user_id,
      lpid: lpid
    })
    this.geteage();
  },
  //性别
  bindPickerChange: function(e){
    var sexindex = e.detail.value;
    this.setData({
      sexindex: sexindex
    })
  },
  //年龄段
  bindPickerChange1: function(e){
    var ageindex = e.detail.value;
    this.setData({
      ageindex: ageindex
    })
  },
  // 设置联系人地区
  bindRegionChange:function (e){
    var self=this;
    var datas = e.detail.value;
    var datacode = e.detail.code;
    var province = datacode[0];
    var city = datacode[1];
    var district = datacode[2];
    var region = datas[0] + ' ' + datas[1] + ' ' + datas[2];
    self.setData({
      province: province,
      city: city,
      district: district,
      region: region,
      addressindex: datas
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
  //提交信息查看结果
  saveRess: function () {
    var that = this;
    var lpid = that.data.lpid;
    var consignee = that.data.name;
    var mobile = that.data.mobile;
    var province = that.data.province;
    var city = that.data.city;
    var district = that.data.district;
    var user_id = that.data.user_id;
    var agearr = that.data.agearr;
    var array = that.data.array;
    var ageindex = that.data.ageindex;
    var sexindex = that.data.sexindex;
    if (!consignee) {
      that.showAlert('请填写联系人姓名');
    } else if (sexindex == '') {
      that.showAlert('请选择性别');
    } else if (!province) {
      that.showAlert('请选择地区');
    } else if (ageindex == '') {
      that.showAlert('请选择年龄段');
    }else {
      var sex = array[sexindex].ids;
      var age = agearr[ageindex].ar_id;
      var getUrls = jiekou + '/WXAPI/Game/fullUserinfo';
      wx.showLoading({
        title: '正在提交',
      })
      wx.request({
        url: getUrls,
        data: {
          gu_id: lpid,
          phone: mobile,
          province: province,
          city: city,
          district: district,
          name: consignee,
          user_id: user_id,
          sex: sex,
          age: age
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
            wx.redirectTo({
              url: '../result/index?ids=' + lpid,
            })
          } else {
            that.showAlert(res.data.msg);
          }
        }
      });
    }

  },
  //获取年龄段
  geteage: function(){
    var that = this;
    var urls = jiekou + '/WXAPI/Game/getAgeregion';
    wx.request({
      url: urls,
      data: {},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            agearr: res.data.data
          })
        } else {
          that.showAlert(res.data.msg);
        }
      }
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