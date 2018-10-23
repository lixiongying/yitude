// pages/myself/browse/browse.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: '0',
    winHeight: '0',
    datas: [],
    num: 1,
    jiekou: jiekou,
    user_id: '',
    editstatus:0,
    sgc_ids:[],
    allselectfalgs:0
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
    })
    this.getbrowse();
  },
  getbrowse: function () {
    var self=this;
    var user_id = app.globalData.user_id;
   
    var num = self.data.num;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou+'/WXAPI/Personal/footprintList',
      data: { user_id: user_id, num: num, limit:5},
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        wx.hideLoading()
        if(res.data.code==0){
          var datas = self.data.datas;
          var brolist = res.data.data.foorprintlist;
          if (brolist.length > 0) {
            for (var i = 0; i < brolist.length;i++){
              datas.push(brolist[i])
                for (var j = 0; j < brolist[i].length;j++){
                  
                  brolist[i][j].status=0;
                  
                }
              
              }
          }
          num = parseInt(num) + 1;
          self.setData({
            datas: datas,
            num: num,
            page:res.data.data.page
          })
   
        }
        
      
      },
    })
  },

  //  编辑按钮
  edit: function () {
    var self = this;

    var editstatus = self.data.editstatus;
    var datas = self.data.datas;
    var sgc_ids = self.data.sgc_ids;

    sgc_ids = [];
    self.setData({
      sgc_ids: sgc_ids
    })
    
    if (editstatus == 0) {
      editstatus = 1

    } else {
      editstatus = 0
    }
  self.setData({
      editstatus: editstatus,
      datas: datas
    })
  },
  // 单个选框的选中
  selected: function (e) {
    var self = this;
    var datas = self.data.datas;
    var indexs = e.currentTarget.dataset.indexs;  
    var index = e.currentTarget.dataset.index;
    var sgc_id = e.currentTarget.dataset.sgc_id;
    var sgc_ids = self.data.sgc_ids;
   
    var allselectfalgs = self.data.allselectfalgs;
    if (datas[indexs][index].status == 0){
      datas[indexs][index].status = 1;
      allselectfalgs = 0;
      sgc_ids.push(sgc_id)
      self.setData({
        sgc_ids: sgc_ids,
        allselectfalgs: allselectfalgs,
      })
    } else{
      allselectfalgs = 1;
      datas[indexs][index].status =0;
      for (var j = 0; j < sgc_ids.length; j++) {
          if (datas[indexs][index].sgc_id == sgc_ids[j]) {
            sgc_ids.splice(j, 1)
          }
        }
      self.setData({
        sgc_ids: sgc_ids
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
    sgc_ids = []
    var allselectfalgs = self.data.allselectfalgs;
 
    if (allselectfalgs == 1) {
      allselectfalgs = 0;
      for (var i = 0; i < datas.length; i++) {
        for(var j=0;j<datas[i].length;j++){
          datas[i][j].status = 0;
        }

      }
      sgc_ids = []
      self.setData({
        allselectfalgs: allselectfalgs,
        sgc_ids: sgc_ids
      })
    } else {
      allselectfalgs = 1;
      for (var i = 0; i < datas.length; i++) {
        
        for (var j = 0; j < datas[i].length; j++) {
           datas[i][j].status = 1;
           sgc_ids.push(datas[i][j].sgc_id);
        }
        
      }
      self.setData({
        allselectfalgs: allselectfalgs,
        sgc_ids: sgc_ids,
       
      })
    }
    self.setData({
      datas: datas
    })


  },
  deletebrowe:function(){
    var self = this;
    var user_id = self.data.user_id;
    var sgc_ids = self.data.sgc_ids;

    if (sgc_ids.length != 0) {
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: function (sm) {
          if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
            wx.request({
              url: jiekou + '/WXAPI/Personal/BatchCancelFoorprint',
              data: { user_id: user_id, sgc_ids: sgc_ids},
              method: 'post',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                console.log(res)
                if (res.data.code == 0) {
                  wx.showToast({
                    title: res.data.msg,
                  })
                  self.setData({
                    datas: [],
                    num: 1,
                    editstatus: 0
                  
                  });

                  self.getbrowse()
               
                }
              },
            })

          } else if (sm.cancel) {

          }
        }
      })


    } else {
      wx.showModal({
        title: '提示',
        content: '没有可删除的商品',
      })
      self.setData({

        editstatus: 0,
 
      });
    }

  },
  // 跳到详情
  godetail: function (e) {
    
    var sgc_id = e.currentTarget.dataset.collectid;
    var type = e.currentTarget.dataset.type;
    
    if(type==0){
      wx.navigateTo({
        url: '../../index/goodsdetail/goodsdetail?sg_id=' + sgc_id,
      })
    }else{
      wx.navigateTo({
        url: '../../index/packagedetail/index?sp_id=' + sgc_id,
      })
    }
    
  },
  // 滚动框到底部
  bindDownLoad: function (e) {

    var that = this;
    var index = e.currentTarget.dataset.index;
    var falg = that.data.falg;
    var page = that.data.page;
  
    if (page.cu_page > page.total_page) {

    } else {
      that.getbrowse()
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