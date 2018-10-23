// pages/lifemethod/lifemethod.js
const app = getApp();
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    user_id: '',
    datas: '',
    daylist: '',
    life: {},
    cards: {},
    // 邀请卡状态
    none: 0,
    // 打卡成功状态
    card: 0,
    //打卡成功返回获取金币数量
    jinbi: 0,
    animation: '',
    rotate: 0,
    pic_id: '',
    // 打卡成功后弹框
    relayflag:0,
    relaydata:'',
    relaynone:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var user_id = app.globalData.user_id;
    this.setData({
      user_id: user_id
    });
    this.getlifeinfo();
    this.getsevenday();
    this.getinviteCard();
    this.getopenstatus();
    this.animation = wx.createAnimation();
  },
  //跳转打卡规则
  linkreult: function() {
    wx.navigateTo({
      url: './reult/index',
    })
  },
  all: function() {
    var rotate = this.data.rotate;
    if (rotate == 0) {
      this.animation.rotateY(360).step();
      this.setData({
        animation: this.animation.export(),
        rotate: 360
      })
    } else {
      this.animation.rotateY(0).step();
      this.setData({
        animation: this.animation.export(),
        rotate: 0
      })
    }

  },
  //点击补卡
  fillClockIn: function(e) {
    var that = this;
    var indexs = e.currentTarget.dataset.index;
    var types = e.currentTarget.dataset.type;
    var user_id = that.data.user_id;
    var daylist = that.data.daylist;
    if (indexs == 9) {
      var days = e.currentTarget.dataset.day;
    } else {
      var days = daylist[indexs].day;
    }
    var urls = jiekou + '/WXAPI/ClockIn/fillClockIn';
    wx: wx.showModal({
      title: '温馨提示',
      content: '补卡需要花费5个金币，是否补卡？',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在补卡',
          })
          wx.request({
            url: urls,
            data: {
              user_id: user_id,
              day: days,
              type: types
            },
            method: 'post',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              wx.hideLoading();
              if (res.data.code == 0) {
                that.getlifeinfo();
                that.getopenstatus();
              } else {
                wx: wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: true,
                  success: function(res) {

                  }
                })
              }
            }
          });
        }
      },
    })
  },
  //获取邀请卡数据
  getinviteCard: function() {
    var that = this;
    var user_id = that.data.user_id;
    var urls = jiekou + '/WXAPI/ClockIn/inviteCard';
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
        if (res.data.code == 0) {
          var data = res.data.data;
          that.setData({
            cards: data,
            pic_id: data.pic_id
          })
        }
      }
    });
  },
  //获取生活方式数据
  getlifeinfo: function() {
    var that = this;
    var user_id = that.data.user_id;
    var urls = jiekou + '/WXAPI/ClockIn/configInfo';
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
        if (res.data.code == 0) {
          var data = res.data.data;
          that.setData({
            life: data,
          })
        }
      }
    });
  },
  //点击下载图片
  uploadimg: function() {
    var that = this;
    var pic_id = that.data.pic_id;
    var user_id = that.data.user_id;
    var urls = jiekou + '/WXAPI/ClockIn/downloadImages';
    wx.showLoading({
      title: '正在下载',
    })
    wx.request({
      url: urls,
      data: {
        user_id: user_id,
        pic_id: pic_id
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          var data = jiekou + res.data.data.imageurl;
          that.hendupload(data);
        } else {
          wx: wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: true,
          })
        }
      }
    });
  },
  //下载图片到本地
  hendupload: function(url) {
    var urls = url;
    wx.downloadFile({
      url: urls,
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(data) {
            if (data.errMsg === "saveImageToPhotosAlbum:ok") {
              wx:wx.showModal({
                title: '温馨提示',
                content: '图片保存成功',
                showCancel: true,
              })
            }
          },
          fail: function(err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx: wx.showModal({
                      title: '温馨提示',
                      content: '获取权限成功，再次点击图片保存到相册。',
                      showCancel: true,
                    })
                  } else {
                    wx: wx.showModal({
                      title: '温馨提示',
                      content: '获取权限失败，无法正常使用保存图片到本地。',
                      showCancel: true,
                    })
                  }
                }
              })
            }
          }
        })
        // wx.saveFile({
        //   tempFilePath: res.tempFilePath,
        //   success: function (res) {
        //     wx:wx.showModal({
        //       title: '温馨提示',
        //       content: '图片保存成功，路径为' + res.savedFilePath,
        //       showCancel: true,
        //     })
        //   }
        // })
      }
    });
  },
  //获取当前七天的打卡状态
  getopenstatus: function() {
    var that = this;
    var user_id = that.data.user_id;
    var urls = jiekou + '/WXAPI/ClockIn/checkNow';
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
        if (res.data.code == 0) {
          var data = res.data.data;
          that.setData({
            datas: data,
          })
        }
      }
    });
  },

  //获取本周七天日期
  getsevenday: function() {
    var that = this;
    var user_id = that.data.user_id;
    var urls = jiekou + '/WXAPI/ClockIn/getWeekDay';
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
        if (res.data.code == 0) {
          var data = res.data.data;
          that.setData({
            daylist: data,
          })
        }
      }
    });
  },
  //打卡
  sendopencard: function() {
    var that = this;
    var user_id = that.data.user_id;
    var urls = jiekou + '/WXAPI/ClockIn/clockIn';
    wx.request({
      url: urls,
      data: {
        user_id:user_id
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
      
        if (res.data.code == 0) {
          var relaydata = res.data.data;
          var percent = parseInt(res.data.data.percent * 100);
          var totalgold = parseInt(res.data.data.now_gold) + parseInt(res.data.data.maybe_gold);
          if (relaydata.gold>0){
        
            that.setData({
              relayflag: 1,
              relaydata: relaydata,
              cardsflag: 1,
              percent: percent,
              totalgold: totalgold,
              // jinbi: res.data.data.gold
            })
          }else{
           
            that.setData({
              relayflag: 1,
              relaydata: '今日获得金币数已上限',
              relaynone: 0,
              cardsflag: 1,
            })
          }
          
          that.getlifeinfo();
          that.getopenstatus();
        } else {
          // wx: wx.showModal({
          //   title: '提示',
          //   content: res.data.msg,
          //   showCancel: true,
          //   success: function(res) {

          //   }
          // })
          var relaydata = res.data.msg
          setTimeout(function () {
            that.setData({
              relaydata: relaydata,
              relayflag: 1,
              relaynone: 0,
              cardsflag: 1,
            })
          }, 600)
        }
      }
    });
  },
  //跳转好友pk
  linkfriendpk: function() {
    wx.navigateTo({
      url: './friendpk/index',
    })
  },
  //显示邀请卡
  showModel: function() {
    this.setData({
      none: 1
    })
    this.all();
    this.getinviteCard();
  },
  //隐藏邀请卡
  hideModel: function() {
    this.setData({
      none: 0
    })
  },
  //关闭打卡
  closeModel: function() {
    this.setData({
      card: 0
    })
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
    var user_id = app.globalData.user_id;
    this.setData({
      user_id: user_id
    });
    this.getlifeinfo();
    this.getsevenday();
    this.getopenstatus();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  Ikonw: function () {
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
    var cards = that.data.cards;
    var share_pic = cards.share_pic;
    return {
      title: '易涂得（邀请一起打卡赚金币）',
      path: '/pages/index/index?scene=' + user_id + ',3',
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
                  totalgold: totalgold,
                  cardsflag:0
                })
              }, 600)

            } else {
              var relaydata = res.data.msg
              setTimeout(function () {
                that.setData({
                  relaydata: relaydata,
                  relayflag: 1,
                  relaynone: 0,
                  cardsflag: 0
                })
              }, 600)
            }
          }
        })


      }
    }
  }
})