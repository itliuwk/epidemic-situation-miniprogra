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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  onUnload() {
    this.setData({
      isShow: false
    })
  },
  toScreen(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: './screen?item=' + item,
    })
  }
})