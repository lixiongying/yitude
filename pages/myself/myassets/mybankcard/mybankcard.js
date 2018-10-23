// pages/myself/myassets/mybankcard/mybankcard.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    datas: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var flag = options.flag;
    // console.log(flag)
    if (flag){
      this.setData({
        flag: flag
      })
    }
     this.getbankcard()
  },
  // 获取银行卡列表
  getbankcard: function (){
    var self = this;
    var user_id = app.globalData.user_id;
    wx.request({
      url: jiekou + '/WXAPI/Money/getMyBank',
      data: { user_id: user_id },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
      
        if(res.data.code==1){
         wx.showModal({
           title: '提示',
           content: res.data.msg,
         })
        }else{
          var datas = res.data.data;
          self.setData({
            datas: datas
          })
        }
      
        
      }
    })
  },
  // 回到提现列表
  returntixian: function (e) {
    var self=this;
    var index = e.currentTarget.dataset.index;
    var datas = self.data.datas;
    // console.log(index)
    // console.log(datas)
    var bank_id = datas[index].bank_id;
    var text = datas[index].bank_name;
    var true_card_no = datas[index].true_card_no;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]  //上一个页面
    
    prevPage.setData({
      shauxin: 1,
      bank_id: bank_id,
      text: text,
      card: true_card_no,

    })
    wx.navigateBack();
  },
  // 跳转到添加银行卡
  addcard:function(){
    wx.navigateTo({
      url: '../addbankcard/addbankcard',
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})