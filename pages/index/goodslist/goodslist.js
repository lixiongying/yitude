// pages/index/goodslist/goodslist.js
const app = getApp()
var jiekou = app.globalData.jiekou;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityid:'',
    jiekou: jiekou,
    sales:0,
    searchlist:[],
    // 价格变化状态
    priceid:0,
    // 综合排序显示状态
    sortstate:0,
    flag:true,
    flagss: true,
    goodskeyword:'',
    order_type:0,
    // flag:true,
    flags:true,
    cat_id:'',
    searchtype:0,
    cu_page: 1,
    page_size:10,
    botataus:0,
    nulldata:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self=this;
    var goodskeyword = options.goodskeyword;
    var cat_id = options.cat_id;
    if (cat_id){
      self.setData({
        cat_id: cat_id
      })
    }
    
    // var goodskeyword = this.data.goodskeyword;
    if (goodskeyword != ''  && goodskeyword != undefined && goodskeyword != null){
      self.setData({
        goodskeyword: goodskeyword
      })
      self.getsearchgoods(goodskeyword)
    }else{
      self.sortgoods()
    }
    
  },
  // 跳到商品详情
  goodsdetail:function(e){
    var sg_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?sg_id=' + sg_id
    })
  },
  // 商品列表
  sortgoods:function(){
    var self = this;
    var cityid=app.globalData.cityid;
    var goodskeyword = self.data.goodskeyword;
    var nulldata = self.data.nulldata;
    
    var cu_page = self.data.cu_page;
    var cat_id = self.data.cat_id;
    var page_size = self.data.page_size;
    // 综合排序
    var order_type = self.data.order_type   
     // 销量排序
    var sales = self.data.sales;
    // 价格排序
    var price = self.data.priceid;
    var searchlist = self.data.searchlist;
    var data={};
    this.setData({
      flag: false
    })
    if (cat_id){
      data = {
        city_id: cityid, order_type: order_type, sales: sales, price: price, num: cu_page, limit: page_size, keyword: goodskeyword, cat_id2: cat_id
      };
    }else{
      data = {
        city_id: cityid, order_type: order_type, sales: sales, price: price, num: cu_page, limit: page_size, keyword: goodskeyword
      };
    }
    // console.log(data)
    wx.showLoading({
      title: '正在加载',
    })
   
    wx.request({
      url: jiekou+'/WXAPI/Goods/GoodsList',
      data: data,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        // console.log(res)
        wx.hideLoading()
        var newpage = 0;
        self.setData({
          cu_page: cu_page + 1,
          flag: true,
        })
        if(res.data.code==0){
          if (res.data.data.goodslist.length>0){
            newpage = res.data.data.goodslist.length;
           
            for (var i = 0; i < res.data.data.goodslist.length;i++){
              searchlist.push(res.data.data.goodslist[i])
            }
          }
          self.setData({
            searchlist: searchlist,
            page: res.data.data.page,
            newpage: newpage,
            falg: true,
          })
        }else{
          self.setData({
            newpage: 0,
            nulldata:1
          })
          
          // wx.showModal({
          //   title: '提示',
          //   content: res.data.msg,
          // })
        }
      }
    })
  },
  // 搜索商品的结果
  getsearchgoods: function (goodskeyword){
    var self = this;
    self.setData({
      
      nulldata: 0
    })
    var goodskeyword = goodskeyword;
    var searchlist = self.data.searchlist;
    var cityid = app.globalData.cityid
   
    wx.request({
      url: jiekou+'/WXAPI/Goods/GoodsList',
      
      data: { city_id: cityid, keyword: goodskeyword },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
     
      success: function (res){
    
        if(res.data.code==0){
          searchlist = res.data.data.goodslist;
          self.setData({
            searchlist: searchlist
          })
        }else{
          self.setData({
            searchlist: '',
            nulldata:1
          })
          // wx.showModal({
          //   title: '提示',
          //   content: res.data.msg,
          // })
        }
        
      }
    })
  },
  // 价格排序
  gettype:function(e){
    var self=this;
    var flags = self.data.flags;
    var sales = self.data.sales;
    var priceid = self.data.priceid;
    var cu_page = self.data.cu_page;
    var sortstate = self.data.sortstate;
    var newpage = 0;
    if (flags){
      self.setData({
        flags: false,
        priceid: 2,
        sales:0,
        searchlist:[],
        cu_page:1,
        sortstate:0
      })
    }else{
      self.setData({
        flags: true,
        priceid: 1,
        sales: 0,
        searchlist: [],
        cu_page:1,
        sortstate: 0
      })
    }
    
    self.sortgoods()
  },

  // 销量排序
  getsales:function(e){
    var self = this;
    var flagss = self.data.flagss;
    var sales = self.data.sales;
    var priceid = self.data.priceid;
    var cu_page = self.data.cu_page;
    var sortstate= self.data.sortstate;
    var newpage = 0;
    if (flagss) {
      self.setData({
        flagss: false,
        priceid: 0,
        sales: 2,
        searchlist: [],
        cu_page: 1,
        sortstate:0
      })
    } else {
      self.setData({
        flagss: true,
        priceid: 0,
        sales: 1,
        searchlist: [],
        cu_page: 1,
        sortstate: 0
      })
    }

    self.sortgoods()
  },
  // 综合排序
  zh_sort:function(){
    
    var flag = this.data.flag;
    if(flag){
      this.setData({
        sortstate: 1,
        flag:false,
        sales: 0,
        priceid:0
      })
    }else{
      this.setData({
        sortstate: 0,
        flag: true,
        sales: 0,
        priceid: 0
      })
    }
     
  },
  // 综合排序选项
  selectsort: function (e){
    var self=this;
    var order_type = self.data.order_type;
    var flag = self.data.flag;
    var typeid = e.currentTarget.dataset.type;
    var cu_page = self.data.cu_page;
    if(!flag){
      self.setData({
        order_type: typeid,
        flag:true,
        sortstate: 0,
        searchlist: [], 
        cu_page: 1
      })
      self.sortgoods()
    }
  
  },
  // 搜索获取关键词
  serach: function(e){
    var self=this;
    var goodskeyword = e.detail.value;
    
    self.setData({
      goodskeyword: goodskeyword
    })
  },

  // 搜索框的隐藏和显示
  searchs: function () {
    var self=this;
    var searchtype = this.data.searchtype;
    var goodskeyword = self.data.goodskeyword;
    if (searchtype==0){
      searchtype=1
    }
    self.setData({
      searchtype: searchtype,
      goodskeyword: ''
    })
  },
  disaper: function (){
    var self = this;
    var sortstate = self.data.sortstate;
    self.setData({
      sortstate:0
    })
  },
  searchgood:function(){
    
    var self = this;
    var searchtype = self.data.searchtype;
    var goodskeyword = self.data.goodskeyword;
    var cityid = self.data.cityid;
    if (searchtype==1){
      searchtype=0
    }
    self.setData({
      searchtype: searchtype
    })
    self.getsearchgoods(goodskeyword)
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
  
    // var num = that.data.num;
    // var page = that.data.page;
    var falg = that.data.falg;

    var cu_page = that.data.cu_page;
    var newpage = that.data.newpage;
    var page_size = that.data.page_size;
    var flag = that.data.flag;
    if (flag) {
      if (newpage >= page_size) {
        that.sortgoods();
      }else{
        that.setData({
          botataus: 1,
          cu_page:1
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