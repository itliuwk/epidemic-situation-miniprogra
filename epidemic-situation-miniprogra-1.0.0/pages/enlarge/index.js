// pages/enlarge/index.js


import config from '../../config.js'
const BASE_URL = config.BASE_URL;
import fetch from '../../utils/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mapctx = wx.createMapContext("map");
    wx.showLoading({
      title: '加载中',
    })
  },
  movetoCenter: function () {
    this.mapctx.moveToLocation();
    this.init()
  },

  fetchMark() {
    let that = this;
    fetch({
      url: '/community',
      method: 'get',
      data: {
        longitude: that.data.longitude,
        latitude: that.data.latitude
      }
    }).then(res => {
      let markers = res.data.map((item, index) => {
        item.width = 30;
        item.height = 40;
        item.iconPath = '../../assets/images/mark.png'

        return item;
      })

      that.setData({
        markers
      })
    })
  },

  markertap(e) {
    let markerId = e.markerId;
    this.data.markers.map((item, index) => {
      if (markerId == item.id) {
        wx.showToast({
          duration: 3000,
          title: item.city + item.name,
          icon: 'none'
        })
      }
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
    this.init()
  },

  init() {
    let that = this;

    // 获取经纬度
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        }, () => {
          that.fetchMark()
        })
      },
      fail(err) {
        wx.showToast({
          title: '取消位置授权,影响该应该的使用',
          icon: 'none',
          duration: 2500
        })
      },
      complete(res) {}
    })
  },

  regionchange(e) {
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      let that = this;
      that.mapCtx = wx.createMapContext("map");
      that.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function (res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          }, () => {
            that.fetchMark()
          })
        }
      })
    }
  },
  narrow() {
    wx.navigateBack({
      delta: 1
    })
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