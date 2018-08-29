const app = getApp()
Page({
  data: {
    shadowOpacity: 0.3,
    showPalette: false
  },
  showPalette: function() {
    this.setData({
      showPalette: true,
      rgbarr: app.hexToRgbArr(this.data.checkedColor)
    })
  },
  cancel: function() {
    this.setData({
      showPalette: false,
      checkedColor: this.data.prevColor
    })
    console.log(this.data)
  },
  sliderChangeR: function(e) {
    let newarr = this.data.rgbarr
    newarr[0] = e.detail.value
    this.setData({
      rgbarr: newarr
    })
    this.setData({
      checkedColor: app.RGBToHex(this.data.rgbarr)
    })
    this.setData({
      checkedColorRgbArr: app.hexToRgbArr(this.data.checkedColor, this.data.shadowOpacity)
    })
  },
  sliderChangeG: function(e) {
    console.log(e.detail.value)
    let newarr = this.data.rgbarr
    newarr[1] = e.detail.value
    this.setData({
      rgbarr: newarr
    })
    this.setData({
      checkedColor: app.RGBToHex(this.data.rgbarr)
    })
    this.setData({
      checkedColorRgbArr: app.hexToRgbArr(this.data.checkedColor, this.data.shadowOpacity)
    })
    console.log(this.data.checkedColor)
  },
  sliderChangeB: function(e) {
    console.log(e.detail.value)
    let newarr = this.data.rgbarr
    newarr[2] = e.detail.value
    this.setData({
      rgbarr: newarr
    })
    this.setData({
      checkedColor: app.RGBToHex(this.data.rgbarr)
    })
    this.setData({
      checkedColorRgbArr: app.hexToRgbArr(this.data.checkedColor, this.data.shadowOpacity)
    })
    console.log(this.data.checkedColor)
  },
  bindKeyInput: function(e) {
    var pattern = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
    var color = e.detail.value;
    if (color.match(pattern) !== null) {
      this.setData({
        checkedColor: e.detail.value,
        checkedColorRgbArr: app.hexToRgbArr(color, this.data.shadowOpacity)
      })
      console.log(this.data)
    }
  },
  saveRGB: function() {
    this.setData({
      showPalette: false
    })
    this.setData({
      checkedColorRgbArr: app.hexToRgbArr(this.data.checkedColor, this.data.shadowOpacity)
    })
  },
  save: function(e) {
    app.globalData.tempDay.checkedColor = this.data.checkedColor
    this.setData({
      checkedColorRgbArr: app.hexToRgbArr(this.data.checkedColor, this.data.shadowOpacity)
    })
    app.globalData.tempDay.checkedColorRgbArr = this.data.checkedColorRgbArr
    console.log(app.globalData.tempDay)
    if (!this.data.date) {
      wx.navigateTo({
        url: '../addDay/addDay'
      })
    } else {
      wx.showLoading({
        title: '正在保存',
      })
      console.log(this.data)
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
    }
  },
  onLoad: function(options) {
    if (app.globalData.tempDay) {
      this.setData({
        ...app.globalData.tempDay
      })
      this.setData({
        prevColor: this.data.checkedColor
      })
      this.setData({
        rgbarr: app.hexToRgbArr(this.data.checkedColor)
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