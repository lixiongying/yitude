// pages/index/packagelist/index.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou:jiekou,
    flag:true,
    flags: true,
    sg_id:'',
    store_id:'',
    sales: 0,
    price:0,
    num:1,
    keyword:'',
    pastatus:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.datas!= '' && options.datas!= null && options.datas!= undefined ){
   
      var datas = JSON.parse(options.datas)
      // var store_id = datas.store_id;
      var sg_id = datas.sg_id;
      this.setData({
        sg_id: sg_id,
        // store_id: store_id
      })
    }else{
      // console.log(store_id)
      this.setData({
        sg_id: '',
        // store_id: store_id
  
      })
    }
   
    
   
    this.getpackagelist()
  },
  // 按销量排序
  getsale: function (e) {
   
    var self = this;
    var sales = self.data.sales;
    var priceid = self.data.priceid;
    var flag = self.data.flag;
    if (flag) {
      self.setData({
        flag: false,
        sales: 2,
        price: 0
      })
    } else {
      self.setData({
        flag: true,
        sales: 1,
        price: 0
      })
    }
    self.getpackagelist()
  },
  // 套餐详情
  gopackagedetail:function(e){
    var sp_id = e.currentTarget.dataset.spid;
    wx.navigateTo({
      url: '../packagedetail/index?sp_id=' + sp_id,
    })
  },
  // 套餐关键词搜索
  searchdisplay:function(){
    var self=this;
    var pastatus = self.data.pastatus;
    var keyword = self.data.keyword;
    if (pastatus==1){
      pastatus=0
    }
    self.setData({
      pastatus: pastatus,
      keyword:''
    })
  },
  packeyword:function(e){
    var self=this;
    var keyword = self.data.keyword;
    var value = e.detail.value;

    self.setData({
      keyword: value
    })
  },
  searchpackage:function(){
    var self=this;
    var keyword = self.data.keyword;
    var pastatus = self.data.pastatus
  
    self.getpackagelist();
    self.setData({
      pastatus:1,
   
    })
    
  },
   // 按价格排序
  getprice: function (e) {

    var self = this;
    var sales = self.data.sales;
    var price = self.data.price;
    var flags = self.data.flags;
    self.setData({
      packagelist:[],
      
    })
    if (flags) {
      self.setData({
        flags: false,
        price: 2,
        sales: 0
      })

    } else {
      self.setData({
        flags: true,
        price: 1,
        sales: 0
      })
    }
    self.getpackagelist()
  },
// 获取套餐列表和套餐的排序
  getpackagelist:function(){
    var self=this;
    var price = self.data.price;
    var sales = self.data.sales;
    var sg_id = self.data.sg_id;
    var store_id = app.globalData.store_id;
    // console.log(store_id)
    var num = self.data.num;
    var keyword = self.data.keyword;
    var limit = 10;
    wx.request({
      url: jiekou+'/WXAPI/Goods/packagelist',
      data: { price: price, sales: sales, sg_id: sg_id, store_id: store_id, num: num, limit: 10, keyword: keyword},
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res){
     
        if(res.data.code==0){
          var packagelist = res.data.data.packagelist;
          var page = res.data.data.page;
          var storeifno = res.data.data.storeifno;
          if (packagelist){
            self.setData({
              packagelist: packagelist,
            
              page: page,
              storeifno: storeifno
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '暂无套餐',
            })
          }
         
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
        
    
      }
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