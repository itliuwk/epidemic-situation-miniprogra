// pages/feedback/index.js
import fetch from '../../utils/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ''
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
  textareaChange(e) {
    this.setData({
      content: e.detail.value
    })
  },

  submit() {
    let content = this.data.content
    if (!content) {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none'
      });
      return false;
    }
    fetch({
      url: '/opinion?content=' + this.data.content,
      method: 'post',
      data: {
        content: this.data.content
      }
    }).then(res => {
      wx.showToast({
        title: '提交成功，感谢您的反馈',
        icon: 'none'
      });



      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 1500)
    })
  }
})