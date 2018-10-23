// pages/myself/ordercomment/ordercomment.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiekou: jiekou,
    comment: null,
    nums: 5,
    index:5,
    normalSrc: '../../../images/taocanpingjia_shigongyuanpingfen_noseleted.png',
    selectedSrc: '../../../images/taocanpingjia_shigongyuanpingfen_seleted.png',
    key: 0,//评分
    image_photo: [],
    newNums: 5,
    //当前上传第几张图片 ，默认下标为0开始
    uploadImgCount: 0,
    //上传后返回新图片数组
    newImg: [],
    pic: '../../images/add.png',
    comlen: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var packageid = options.packageid;

    this.setData({
      packageid: packageid
    })
    this.getdetail(packageid)
  },
  getstar: function (e) {
    var self=this;
    var index = e.currentTarget.dataset.index;
    self.setData({
      index: index
    })
  },
  getdetail: function (packageid) {
    var packageid = packageid;
    var user_id = app.globalData.user_id;
  
    var self = this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jiekou + '/WXAPI/Orderpackage/ComPackIndex',
      data: { user_id: 1, order_package_id: 18 },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res)
        wx.hideLoading()
        if (res.data.code == 0) {
          self.setData({
            datas: res.data.data.order_package,
           
          })
        }

      }
    })
  },
  commet: function (e) {
    var comment = e.detail.value;
    var self = this;
    var comlen = comment.length;
    if (comlen > 200) {
      comlen = 200;
    }

    self.setData({
      comment: comment,
      comlen: comlen
    })

  },
  
  //选择图片或者拍照
  choice: function () {

    var that = this;
    var newNums = that.data.newNums;
    var nums = that.data.nums;
    if (newNums <= 0) {
      wx.showModal({
        title: '提示',
        content: '最多上传5张图片',
        showCancel: false,
        success: function (res) { }
      })
    } else {
      wx.chooseImage({
        count: nums, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          var image_photo = that.data.image_photo;
          var newNums = that.data.newNums;
          if (newNums < tempFilePaths.length) {
            wx.showModal({
              title: '提示',
              content: '最多上传五张',
            })

          } else {
            for (var i = 0; i < tempFilePaths.length; i++) {
              image_photo.push(tempFilePaths[i])
            }
          }

          var newNum = nums - image_photo.length;

          that.setData({
            // nums: newNums,
            newNums: newNum,
            textHidden: true,
            image_photo: image_photo,
            photoHidden: false
          })

        }
      })
    }
  },
  //上传单张图片
  uploadPhoto: function (uploadImgCount, call) {
    var that = this;
    var uploadImgCount = uploadImgCount;
    var uploadImgUrls = jiekou + '/WXAPI/Index/up_img';
    var image_photo = that.data.image_photo;
    wx.uploadFile({
      url: uploadImgUrls,
      filePath: image_photo[uploadImgCount],
      name: 'file',
      formData: {
        'imgIndex': uploadImgCount
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        console.log(res)
        uploadImgCount++;
        var newImg = that.data.newImg;
        newImg.push(JSON.parse(res.data).data)
       
        that.setData({
          uploadImgCount: uploadImgCount,
          newImg: newImg,
        })
        //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }
        //如果是最后一张,则隐藏等待中  
        if (uploadImgCount == image_photo.length) {
          wx.hideToast();
          var newImgstr = that.data.newImg;
          var imgss = JSON.stringify(newImgstr);
          // var newImgstr = newImg.join(',');
          that.sendInfo(imgss);
        } else {
          if (call) {
            call();
          }
        }
      },
      fail: function (res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传图片失败',
          showCancel: false,
          success: function (res) { }
        })
      }
    });

  },
  sendInfoBtn: function () {

    var that = this;
    var image_photo = that.data.image_photo;
    if (image_photo.length > 0) {
      var uploadImgCount = that.data.uploadImgCount;
      that.uploadPhoto(uploadImgCount, function () {
        that.sendInfoBtn();
      });
    } else {
      that.sendInfo('');
    }
  },
  //提交数据
  sendInfo: function (imgs) {
    var that = this;
    //获取图片数组
    var imgs = imgs;
    var score = that.data.index;
  
    // var imgstr = imgs.split(',');
    //获取备注信息
    var comment = that.data.comment;
    var packageid = that.data.packageid;
    var user_id = app.globalData.user_id;
    var data = {
      content: comment,
      imgs: imgs,
      order_package_id: packageid,
      user_id: user_id,
      score: score
    }
    var pjUrl = jiekou + '/WXAPI/Orderpackage/PublishConstruc';
    if (comment == '' || comment == undefined || comment == null && imgs.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入要评论的内容',
      })
    } else {
      wx.request({
        url: pjUrl,
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {

          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.msg
            })
            setTimeout(function () {
              wx.hideToast();
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]  //上一个页面
              prevPage.setData({
                showflag:1
              })
              wx.navigateBack()
            }, 600)

          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: true,
            })
          }
        }
      });

    }


  },

  // 预览图片
  onPreviewTap: function (e) {

    if (this.isDeleteAction) return;
    const dataset = e.currentTarget.dataset, index = dataset.index;
    // console.log(index)
    wx.previewImage({
      current: this.data.image_photo[index],
      urls: this.data.image_photo,
    });
  },
  /**
   * 删除选择的图片
   */
  onDeleteImgTap: function (e) {
    var self = this;
    var newNums = self.data.newNums;
    this.isDeleteAction = true;
    const dataset = e.currentTarget.dataset, index = dataset.index;

    wx.showActionSheet({
      itemList: ['删除'],
      success: (res) => {

        if (res.tapIndex === 0) {
          const image_photo = this.data.image_photo;

          image_photo.splice(index, 1);
          newNums = newNums + 1;
          console.log(newNums)
          this.setData({
            image_photo: image_photo,
            newNums: newNums
          });
        }
      }, complete: () => {
        this.isDeleteAction = false;
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