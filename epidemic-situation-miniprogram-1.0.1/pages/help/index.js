// pages/me/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: ['1.png', '2.png', '3.png']
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

  },

  toPage(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url
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

  }
})