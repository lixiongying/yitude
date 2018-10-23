// pages/index/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodskeyword:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  searchs: function (e) {
    var self = this;
    var value = e.detail.value;
    var goodskeyword = self.data.goodskeyword;

    if (value != '' && value != undefined && value != null) {
      self.setData({
        goodskeyword: value
      })

    }

  },
  // searchs:function(e){
  //   var self=this;
  //   var value = e.detail.value;
  //   var goodskeyword = self.data.goodskeyword;
  //   var pages = getCurrentPages();
  //   //获取上一个页面的所有的方法和data中的数据
  //   var lastpage = pages[pages.length - 2]
  //   //改变上一个页面中的data中的数据
  //   if (value != '' && value != undefined && value!=null){
  //     self.setData({
  //       goodskeyword: value
  //     })
     
  //   }

  // },
  searchgoods: function () {
    var self = this;
    var goodskeyword = self.data.goodskeyword;
    wx.navigateTo({
      url: '../goodslist/goodslist?goodskeyword=' + goodskeyword,
    })
    // if (goodskeyword != '' && goodskeyword != undefined && goodskeyword != null) {
        

    // } else {
    //   wx.showToast({
    //     title: '请输入关键词',
    //   })
    // }

  },


  // searchgoods:function(){
  //   var self = this;
  //   var goodskeyword = self.data.goodskeyword;
  //   if (goodskeyword != '' && goodskeyword != undefined && goodskeyword != null){
  //     var pages = getCurrentPages();
  //     //获取上一个页面的所有的方法和data中的数据
  //     var lastpage = pages[pages.length - 2];
  //     lastpage.setData({
  //       goodskeyword: goodskeyword,
  //     })

  //     wx.navigateBack({
  //       success: function () {
  //         lastpage.onLoad(); // 执行前一个页面的onLoad方法
  //       }
  //     });

  //   }else{
  //     wx.showToast({
  //       title: '请输入关键词',
  //     })
  //   }
 
  // },
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