// pages/addDay/addDay.js
const app = getApp()
Page({
  data: {
    namePlaceholder: "妈妈的生日🎂",
    notePlaceholder: "✏备注",
    checkedColor: "#ff9e24",
    shadowOpacity: 0.3,
    colorList: ["#ee4d5c", "#dc595f", "#f2a145", "#ff9e24", "#2ba955", "#58a65b", "#548fe9", "#3267f5", "#6751a3", "#444756", "#09080e"]
  },
  bindNameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
    app.globalData.tempDay = this.data
  },
  bindSelectColor: function(e) {
    this.setData({
      checkedColor: e.currentTarget.dataset.color,
      checkedColorRgbArr: app.hexToRgbArr(e.currentTarget.dataset.color, this.data.shadowOpacity)
    })
    app.globalData.tempDay = this.data
    console.log(this.data)
  },
  bindDateChange: function(e) {
    //当前日期
    let currDate = app.getcurrDate()
    //当前日期的毫秒数
    let CurrDateMSeconds = app.getCurrDateMSeconds()
    //用户选择的日期的毫秒数
    var selectedDateMSeconds = (new Date(e.detail.value)).getTime();
    //比较两个日期的毫秒差值，返回对象
    let checkddays = app.checkCurrDate(CurrDateMSeconds, selectedDateMSeconds)

    //选择的日期和当前日期的毫秒数差值
    this.setData({
      ...checkddays,
      mSecondsSelected: selectedDateMSeconds,
      date: e.detail.value,
    })
    app.globalData.tempDay = this.data
  },
  bindTextAreaBlur: function(e) {
    console.log(e.detail.value)
    this.setData({
      note: e.detail.value
    })
    app.globalData.tempDay = this.data
  },
  bindTextAreaChange: function(e) {
    this.setData({
      note: e.detail.value
    })
    app.globalData.tempDay = this.data
  },
  setMoreColor: function() {
    wx.navigateTo({
      url: '../color/color'
    })
  },
  save: function(e) {
    if (!this.data.date) {
      wx.showToast({
        title: '请选择一个日期',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    wx.showLoading({
      title: '正在保存',
    })
    if (!this.data.name) {
      this.setData({
        name: this.data.namePlaceholder
      })
    }
    if (!this.data.note) {
      this.setData({
        note: ""
      })
    }
    var savedays = app.globalData.daysList ? app.globalData.daysList : []
    console.log(savedays.length)
    if (app.globalData.editDay) {
      savedays.map((v, i) => {
        if (v.id == app.globalData.editDay) {
          var {
            id,
            name,
            date,
            note,
            msg,
            mSecondsSelected,
            diffnum,
            diffMSeconds,
            datatag,
            checkedColor,
            checkedColorRgbArr
          } = this.data
          savedays[i] = {
            id,
            name,
            date,
            note,
            msg,
            mSecondsSelected,
            diffnum,
            diffMSeconds,
            datatag,
            checkedColor,
            checkedColorRgbArr
          }
        }
      })
    } else {
      this.setData({
        id: new Date().getTime()
      })
      var {
        id,
        name,
        date,
        note,
        msg,
        mSecondsSelected,
        diffnum,
        diffMSeconds,
        datatag,
        checkedColor,
        checkedColorRgbArr
      } = this.data
      savedays.push({
        id,
        name,
        date,
        note,
        msg,
        mSecondsSelected,
        diffnum,
        diffMSeconds,
        datatag,
        checkedColor,
        checkedColorRgbArr
      })
    }
    var sortMethod = wx.getStorageSync('sort')
    savedays.sort(app.sortOrder(sortMethod.sortOrderCode, sortMethod.sortOrderKey))
    wx.setStorage({
      key: "days",
      data: savedays,
      success: function() {
        app.globalData.daysList = savedays
        app.globalData.editDay = null
        app.globalData.tempDay = null
        wx.switchTab({
          url: '../home/home'
        })
        wx.hideLoading()
      },
      fail: function() {
        wx.showToast({
          title: '保存失败，请检查网络连接再试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  onLoad: function(options) {
    //没有缓存，则把当前页面默认data设为缓存
    if (!app.globalData.tempDay) {
      this.setData({
        checkedColorRgbArr: app.hexToRgbArr(this.data.checkedColor, this.data.shadowOpacity)
      })
      app.globalData.tempDay = this.data
    }
    if (app.globalData.daysList && app.globalData.editDay) { //编辑其中一个的时候
      app.globalData.daysList.map(v => {
        if (v.id == app.globalData.editDay) {
          this.setData({
            ...v
          })
          app.globalData.tempDay = v
        }
      })
      this.setData({
        ...app.globalData.tempDay
      })
    }
  },
  onShow: function() {
    if (app.globalData.tempDay) {
      this.setData({
        ...app.globalData.tempDay
      })
    }
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function() {
    return {
      title: 'Big Days - 记录美好时光',
      path: '/pages/home/home',
      imageUrl: '/pages/asset/img/share.jpg'
    }
  }
})