// pages/myself/setting/goodsaddress/goodsaddress.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    user_id: '',
    cu_page:1,
    addresslist:[],
   shua:1,
    falg:true,
    is_select:0,
    shua:0,
    selectstatus:'',
    botataus:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_id = app.globalData.user_id;
    var selectstatus = options.selectstatus;
    if (selectstatus){
      that.setData({
        selectstatus: selectstatus
      })
    }
    
    that.setData({
      jiekou: jiekou,
      user_id: user_id,
    })
    that.getaddress()
  },
  //弹框
  showAlert: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
    })
  },
  addressreturn:function(e){
    var that=this;
    var ids=e.currentTarget.dataset.ids;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]  //上一个页面
    var show = that.data.show;
    var adsflag = app.globalData.adsflag;
    if (adsflag==0){
     
    }else{
      prevPage.setData({
        shauxin: 1,
        address_id: ids
      })
      wx.navigateBack();
    }
    
  },
  // 获取收获地址列表
  getaddress:function(){
    var that=this;
    var user_id = that.data.user_id;
    var cu_page = that.data.cu_page;
 
    wx.request({
      url: jiekou+'/WXAPI/Personal/addressList',
      data: { user_id: user_id, cu_page: cu_page, page_size:10},
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
        if(res.data.code==0){
         var addresslist = that.data.addresslist;
         var datas = res.data.data.addresslist;
         var page = res.data.data.page;
         
         if(datas){
            for(var i=0;i<datas.length;i++){
              
              addresslist.push(datas[i])
            }
          //  console.log(addresslist)
           that.setData({
             addresslist: addresslist,
             page: page
           })
         }else{
           wx.showModal({
             title: '提示',
             content: '你还未添加地址',
           })
         }
          
          
       }
  
      } 
    })
  },
  // 设置默认收货地址
  setDefaultAddress:function(e){
    var that = this;
    var user_id = that.data.user_id;
    var addresslist = that.data.addresslist;
    var adsid = e.currentTarget.dataset.adsid;
    var indexs = e.currentTarget.dataset.index;
    for (var i = 0; i < addresslist.length;i++){
      if (i == indexs){
        addresslist[i].is_default =1;
      }else{
        addresslist[i].is_default = 0;
      }
    }
    // addresslist=[];
    that.setData({
      addresslist: addresslist
    })
    
    wx.request({
      url: jiekou+'/WXAPI/Personal/setDefaultAddress',
      data: { user_id: user_id, address_id: adsid},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },

      success: function (res){
      
        if(res.data.code==0){
          // that.getaddress()
          
        }
      }
    }) 
  },
  // 编辑收货地址
  editaddress:function(e){
    var adsid=e.currentTarget.dataset.adsid;

    wx.navigateTo({
      url: '../editaddress/editaddress?adsid=' + adsid,
    })
  },
  // 删除收获地址
  deleteaddress:function(e){
    var self=this;
    var adsid = e.currentTarget.dataset.adsid;
    var user_id=this.data.user_id;
    
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: jiekou + '/WXAPI/Personal/delAddress',
            data: { user_id: user_id, address_id: adsid },
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              if(res.data.code==0){
                wx.showToast({
                  title: '删除地址成功',
                })
                self.setData({
                  addresslist: []
                })
                self.getaddress()
              }
            }
          })
        } else if (sm.cancel) {
         
        }
      }
    })
    
  },
   // 新增收货地址
  addaddress:function(){
    wx.navigateTo({
      url: '../addaddress/addaddress',
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
    var self=this;
    var shua = this.data.shua;
    
    if(shua==1){
      self.setData({
        addresslist: [],
        shua: 0
      })
      self.getaddress();
    }
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
    var page = that.data.page;
    var falg = that.data.falg;
    if (falg) {
      if (page.cu_page == page.total_page) {
        // wx.showModal({
        //   title: '提示',
        //   content: '已经到底啦',
        //   image: '../../../images/error.png',
        //   duration: 1000,
        // })
        that.setData({
          botataus:1
        })
      } else {
        wx.showLoading({
          title: '正在加载',
        })
        setTimeout(function () {
          that.setData({ cu_page: cu_page + 1 });
          that.getaddress();
        }, 500);
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})