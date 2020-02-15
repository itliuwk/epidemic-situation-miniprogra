// pages/together/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命 周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监 听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监 听页面隐藏
   */
  onHide: function() {

  },
  toPageView(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '/pages/webview/index?url=' + url
    })
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

  },
  together() {
    let that = this;
    wx.showToast({
      title: '请微信搜索小程序：金亚新冠患者同乘查询',
      icon: 'none'
    })
    // wx.navigateToMiniProgram({
    //   appId: 'wx3964962647b49f72',
    //   path: '',
    //   envVersion: 'release',
    //   success(res) {
    //     console.log('跳转成功');
    //     that.setData({
    //       isShow: false
    //     })
    //   },
    //   fail() {
    //     that.setData({
    //       isShow: true
    //     })
    //   }
    // })
  },
  onUnload() {
    this.setData({
      isShow: false
    })
  }
})