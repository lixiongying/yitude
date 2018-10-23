// pages/myself/myassets/mingxi/mingxi.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curtab:'0',
    jiekou: jiekou,
    cu_page:1,
    page_size: 10,
    datas:[],
    newpage:10,
    flag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var curtab = options.curtab;
    
    var BarTitle;
 
    if (curtab==0){
      this.getextramingxi();
      BarTitle="余额明细"
      
    } else if (curtab == 1){
      BarTitle = "金币明细"
      this.getjinbimingxi()
    }else{
      BarTitle = "提现记录"
      this.gettixianmingxi()
    }
    wx.setNavigationBarTitle({
      title: BarTitle
    })
    this.setData({
      curtab: curtab
    })
  },
  // 余额明细
  getextramingxi: function () {
    var self = this;
    var user_id = app.globalData.user_id;
    var cu_page = self.data.cu_page;
    var page_size = self.data.page_size;
    var page = self.data.page;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou + '/WXAPI/Personal/distrNotic',
      data: { user_id: user_id, num: cu_page, limit: page_size },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        var newpage = 0;
        self.setData({
          cu_page: cu_page + 1,

        })
        if (res.data.code == 0) {
          var data = res.data.data.accountlog;
          var datas = self.data.datas;
          var page = res.data.data.page;

          if (data.length > 0) {
            newpage = data.length;
            for (var i = 0; i < data.length; i++) {
              datas.push(data[i])
            }
          
            self.setData({
              datas: datas,
              page: page,
              newpage: newpage
            })
          } else {
            self.setData({
              newpage: 0
            })
            // wx.showModal({
            //   title: '提示',
            //   content: '暂无数据',
            // })
          }

        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }

      }
    })
  },
  // 金币明细
  getjinbimingxi: function () {
    var self = this;
    var user_id = app.globalData.user_id;
    var cu_page = self.data.cu_page;
    var page_size = self.data.page_size;
    var page = self.data.page;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou + '/WXAPI/Personal/MyGoldInfo',
      data: { user_id: user_id, num: cu_page, limit: page_size },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        var newpage = 0;
        self.setData({
          cu_page: cu_page + 1,

        })
        if (res.data.code == 0) {
          var data = res.data.data.Goldlog;
          var datas=self.data.datas;
          var page = res.data.data.page;
        
          if (data.length>0){
            newpage = data.length;
            for (var i = 0; i < data.length;i++){
              datas.push(data[i])
            }
            self.setData({
              datas: datas,
              page: page,
              newpage: newpage
            })
          } else {
            self.setData({
              newpage: 0
            })
            // wx.showModal({
            //   title: '提示',
            //   content: '暂无数据',
            // })
          }
          
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg
          })
        }

      }
    })
  },

  // 提现记录
  gettixianmingxi: function () {
    var self = this;
    var user_id = app.globalData.user_id;
    var cu_page = self.data.cu_page;
    var page_size = self.data.page_size;
    var page = self.data.page;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou + '/WXAPI/Money/WithdrawalsLog',
      data: { user_id: user_id, num: cu_page, limit: page_size },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        var newpage = 0;
        self.setData({
          cu_page: cu_page + 1,

        })
        if (res.data.code == 0) {
          
          var data = res.data.data.withdrawalslist;
          var datas = self.data.datas;
          var page = res.data.data.page;

          if (data.length > 0) {
            newpage = data.length;
            for (var i = 0; i < data.length; i++) {
              datas.push(data[i])
            }
            self.setData({
              datas: datas,
              page: page,
              newpage: newpage
            })
          } else {
            self.setData({
              newpage: 0
            })
            // wx.showModal({
            //   title: '提示',
            //   content: '暂无数据',
            // })
          }

        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }

      }
    })
  },
  listdetail:function(e){
    // console.log(e)
    var ids = e.currentTarget.dataset.ids;
    wx.navigateTo({
      url: '../listdetail/listdetail?ids=' + ids,
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
    var curtab = that.data.curtab;
    if (flag) {
      if (newpage >= page_size) {
        if (curtab==0){
          that.getextramingxi();
        }else if (curtab==1){
          that.getjinbimingxi()
        }else{
          that.gettixianmingxi()
        }
        
      }else{
        wx.showModal({
          title: '提示',
          content: '已经到底啦',
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})