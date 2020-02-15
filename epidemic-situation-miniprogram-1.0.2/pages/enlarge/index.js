// pages/enlarge/index.js


import config from '../../config.js'
const BASE_URL = config.BASE_URL;
import fetch from '../../utils/fetch.js'
import {
  screenScales
} from '../../utils/scales.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    range: '10000',
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.mapctx = wx.createMapContext("map");
    if (options.item && options.item != "undefined") {
      let {
        longitude,
        latitude
      } = JSON.parse(options.item);
      this.setData({
        longitude,
        latitude
      }, () => {
        this.fetchMark()
      });
      return false;
    }
    this.init()

  },
  movetoCenter: function() {
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
        latitude: that.data.latitude,
        range: that.data.range,
      }
    }).then(res => {
      let obj = {
        id: 9999900000,
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        width: 25,
        height: 38,
        iconPath: '../../assets/images/dingwei.png'
      }
      res.data.unshift(obj)
      let markers = res.data.map((item, index) => {
        if (item.id != 9999900000) {
          item.width = 30;
          item.height = 37;
          item.iconPath = '../../assets/images/mark.png'
        }

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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
        success: function(res) {
          that.mapCtx.getScale({
            success(resScale) {
              let scale = parseInt(resScale.scale)
              that.setData({
                latitude: res.latitude,
                longitude: res.longitude,
                range: screenScales(scale),
              }, () => {
                that.fetchMark()
              })
            }
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
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})