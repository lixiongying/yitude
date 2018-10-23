// pages/myself/mycollect/mycollect.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: ['商品', '套餐'],
    winWidth:'0',
    winHeight:'0',
    currentTab: 0,
    datas:[[],[]],
    num: [1, 1],
    falg:true,
    jiekou: jiekou,
    refreshfalg:0,
    editstatus:0,
    selectstatus:0,
    editstatuss:0,
    allselectfalg:false,
    allselectfalgs: [0,0],
    sgc_ids:[],
    types: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var user_id = app.globalData.user_id;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res)
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          user_id: user_id
        });
      }
    });
    //调用收藏列表
    that.getlist(0);
    that.getlist(1);
  },

  getlist: function (types) {
    var that = this;
    var data = {};
    var types = types;
    var user_id = that.data.user_id;
    var num = that.data.num;
    
    data.user_id = user_id;
    // data.type = types;
    data.num = num[types];
    data.limit = 10;
    
    that.getShoucang(data, types,function () {
      num[types] = parseInt(num[types]) + 1;
      that.setData({
        num: num,
        falg: true,
      })
    });

  },
  //获取收藏列表
  getShoucang: function (data,types, call) {
    var data = data;
    var types = types;
    var that = this;
    var dataList = that.data.datas;
   
    if (types==0){
      // 商品收藏
      var advertiseUrls = jiekou +'/WXAPI/Personal/MyCollectGoods'
    }else{
      // 套餐收藏
      var advertiseUrls = jiekou + '/WXAPI/Personal/MyCollectPackage'
    }
    
    

    that.setData({ falg: false });
    wx.request({
      url: advertiseUrls,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:'post',
      success: function (res) {
        
        var page = res.data.data.page;
     
        if (page.cu_page > page.total_page) {
          wx.showToast({
            title: '没有更多~~',
            image: '../../../images/error.png',
            duration: 1000,
          })
        }
        if (res.data.code == 0) {
          if (types==0){
            var datas = res.data.data.goodslist;
          }else{
            var datas = res.data.data.packagelist;
          }
         
          if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
              datas[i].status = 0;
              dataList[types].push(datas[i]);
            }
            // console.log(dataList)
           
            that.setData({
              datas: dataList,
              page: page
            })
          }
        }
        if (call) {
          call();
        }
      }
    });
  },
  // 滚动框到底部
  bindDownLoad: function (e) {

    var that = this;
    var index = e.currentTarget.dataset.index;
    var falg = that.data.falg;
    var page = that.data.page;
    if (falg) {
      if (page.cu_page > page.total_page) {

      } else {
        that.getlist(index);
      }
    }
  },

  swichNav:function(e){
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  bindChange:function(e){
    var that = this;
    var currentTab = e.detail.current;
    that.setData({
      // navScrollLeft: num * 180,
      currentTab: currentTab,
   
    })

  },
  goodsdetail: function (e){

    var sg_id = e.currentTarget.dataset.collectid;
    var editstatus = this.data.editstatus;
    var editstatuss = this.data.editstatuss;
    if (editstatus == 1 || editstatuss==1){

    }else{
      wx.navigateTo({
        url: '../../index/goodsdetail/goodsdetail?sg_id=' + sg_id,
      })
    }
    
  },
  packagedetail: function (e) {

    var sp_id = e.currentTarget.dataset.collectid;
    
    wx.navigateTo({
      url: '../../index/packagedetail/index?sp_id=' + sp_id,
    })
  },
//  编辑按钮
  edit:function(){
    var self=this;
    var currentTab = self.data.currentTab;
    var editstatus = self.data.editstatus;
    var editstatuss = self.data.editstatuss;
    var datas=self.data.datas;
    var sgc_ids = self.data.sgc_ids;
   
    sgc_ids=[];
    self.setData({
      sgc_ids: sgc_ids
    })
    if (currentTab==0){
      editstatuss = 0;
      if (editstatus==0){
        editstatus = 1
       
      }else{
        editstatus = 0
      }
     
    }else{
      editstatus=0
      if (editstatuss == 0) {
        editstatuss = 1;
      } else {
        editstatuss = 0;
      }
    }
 
    self.setData({
      editstatus: editstatus,
      editstatuss: editstatuss,
      datas:datas
    })
  },
  // 单个选框的选中
  selected: function (e){
    var self = this;
    var datas = self.data.datas;
   
    var currentTab = self.data.currentTab;
    var index = e.currentTarget.dataset.index;
    var sgc_id = e.currentTarget.dataset.sgc_id;
    var sgc_ids = self.data.sgc_ids;
    var allselectfalgs = self.data.allselectfalgs;
    var types = self.data.types;
    if (datas[currentTab][index].status == 0) {
      allselectfalgs[currentTab]=1
      datas[currentTab][index].status = 1
      sgc_ids.push(sgc_id)
      self.setData({
        sgc_ids: sgc_ids,
        allselectfalgs: allselectfalgs,
        types: currentTab
      })
    } else {
      datas[currentTab][index].status = 0;
      allselectfalgs[currentTab] = 0
      for (var j = 0; j < sgc_ids.length; j++) {
        if (datas[currentTab][index].sgc_id == sgc_ids[j]) {
          sgc_ids.splice(j, 1)
        }
      }
      self.setData({
        sgc_ids: sgc_ids,
        allselectfalgs: allselectfalgs,
        types: currentTab
      })
    }
    self.setData({
      datas: datas
    })
   
   
  },
  // 全选
  allelected: function () {    
      var self = this;
      var datas = self.data.datas;
      var sgc_ids = self.data.sgc_ids;
      sgc_ids=[]
      var currentTab = self.data.currentTab;
      var allselectfalgs = self.data.allselectfalgs;
      var types = self.data.types;
      if (allselectfalgs[currentTab]==1) {
        allselectfalgs[currentTab] = 0;
        for (var i = 0; i < datas[currentTab].length; i++){
          datas[currentTab][i].status = 0;
         
        }
        sgc_ids = []
        self.setData({
          allselectfalgs: allselectfalgs,
          sgc_ids: sgc_ids
        })
      }else{
        allselectfalgs[currentTab] = 1;
          for (var i = 0; i < datas[currentTab].length; i++) {
            datas[currentTab][i].status =1;
            if (currentTab==1){             
              sgc_ids.push(datas[currentTab][i].sgc_id);  
              types=1                              
            }else{        
              sgc_ids.push(datas[currentTab][i].sgc_id);  
              types = 0    
            }
          }
          self.setData({
            allselectfalgs: allselectfalgs,
            sgc_ids: sgc_ids,
            types: types
          })
        }
    self.setData({
      datas: datas
    })
    

  },
  // 删除收藏
  deletecollect: function () {
    var self=this;
    var user_id = self.data.user_id;
    var sgc_ids = self.data.sgc_ids;
    var types=self.data.types;
   
    if (sgc_ids.length!=0){
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: function (sm) {
          if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
            wx.request({
              url: jiekou + '/WXAPI/Personal/BatchCancelCollect',
              data: { user_id: user_id, sgc_ids: sgc_ids, types: types },
              method: 'post',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                if (res.data.code == 0) {
                  wx.showToast({
                    title: res.data.msg,
                  })
                  self.setData({
                    datas: [[], []],
                    num: [1, 1],
                    editstatus: 0,
                    editstatuss: 0,
                  });

                  self.getlist(0)
                  self.getlist(1)
                }
              },
            })
            
          } else if (sm.cancel) {
            
          }
        }
      })

       
    }else{
      wx.showModal({
        title: '提示',
        content: '没有可删除的商品',
      })
      self.setData({
    
        editstatus: 0,
        editstatuss: 0,
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
    var that=this;
    var refreshfalg = that.data.refreshfalg;
    var datas=that.data.datas;
    datas=[[],[]]
    var num=[1, 1];
    if (refreshfalg==1){
      that.setData({
        num: num,
        datas: datas
      })
    that.getlist(0);
    that.getlist(1);
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})