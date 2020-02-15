// pages/me/index.js
import fetch from '../../utils/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.fetchBanner()
  },
  fetchBanner() {
    let that = this;
    fetch({
      url: '/banner',
      method: 'get',
      data: {
        page: 'wz'
      }
    }).then(res => {
      if (res.data && res.data.image) {
        that.setData({
          banner: JSON.parse(res.data.image)
        })
      }
    })
  },
  toPage(e) {

    wx.showToast({
      title: '正在紧张对接工厂资源，即将上线',
      icon: 'none'
    })
    // let url = e.currentTarget.dataset.url
    // wx.navigateTo({
    //   url
    // })
  },
  toPageMask() {
    wx.navigateTo({
      url: '/pages/mask/index'
    })
  },
  toMiniprogram(e) {
    let {
      appid,
      url
    } = e.currentTarget.dataset;
    if (appid) {
      wx.navigateToMiniProgram({
        appId: appid,
        path: '',
        envVersion: 'release',
        success(res) {
          console.log('跳转成功');
        }
      })
    } else {

      wx.showToast({
        title: '开发中',
        icon: 'none'
      })
      return false
      wx.navigateTo({
        url: '/pages/webview/index?url=' + url
      })
    }

  },
  toWebView(e) {
    let link = e.currentTarget.dataset.link;
    if (link && link != 'undefined') {
      wx.navigateTo({
        url: '/pages/webview/index?url=' + link,
      })
    }

  },
})