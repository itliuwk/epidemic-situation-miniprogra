// pages/me/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  toMiniprogram() {
    wx.navigateToMiniProgram({
      appId: 'wx2ac2313767a99df9',
      path: '',
      envVersion: 'release',
      success(res) {
        console.log('跳转成功');
      }
    })
  }
})