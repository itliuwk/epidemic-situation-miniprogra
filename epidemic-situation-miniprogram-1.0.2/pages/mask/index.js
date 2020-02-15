// pages/mask/index.js
import fetch from '../../utils/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    masks: []
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
    this.fetchMask()
  },

  fetchMask() {
    let that = this;
    fetch({
      url: '/mask',
      method: 'get',
      data: {

      }
    }).then(res => {
      if (res.data) {
        that.setData({
          masks: res.data
        })
      }
    })
  },
  viewDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './detail?id=' + id,
    })
  }
})