//app.js
App({
  onLaunch: function() {},
  onShow: function() {
    try {
      var allDays = wx.getStorageSync('days')
      var sortMethod = wx.getStorageSync('sort')
      if (!sortMethod) {
        let sortMethod = {
          sortOrderCode: 0,
          sortOrderKey: "id"
        }
        wx.setStorage({
          key: 'sort',
          data: sortMethod
        })
      }
      console.log(sortMethod)
      if (allDays) {
        let CurrDateMSeconds = this.getCurrDateMSeconds()
        allDays.map((v, i) => {
          let checkddays = this.checkCurrDate(CurrDateMSeconds, v.mSecondsSelected)
          v = { ...v,
            ...checkddays
          }
          allDays[i] = v
        })
        allDays.sort(this.sortOrder(sortMethod.sortOrderCode, sortMethod.sortOrderKey))
        this.globalData.daysList = allDays
        wx.setStorage({
          key: 'days',
          data: allDays
        })
      }
    } catch (e) {
      console.log(e)
      wx.showToast({
        title: '请检查网络连接并重试',
        icon: 'none',
        duration: 2000
      })
    }
  },
  globalData: {
    daysList: [], //存储所有days
    editDay: null, //如果是编辑，则设置该值为该项的id，新增则设置为null
    tempDay: null //用户未保存前操作的值暂存
    // sortOrderCode: 0, //列表排序的方式，0表示逆序，从大到小，1表示顺序，从小到大
    // sortOrderKey: "id" //按此key排序,可设置id,diffnum,mSecondsSelected,checkedColorRgbArr
  },
  getArrSum: function(arr) {
    let sum = 0
    arr.map(v => {
      sum += v
    })
    return sum
  },
  getGrayLevel: function(arr) {
    //YUV
    //Y: 明亮度
    return 0.299 * arr[0] + 0.587 * arr[1] + 0.114 * arr[2]
    //U: 色度
    // return -0.169 * arr[0] - 0.331 * arr[1] + 0.5 * arr[2] +128
    //V: 浓度
    // return 0.5 * arr[0] - 0.419 * arr[1] - 0.081 * arr[2] + 128
  },
  sortOrder: function(sortOrderCode, sortOrderKey) {
    var that = this
    if (sortOrderCode == 0) { //逆序
      var sortFun = function(obj1, obj2) {
        if (sortOrderKey == "checkedColorRgbArr") {
          return that.getGrayLevel(obj2[sortOrderKey]) - that.getGrayLevel(obj1[sortOrderKey])
        }
        return obj2[sortOrderKey] - obj1[sortOrderKey]
      }
      return sortFun
    } else { //顺序
      var sortFun = function(obj1, obj2) {
        if (sortOrderKey == "checkedColorRgbArr") {
          return that.getGrayLevel(obj1[sortOrderKey]) - that.getGrayLevel(obj2[sortOrderKey])
        }
        return obj1[sortOrderKey] - obj2[sortOrderKey]
      }
      return sortFun
    }
  },
  sortListAfterSelect(key, index, cb) { //一个参数是选择的key,第二个是选择的index
    let sortOrderKey = key;
    if (index == 0) {
      var sortOrderCode = 0;
    } else if (index == 1) {
      var sortOrderCode = 1;
    }
    this.globalData.daysList.sort(this.sortOrder(sortOrderCode, sortOrderKey))
    let sortMethod = {
      sortOrderCode: sortOrderCode,
      sortOrderKey: sortOrderKey
    }
    wx.setStorage({
      key: 'sort',
      data: sortMethod
    })
    wx.setStorage({
      key: 'days',
      data: this.globalData.daysList
    })
    cb()
  },
  sortList: function(cb) {
    var that = this;
    wx.showActionSheet({
      itemList: ['按创建时间排序', '按已过或剩余天数排序', '按起始或目标日期排序', '按颜色明亮度排序'],
      success: function(res) {
        console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            wx.showActionSheet({
              itemList: ['创建时间从晚到早', '创建时间从早到晚'],
              success: function(res) {
                that.sortListAfterSelect("id", res.tapIndex, cb)
              },
              fail: function(res) {
                console.log(res.errMsg)
              }
            })
            break;
          case 1:
            wx.showActionSheet({
              itemList: ['天数从大到小', '天数从小到大'],
              success: function(res) {
                that.sortListAfterSelect("diffnum", res.tapIndex, cb)
              },
              fail: function(res) {
                console.log(res.errMsg)
              }
            })
            break;
          case 2:
            wx.showActionSheet({
              itemList: ['日期从晚到早', '日期从早到晚'],
              success: function(res) {
                that.sortListAfterSelect("mSecondsSelected", res.tapIndex, cb)
              },
              fail: function(res) {
                console.log(res.errMsg)
              }
            })
            break;
          case 3:
            wx.showActionSheet({
              itemList: ['明亮度从高到低', '明亮度从低到高'],
              success: function(res) {
                that.sortListAfterSelect("checkedColorRgbArr", res.tapIndex, cb)
              },
              fail: function(res) {
                console.log(res.errMsg)
              }
            })
            break;
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })

  },
  addDay: function () {
    this.globalData.editDay = null
    this.globalData.tempDay = null
    wx.navigateTo({
      url: '../addDay/addDay'
    })
  },
  handleTapCard: function (e) {
    this.globalData.editDay = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../addDay/addDay'
    })
  },
  hexToRgb: function(hex, opacity) { //16进制转rgb()或rgba()字符串
    var rgb = [];
    hex = hex.substr(1); //去除前缀 # 号
    if (hex.length === 3) { // 处理 "#abc" 成 "#aabbcc"
      hex = hex.replace(/(.)/g, '$1$1');
    }
    hex.replace(/../g, function(color) {
      rgb.push(parseInt(color, 0x10)); //按16进制将字符串转换为数字
    });
    if (!opacity) {
      return "rgb(" + rgb.join(",") + ")";
    }
    return "rgba(" + rgb.join(",") + "," + opacity + ")";
  },
  hexToRgbArr: function(hex) { //16进制转rgb[],数组长度为3，值为rgb的三个值
    var rgb = [];
    hex = hex.substr(1); //去除前缀 # 号
    if (hex.length === 3) { // 处理 "#abc" 成 "#aabbcc"
      hex = hex.replace(/(.)/g, '$1$1');
    }
    hex.replace(/../g, function(color) {
      rgb.push(parseInt(color, 0x10)); //按16进制将字符串转换为数字
    });
    return rgb
  },
  RGBToHex: function(rgbarr) { // RGB转为16进制数，传入参数为有rgb三个值的数组
    var hexColor = "#";
    var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    for (var i = 0; i < 3; i++) {
      var r = null;
      var c = rgbarr[i];
      var hexAr = [];
      while (c > 16) {
        r = c % 16;
        c = (c / 16) >> 0;
        hexAr.push(hex[r]);
      }
      hexAr.push(hex[c]);
      if (hexAr.length < 2) {
        hexAr.push("0")
      }
      hexColor += hexAr.reverse().join('');
    }
    return hexColor;
  },
  getcurrDate: function() { //获取当前的时间，转换成yyyy-mm-dd格式
    var date = new Date();
    var currMonth = date.getMonth() + 1;
    var currDay = date.getDate();
    var seperator = "-";
    if (currMonth >= 1 && currMonth <= 9) {
      currMonth = "0" + currMonth;
    }
    if (currDay >= 0 && currDay <= 9) {
      currDay = "0" + currDay;
    }
    var currDate = date.getFullYear() + seperator + currMonth + seperator + currDay;
    return currDate
  },
  getCurrDateMSeconds: function() {
    let CurrDateMSeconds = new Date(this.getcurrDate()).getTime()
    return CurrDateMSeconds
  },
  checkCurrDate: function(curr, selected) { //比较当前日期和用户选择的日期的差值，返回对象
    var compareDate = selected - curr
    var daysnum = parseInt(Math.abs(compareDate) / 1000 / 60 / 60 / 24);
    daysnum = Math.floor(daysnum)
    let datatag = "",
      msg = ""
    if (compareDate < 0) {
      datatag = "起始日期："
      msg = "已过天数"
    } else {
      datatag = "目标日期："
      msg = "剩余天数"
    }
    let obj = {
      datatag,
      msg,
      diffnum: daysnum,
      diffMSeconds: compareDate
    }
    return obj
  }
})