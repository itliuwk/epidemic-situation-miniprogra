// pages/search/index.js
import fetch from '../../utils/fetch.js'
import {
  getLocal
} from '../../utils/local';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    // array: ['广州市', '深圳市', '韶关市', '珠海市', '汕头市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
    // index: 0,
    markers: [],
    params: {
      province: '',
      city: '',
      district: '',
      size: 10,
      from: 0
    },
    loadUp: false
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
   * 跳转地图全屏页
   */
  enlarge(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/enlarge/index?item=' + JSON.stringify(item),
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.fetchMark()
  },
  bindRegionChange(e) {
    let value = e.detail.value;
    this.setData({
      index: e.detail.value,
      markers: [],
      region: value,
      loadUp: false,
      params: {
        size: 10,
        from: 0,
        province: value[0],
        city: value[1],
        district: value[2],
      }
    }, () => {
      this.fetchMark()
    })
  },

  bindPickerChange: function(e) {
    let value = e.detail.value,
      city = '';
    if (value == 0) {
      city = '广州市'
    } else {
      city = this.data.array[value]
    }
    this.setData({
      index: e.detail.value,
      markers: [],
      loadUp: false,
      params: {
        ...this.data.params,
        size: 10,
        from: 0,
        city
      }
    }, () => {
      this.fetchMark()
    })
  },
  doubt() {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '数据真实来自卫健委，真实可靠',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  fetchMark() {
    let that = this;
    if (that.data.loadUp) {
      return false;
    }

    let position = getLocal('position'),
      params = {};

    let {
      city
    } = this.data.params;

    if (!position.latitude) {
      position = {}
    }
    if (!city) {
      params = {
        ...that.data.params,
        ...position
      }
    } else {
      params = {
        ...that.data.params
      }
    }

    fetch({
      url: '/community',
      method: 'get',
      data: {
        ...params,
      }
    }).then(res => {

      let size = this.data.params.size;

      let markers = [...that.data.markers, ...res.data]

      that.setData({
        markers
      });

      if (res.data.length < size) {
        this.setData({
          loadUp: true
        });
      }
    })

  },

  bindscrolltolower() {
    this.setData({
      params: {
        ...this.data.params,
        from: this.data.params.from + this.data.params.size
      }
    })
    this.fetchMark();
  }
})