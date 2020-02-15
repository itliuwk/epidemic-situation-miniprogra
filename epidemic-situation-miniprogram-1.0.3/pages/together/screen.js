// pages/together/screen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    item: '',
    params: {
      tripDate: '',
      tripNo: '',
      item: '',
      city: ''
    },
    placeholder: '输入车次，如 G127'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let item = options.item,
      placeholder = this.data.placeholder;
    if (item == 'train') { //火车
      placeholder = '输入车次，如 G127'
    } else if (item == 'flight') { // 飞机
      placeholder = '输入航班号，如 CA1831'
    } else {
      placeholder = '输入城市，如 武汉'
    }
    this.setData({
      placeholder,
      params: {
        ...this.data.params,
        item
      }
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
  queryTap() {
    let {
      tripDate,
      tripNo,
      item
    } = this.data.params;
    if (item != 'city') {
      if (!tripDate || !tripNo) {
        if (tripDate) {
          if (!tripNo) {
            wx.showToast({
              title: '请输入车次或者航班号',
              icon: 'none'
            })
            return false;
          }
        }
        if (tripNo) {
          if (!tripDate) {
            wx.showToast({
              title: '请选择日期',
              icon: 'none'
            })
            return false;
          }
        }
      }
    }


    wx.navigateTo({
      url: './result?params=' + JSON.stringify(this.data.params),
    })
  },
  queryAll() {
    let params = {
      item: this.data.params.item
    }
    wx.navigateTo({
      url: './result?params=' + JSON.stringify(params),
    })
  },
  tripNoChange(e) {
    let city = ''
    if (this.data.params.item == 'city') {
      city = e.detail.value
    }
    this.setData({
      params: {
        ...this.data.params,
        tripNo: e.detail.value,
        city
      }
    })
  },
  bindDateChange: function(e) {
    this.setData({
      params: {
        ...this.data.params,
        tripDate: e.detail.value
      }
    })
  },
})