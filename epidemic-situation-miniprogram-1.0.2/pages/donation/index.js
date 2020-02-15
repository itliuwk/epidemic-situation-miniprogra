// pages/donation/index.js
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

  freeTell(e) {
    let phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  copy(e) {
    let that = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.name,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1200,
          mask: true
        });
      }
    });
  },
})