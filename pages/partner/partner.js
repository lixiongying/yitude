// pages/member/referrals/index.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nums: 0,
    allnum: 0,
    allnumber:0, 
    list: '',
    jiekou: jiekou,
    user_id: '',
    num: 1,
    flag: true,
    datas: [],
    page: {},
    maxnum: 10,
    pagelist: 10,
    relayflag:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_id = app.globalData.user_id;
    this.setData({
      user_id: user_id
    })
    this.partnerindex();
    
    //获取收益人
    this.userlist();
  },
  //进入合伙人升级
  linkupgrade: function(){
    wx.navigateTo({
      url: './upgrade/index',
    })
  },
  // 跳到分享优惠券
  coupon: function () {
    wx.navigateTo({
      url: './coupon/index',
    })
  },
  //获取查看当前合伙人状态;
  partnerindex: function(){
    var that = this;
    var user_id = that.data.user_id;
    var urls = jiekou + '/WXAPI/Personal/partnerindex';
    wx.request({
      url: urls,
      data: {
        user_id: user_id
      },
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.code == 0) {
          var data = res.data.data;
          that.setData({
            list: data,
            nums: data.onecount,
            allnum: data.threecount,
            allnumber: data.zongcount,
            myordercount:data.myordercount
          });
          that.getInfos();
        } else {
          wx: wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: true,
            success: function (res) {

            }
          })
          // 页面渲染完成  
          this.getInfos();
        }
      }
    });
  },
  // 跳转到我的订单信息
  orderdetail: function (){
     wx.navigateTo({
       url: './constructinfo/constructinfo',
     })
  },
  //获取收益下线
  userlist: function () {
    var that = this;
    var user_id = that.data.user_id;
    var num = that.data.num;
    var flag = that.data.flag;
    var pagelist = that.data.pagelist;
    if (!flag) {
      return;
    }
    that.setData({
      flag: false
    })
    wx.showLoading({
      title: '正在加载',
    })
    var urls = jiekou + '/WXAPI/Personal/userlist';
    wx.request({
      url: urls,
      data: {
        user_id: user_id,
        num: num,
        limit: pagelist,
      },
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        wx.hideLoading();
        num++;
        that.setData({
          flag: true,
          num: num
        })
        if (res.data.code == 0) {
          var data = res.data.data.userlist;
          var datas = that.data.datas;
          var maxnum = 0;
          if (data.length > 0) {
            maxnum = data.length;
            for(let i = 0; i < data.length; i++) {
              datas.push(data[i]);
            }
          }
          that.setData({
            datas: datas,
            maxnum: maxnum,
          })
        }
      }
    });
  },
  //画图
  getInfos: function () {
    var that = this;
    //使用wx.createContext获取绘图上下文context  
    var context = wx.createContext();
    //定义角度
    var nums = that.data.nums;
    var allnum = that.data.allnum;
    var allnumber = that.data.allnumber;
    //计算弧度
    var degs = nums / allnumber * 360;
    //    数据源  
    var array = [360, degs, 360];
    var colors = ["#6c45d5","#feea3d", "#ffffff"];
    var total = 0;
    //    定义圆心坐标  
    var point = { x: 70, y: 70 };
    //    定义半径大小  
    var radius = 70;
    /*    循环遍历所有的pie */
    for (var i = 0; i < array.length; i++) {
      context.beginPath();
      //      起点弧度  
      var start = 0;
      //      1.先做第一个pie  
      //      2.画一条弧，并填充成三角饼pie，前2个参数确定圆心，第3参数为半径，第4参数起始旋转弧度数，第5参数本次扫过的弧度数，第6个参数为时针方向-false为顺时针  
      if (i == 2) {
        context.arc(point.x, point.y, 50, start, array[i] * Math.PI / 180, false);
        //      3.连线回圆心  
        context.lineTo(point.x, point.y);
        //      4.填充样式  
        context.setFillStyle(colors[i]);
        //      5.填充动作  
        context.fill();
        context.closePath();
      } else {
        context.arc(point.x, point.y, radius, start, array[i] * Math.PI / 180, false);
        //      3.连线回圆心  
        context.lineTo(point.x, point.y);
        //      4.填充样式  
        context.setFillStyle(colors[i]);
        //      5.填充动作  
        context.fill();
        context.closePath();
      }
    }
    context.beginPath();
    //      4.填充样式  
    context.setFillStyle("#ec6d56");
    context.setFontSize(30);
    context.setTextAlign('center');
    context.fillText(allnumber, 70, 85);
    //      5.填充动作  
    context.fill();
    context.closePath();
    //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为  
    wx.drawCanvas({
      //指定canvasId,canvas 组件的唯一标识符  
      canvasId: 'mypie',
      actions: context.getActions()
    });
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
    var user_id = app.globalData.user_id;
    this.setData({
      user_id: user_id
    });
    this.partnerindex();

    //获取收益人
    this.userlist();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  Ikonw: function () {
    this.setData({
      relayflag: 0
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var user_id = that.data.user_id;
    var list = that.data.list;
    var share_pic = list.partner_logo;
    return {
      title: '易涂得（邀请一起成为合伙人）',
      path: '/pages/index/index?scene=' + user_id + ',4',
      imageUrl: jiekou + share_pic,
      success: function (res) {
        wx.request({
          url: jiekou + '/WXAPI/ClockIn/shareFlag',
          data: { user_id: user_id },
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {

            if (res.data.code == 0) {

              var relaydata = res.data.data;
              var percent = parseInt(res.data.data.percent * 100);

              var totalgold = parseInt(res.data.data.now_gold) + parseInt(res.data.data.maybe_gold);
              setTimeout(function () {
                that.setData({
                  relaydata: relaydata,
                  relayflag: 1,
                  percent: percent,
                  totalgold: totalgold
                })
              }, 600)

            } else {
              var relaydata = res.data.msg
              setTimeout(function () {
                that.setData({
                  relaydata: relaydata,
                  relayflag: 1,
                  relaynone: 0
                })
              }, 600)
            }
          }
        })


      }
    }
  }
})