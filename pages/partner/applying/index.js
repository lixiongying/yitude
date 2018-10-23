// pages/myself/setting/addaddress/addaddress.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //联系人电话
    mobile: '',
    //联系人名称
    name: '',
    //等级id
    ids: 0,
    //选择店铺的id
    shopid: '',
    //选择店铺的名字
    shopname: '',
    jiekou: jiekou,
    user_id: '',
    // 合伙人等级名字
    names: '',
    //验证码
    code: '',
    //银行卡号
    card: '',
    //是否发送了验证码 true未发送  false已发送
    codeFlag: true,
    //倒计时
    codeNum: 120,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_id = app.globalData.user_id;
    var ids = options.ids;
    var names = options.names;
    this.setData({
      user_id: user_id,
      ids: ids,
      names: names,
    })
  },
  //获取选择的店铺
  getshop: function(obj){
    var obj = JSON.parse(obj);
    this.setData({
      shopid: obj.store_id,
      shopname: obj.store_name,
    })
  },
  //跳转获取银行卡
  linkmybank: function(){
    wx.navigateTo({
      url: '../../myself/myassets/mybankcard/mybankcard',
    })
  },
  //获取验证码
  getCodeInfo: function (e) {
    var that = this;
    var user_id = that.data.user_id;
    var phoneFlag = /^1[3|4|5|7|8|9]\d{9}$/;
    var mobile = that.data.mobile;
    if ((phoneFlag.test(mobile)) && mobile.length == 11) {
      var getCodeUrls = jiekou + '/WXAPI/Personal/sendValidateCode';
      wx.showLoading({
        title: '正在发送',
      })
      that.setData({
        codeFlag: false,
      })
      wx.request({
        url: getCodeUrls,
        data: {
          user_id: user_id,
          mobile: mobile
        },
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            wx.showToast({
              title: '发送成功',
            })
            var codeNum = that.data.codeNum;
            var timer = setInterval(function () {
              codeNum--;
              if (codeNum <= 0) {
                clearInterval(timer);
                that.setData({
                  codeNum: 120,
                  codeFlag: true,
                })
              } else {
                that.setData({
                  codeNum: codeNum,
                })
              }
            }, 1000);
          } else {
            wx: wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: true,
            })
          }
        }
      });
    } else {
      wx: wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码',
        showCancel: true,
      })
    }
  },
  //跳转合作店铺
  linkcoshop: function(){
    wx.navigateTo({
      url: '../coshop/index',
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
  //设置验证码
  setCode: function(e){
    var val = e.detail.value;
    this.setData({
      code: val
    })
  },
  //设置卡号
  setCard: function (e) {
    var val = e.detail.value;
    this.setData({
      card: val
    })
  },
  //弹框
  showAlert: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
    })
  },
  //提交申请
  formSubmit: function (e) {
    var that = this;
    var form_id = e.detail.formId;
    if (form_id == 'the formId is a mock one'){
      that.showAlert('请使用真机调试');
      return;
    }
    var ids = that.data.ids;
    var consignee = that.data.name;
    var mobile = that.data.mobile;
    var code = that.data.code;
    var user_id = that.data.user_id;
    var shopid = that.data.shopid;
    var card = that.data.card;
    if (!ids){
      that.showAlert('请后退选择合伙人类型');
    }else if (!consignee) {
      that.showAlert('请填写真实姓名');
    } else if (!mobile) {
      that.showAlert('请填写联系人电话');
    } else if (!code) {
      that.showAlert('请填写验证码');
    } else if (!shopid) {
      that.showAlert('请选择合作店铺');
    } else if (!card) {
      that.showAlert('选填选转账银行卡号');
    } else {
      var getUrls = jiekou + '/WXAPI/Partner/partnerApply';
      wx.request({
        url: getUrls,
        data: {
          user_id: user_id,
          partner_id: ids,
          true_name: consignee,
          phone: mobile,
          code: code,
          store_id: shopid,
          card_no: card,
          form_id: form_id,
        },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          wx.hideToast();
          if (res.data.code == 0) {
            wx:wx.showModal({
              title: '温馨提示',
              content: res.data.msg,
              showCancel: true,
              success: function(res) {
                wx.switchTab({
                  url: '/pages/partner/partner',
                })
              },
            })
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