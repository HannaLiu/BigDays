// pages/more/more.js
const app = getApp()
Page({
  data: {
    morelist: [{
      id: 0,
      name: "隐私保护",
      note: "为保护用户隐私，所有数据均存储于用户当前设备微信最近使用小程序的缓存中，Big Days不会获取用户的任何信息"
    }, {
      id: 1,
      name: "谨慎删除",
      note: "从最近使用的小程序列表删除Big Days会丢失用户当前所有数据，且无法恢复，请谨慎删除\n从我的小程序列表删除Big Days不会丢失用户当前数据，请悉知"
    }, {
      id: 2,
      name: "感谢支持",
      note: "如果你喜欢Big Days，欢迎分享或打赏支持\n点击此卡片即可打赏，在此感谢所有支持Big Days的用户，非常感谢！"
    }, {
      id: 3,
      name: "使用提示",
      note: "新增：在各列表页点击加号按钮即可新增\n编辑：点击记录卡片即可编辑\n删除：左滑记录卡片即可选择删除\n排序：列表默认按照创建时间从晚到早排序；当记录多于2条时，点击加号左边的排序按钮即可选择排序方式；选择后该方式会被记录下来，所有列表将按照该方式排序\n备注：颜色明亮度排序使用YUV颜色编码法"
    }, {
      id: 4,
      name: "清除数据",
      note: "不建议用户清除数据，所有数据清除后无法恢复\n如仍想清除数据，请点击此卡片清除"
    }]
  },
  clickMore: function(e) {
    // console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    switch (id) {
      case 0:
      case 1:
        break;
      case 2:
        wx.previewImage({
          current: "",
          urls: ["https://www.f2td.com/wp-content/uploads/reward.jpg"],
          fail: function() {
            wx.showToast({
              title: '请检查网络连接并重试',
              icon: 'none',
              duration: 2000
            })
          }
        })
        break;
      case 3:
        break;
      case 4:
        wx.showActionSheet({
          itemList: ['清除所有日子的数据', '清除过去日子的数据', '清除未来日子的数据'],
          success: function(res) {
            console.log(res.tapIndex)
            switch (res.tapIndex) {
              case 0:
                wx.showModal({
                  title: '提示',
                  content: '确定删除所有日子的数据吗？删除后不可恢复！',
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      app.globalData.daysList = []
                      wx.setStorage({
                        key: "days",
                        data: [],
                        success: function() {
                          wx.showToast({
                            title: '已清除成功',
                            icon: "success",
                            duration: 2000
                          })
                        }
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                      return
                    }
                  }
                })
                break;
              case 1:
                wx.showModal({
                  title: '提示',
                  content: '确定删除过去日子的数据吗？删除后不可恢复！',
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      var futureDays = []
                      if (app.globalData.daysList.length > 0) {
                        app.globalData.daysList.map(v => {
                          console.log(v.diffMSeconds)
                          if (v.diffMSeconds >= 0) {
                            futureDays.push(v)
                          }
                          console.log(futureDays)
                        })
                      }
                      app.globalData.daysList = futureDays
                      wx.setStorage({
                        key: "days",
                        data: futureDays,
                        success: function() {
                          wx.showToast({
                            title: '已清除成功',
                            icon: "success",
                            duration: 2000
                          })
                        }
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                      return
                    }
                  }
                })
                break;
              case 2:
                wx.showModal({
                  title: '提示',
                  content: '确定删除未来日子的数据吗？删除后不可恢复！',
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      var pastDays = []
                      if (app.globalData.daysList.length > 0) {
                        app.globalData.daysList.map(v => {
                          console.log(v.diffMSeconds)
                          if (v.diffMSeconds < 0) {
                            pastDays.push(v)
                          }
                          console.log(pastDays)
                        })
                      }
                      app.globalData.daysList = pastDays
                      wx.setStorage({
                        key: "days",
                        data: pastDays,
                        success: function() {
                          wx.showToast({
                            title: '已清除成功',
                            icon: "success",
                            duration: 2000
                          })
                        }
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                      return
                    }
                  }
                })
                break;
            }
          },
          fail: function(res) {
            console.log(res.errMsg)
          }
        })
      default:
        return
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