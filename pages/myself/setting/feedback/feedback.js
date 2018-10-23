// pages/myself/setting/feedback/feedback.js
const app = getApp()
var jiekou = app.globalData.jiekou;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pictures:[],
    jiekou:jiekou,
    datas: {},
    nums: 9,
    // 图片数组
    image_photo: [],
    // 还剩多少张可上传
    newNums: 9,
    //当前上传第几张图片 ，默认下标为0开始
    uploadImgCount: 0,
    //上传后返回新图片数组
    newImg: [],
    pic: '../../images/add.png',
    comlen: 0,
    value:'',
    phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },
  getsuggest: function (e) {
    var value=e.detail.value;
    this.setData({
      value: value
    })
  },
  getphone:function(e){
    var value = e.detail.value;
    this.setData({
      phone: value
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
              content: '最多上传九张',
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
        // console.log(res)
        uploadImgCount++;
        var newImg = that.data.newImg;
        newImg.push(JSON.parse(res.data).data)
        // console.log(newImg)
        that.setData({
          uploadImgCount: uploadImgCount,
          newImg: newImg,
        })
        //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }
        //如果是最后一张,则隐藏等待中  
        if (uploadImgCount == image_photo.length) {
          wx.hideToast();
          // var newImgstr = newImg.join(',');
          var newImgstr = that.data.newImg;
          var imgss = JSON.stringify(newImgstr);
          // console.log(imgss);
          // console.log(Array.isArray(imgss));
          // return;
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
        // that.setData({
        //   uploadImgCount:0
        // })
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
   
    //获取备注信息
    // var imgstr=imgs.split(',');
    var value = that.data.value;
    var phone = that.data.phone;
    var user_id = app.globalData.user_id;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    // console.log(JSON.stringify(imgstr))
    var data = {
      content: value,
      imgs: imgs,
      contact: phone,
      user_id: user_id,
    }
    var yjfkUrl = jiekou + '/WXAPI/Personal/feedback';
    wx.showLoading({
      title: '正在加载',
    })
    if (imgs.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入要评论的内容',
      })
    }else if (phone == '' || phone == undefined || phone==null){
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
      })
      that.setData({
        nums: 9,
        // 图片数组
        image_photo: [],
        // 还剩多少张可上传
        newNums: 9,
        //当前上传第几张图片 ，默认下标为0开始
        uploadImgCount: 0,
        //上传后返回新图片数组
        newImg: [],
      })
     
    }else if (!myreg.test(phone)){
      wx.showModal({
        title: '提示',
        content: '手机号码格式有误',
      })
    }else {
      wx.hideLoading()
      wx.request({
        url: yjfkUrl,
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
              wx.hideToast()
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