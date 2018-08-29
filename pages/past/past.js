//获取应用实例
const app = getApp()
Page({
  data: {
    shadowOpacity: 0.3,
    delBtnWidth: 150
  },
  onScreen: function() {
    this.resetCardStyle()
  },
  addDay: function() {
    app.addDay()
  },
  sortList: function() {
    app.sortList(this.onShow)
  },
  handleTapCard: function(e) {
    app.handleTapCard(e)
  },
  touchS: function(e) {
    console.log("touchS" + e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function(e) {
    console.log("touchM:" + e);
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var cardStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
        cardStyle = "left:0";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        cardStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          cardStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.id;
      var list = this.data.pastdayslist;
      //将拼接好的样式设置到当前item中
      list.map(v => {
        if (v.id == index) {
          v.cardStyle = cardStyle
        }
      })
      //更新列表的状态
      this.setData({
        pastdayslist: list
      });
    }
  },
  touchE: function(e) {
    console.log("touchE" + e);
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var cardStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.id;
      var list = this.data.pastdayslist;
      list.map(v => {
        if (v.id == index) {
          v.cardStyle = cardStyle
        }
      })
      //更新列表的状态
      this.setData({
        pastdayslist: list
      });
      console.log(this.data.pastdayslist)
    }
  },
  delDay: function(e) {
    console.log(e.currentTarget.dataset.id)
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.resetCardStyle()
          //从总数据删除
          app.globalData.daysList.map((v, i) => {
            if (v.id == e.currentTarget.dataset.id) {
              console.log(i)
              app.globalData.daysList.splice(i, 1)
              console.log(app.globalData.daysList)
            }
          })
          let list = that.loadAllDays()
          that.setData({
            pastdayslist: list
          })
          wx.setStorage({
            key: "days",
            data: app.globalData.daysList
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          that.resetCardStyle()
          return
        }
      }
    })
  },
  onLoad: function() {
    this.loadAllDays()
    console.log(app.globalData.daysList)
  },
  onShow: function() {
    this.loadAllDays()
    console.log(this.data.pastdayslist)
  },
  onHide: function() {
    this.resetCardStyle()
  },
  loadAllDays: function() {
    var pastDays = []
    if (app.globalData.daysList.length > 0) {
      app.globalData.daysList.map(v => {
        // console.log(v)
        if (v.diffMSeconds < 0) {
          pastDays.push(v)
        }
      })
    }
    this.setData({
      pastdayslist: pastDays
    })
    return pastDays
  },
  onPullDownRefresh: function() {
    this.onLoad()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function() {
    return {
      title: 'Big Days - 记录美好时光',
      path: '/pages/home/home',
      imageUrl: '/pages/asset/img/share.jpg'
    }
  },
  resetCardStyle: function() {
    var list = this.data.pastdayslist;
    list.map(v => {
      delete v.cardStyle
    })
    console.log(list)
    this.setData({
      pastdayslist: list
    });
    console.log(this.data.pastdayslist)
  }
})