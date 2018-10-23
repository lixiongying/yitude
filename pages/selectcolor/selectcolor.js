// pages/selectcolor/selectcolor.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    user_id: '',
    background: '',
    selectcolor: [],
    hatecolor: [],
    type: 1,
    accolor: '',
    share_pic: '',
    relayflag: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    var user_id = app.globalData.user_id;
    _this.getlistcolor();
    this.setData({
      user_id: user_id
    })
  },
  getcolor: function(e) {
    //选中颜色的id
    var colorid = e.currentTarget.dataset.id;
    //点击的下标
    var index = e.currentTarget.dataset.index;
    //喜欢的颜色
    var selectcolor = this.data.selectcolor;
    //讨厌的颜色
    var hatecolor = this.data.hatecolor;
    //1喜欢 否则讨厌
    var type = this.data.type;
    var _this = this;
    //所有颜色
    var background = this.data.background;
    var flag = true;
    //喜欢的颜色
    if (type == 1) {
      if (background[index].status == 0) {
        if (selectcolor.length < 10) {
          background[index].status = 1;
          selectcolor.push(index);
        } else {
          wx.showToast({
            title: '你已选中十种颜色',
          })
        }
      } else if (background[index].status == 1) {
        background[index].status = 0;
        for (let i = 0; i < selectcolor.length; i++) {
          if (selectcolor[i] == index) {
            selectcolor.splice(i, 1);
          }
        }
      }
      _this.setData({
        background: background,
        selectcolor: selectcolor,
      })
    }else if (type == 2) {
      if (background[index].status == 0) {
        if (hatecolor.length < 5) {
          background[index].status = 2;
          hatecolor.push(index);
        } else {
          wx.showToast({
            title: '你已选中五种颜色',
          })
        }
      } else if (background[index].status == 2) {
        background[index].status = 0;
        for (let i = 0; i < hatecolor.length; i++) {
          if (hatecolor[i] == index) {
            hatecolor.splice(i, 1);
          }
        }
      }
      _this.setData({
        background: background,
        hatecolor: hatecolor,
      })
    }
  },
  // 不喜欢的颜色删除
  deletecolor: function(e) {
    var _this = this;
    //总颜色的下标
    var curid = e.currentTarget.dataset.id;
    //选中颜色的下标
    var index = e.currentTarget.dataset.index;
    var hatecolor = _this.data.hatecolor;
    var background = _this.data.background;
    hatecolor.splice(index, 1);
    background[curid].status = 0;
    _this.setData({
      background: background,
      hatecolor: hatecolor
    })
  },
  // 喜欢的颜色删除
  deletecolors: function(e) {
    var _this = this;
    //总颜色的下标
    var curid = e.currentTarget.dataset.id;
    //选中颜色的下标
    var index = e.currentTarget.dataset.index;
    var selectcolor = _this.data.selectcolor;
    var background = _this.data.background;
    selectcolor.splice(index,1);
    background[curid].status = 0;
    _this.setData({
      background: background,
      selectcolor: selectcolor
    })
  },
  like: function(e) {
    var _this = this;
    var type = e.currentTarget.dataset.type;
    _this.setData({
      type: type
    })
  },
  next: function() {
    var that = this;
    var selectcolor = this.data.selectcolor;
    var hatecolor = this.data.hatecolor;
    var len = selectcolor.length;
    var lens = hatecolor.length;
    var user_id = that.data.user_id;
    var background = that.data.background;
    var newlove = [];
    var newhate = [];
    if (user_id){
      if (len != 10 || lens != 5) {
        wx.showModal({
          title: '温馨提示',
          content: '请选择十种喜欢或五种不喜欢的颜色哦',
        })
      } else {
        for (let i = 0; i < selectcolor.length; i++){
          newlove.push(background[selectcolor[i]].gc_id);
        }
        for (let i = 0; i < hatecolor.length; i++) {
          newhate.push(background[hatecolor[i]].gc_id);
        }
        var love = newlove.join(',');
        var heat = newhate.join(',');
        var urls = jiekou + '/WXAPI/Game/keepColor';
        wx.showLoading({
          title: '加载中',
          mask: true,
        })
        wx.request({
          url: urls,
          data: {
            user_id: user_id,
            love: love,
            hate: heat
          },
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            wx.hideLoading();
            if (res.data.code == 0) {
              var ids = res.data.data.gu_id;
              
              var background = that.data.background;
              for (let i = 0; i < background.length; i++) {
                background[i].status = 0;
              }
              that.setData({
                selectcolor: [],
                hatecolor:[],
                background: background,
              })
              wx.navigateTo({
                url: './playinfo/index?ids=' + ids,
              })
            }else {
              wx: wx.showModal({
                title: '温馨提示',
                content: res.data.msg,
                showCancel: true,
              })
            }
          }
        });
        
      }
    }else {
      wx:wx.showModal({
        title: '温馨提示',
        content: '请前往我的登录后继续操作',
        showCancel: true,
      })
    }
  },
  getlistcolor: function() {
    var that = this;
    var user_id = that.data.user_id;
    var urls = jiekou + '/WXAPI/Game/getColor';
    wx.request({
      url: urls,
      data: {
        user_id: user_id
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        wx.stopPullDownRefresh()
        if (res.data.code == 0) {
          var data = res.data.data;
          var colors = data.color;
          for(let i = 0; i < colors.length; i++) {
            colors[i].status = 0;
          }
          that.setData({
            background: colors,
            share_pic: data.share_pic
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var _this = this;
    var user_id = app.globalData.user_id;
    this.setData({
      user_id: user_id,
      selectcolor: [],
      hatecolor: [],
      type: 1,
      accolor: '',
    })
    _this.getlistcolor();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  Ikonw: function() {
    this.setData({
      relayflag: 0
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    var user_id = that.data.user_id;
    // console.log(user_id)
    var share_pic = this.data.share_pic;
    return {
      title: '易涂得（邀请一起玩色彩游戏）',
      path: '/pages/index/index?scene=' + user_id +',2',
      imageUrl: jiekou + share_pic,
      success:function(res){
        wx.request({
          url: jiekou+'/WXAPI/ClockIn/shareFlag',
          data: { user_id: user_id},
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success:function(res){
     
              if(res.data.code==0){

                var relaydata=res.data.data;
                var percent = parseInt(res.data.data.percent * 100);
               
                var totalgold = parseInt(res.data.data.now_gold) + parseInt(res.data.data.maybe_gold); 
                setTimeout(function(){
                  that.setData({
                    relaydata: relaydata,
                    relayflag: 1,
                    percent: percent,
                    totalgold: totalgold
                  })
                },600)
               
              }else{
                var relaydata = res.data.msg
                setTimeout(function () {
                  that.setData({
                    relaydata: relaydata,
                    relayflag: 1,
                    relaynone:0
                  })
                }, 600)
              }
          }
        })
    
      
      }
    }
  }
})