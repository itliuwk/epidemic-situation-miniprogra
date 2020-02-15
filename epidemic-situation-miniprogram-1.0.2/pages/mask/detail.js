// pages/mask/detail.js
import fetch from '../../utils/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    }, () => {
      this.fetchDetail()
    })
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
  fetchDetail() {
    let that = this;
    fetch({
      url: '/mask/detail',
      method: 'get',
      data: {
        id: that.data.id
      }
    }).then(res => {
      if (res.data) {
        this.setData({
          content: that.replaceDetail(res.data.content)
        })
      }
    })
  },
  replaceDetail(details) {

    var texts = ''; //待拼接的内容

    while (details.indexOf('<img') != -1) { //寻找img 循环

      texts += details.substring('0', details.indexOf('<img') + 4); //截取到<img前面的内容

      details = details.substring(details.indexOf('<img') + 4); //<img 后面的内容

      if (details.indexOf('style=') != -1 && details.indexOf('style=') < details.indexOf('>')) {

        texts += details.substring(0, details.indexOf('style="') + 7) + "max-width:100%;height:auto;margin:0 auto;"; //从 <img 后面的内容 截取到style= 加上自己要加的内容

        details = details.substring(details.indexOf('style="') + 7); //style后面的内容拼接

      } else {

        texts += ' style="max-width:100%;height:auto;margin:0 auto;" ';

      }



    }

    texts += details; //最后拼接的内容

    return texts

  }
})