// pages/together/result.js
import fetch from '../../utils/fetch.js'
import moment from '../../utils/moment.min.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      item: '',
      tripDate: '',
      tripNo: '',
    },
    count: 0,
    updateDate: '',
    results: [],
    loadUp: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      params: {
        from: 0,
        size: 10,
        ...JSON.parse(options.params)
      }
    }, () => {
      this.init()
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
  onShow: function() {},
  init() {
    let {
      item,
      tripDate,
      tripNo,
      city
    } = this.data.params,
      url = '/virusTrip/train';
    if (item == 'train' && tripDate && tripNo) { //火车
      url = '/virusTrip/train';
    } else if (item == 'flight' && tripDate && tripNo) { // 飞机
      url = '/virusTrip/flight';
    } else if (item == 'city' && city) {
      this.fetchCity()
      return false;
    } else {
      this.fetchAll()
      return false;
    }

    fetch({
      url,
      method: 'get',
      data: {
        ...this.data.params,
      }
    }).then(res => {
      if (res.data) {
        let size = this.data.params.size;

        res.data.trip.map(item => {
          item.tripDate = moment(item.tripDate).format('MM/DD'); // 日期
          item.tripDeptime = moment(item.tripDeptime).format('MM/DD HH:mm'); // 出发时间
          item.tripArrtime = moment(item.tripArrtime).format('MM/DD HH:mm'); // 到达时间
          return item;
        })

        let results = [...this.data.results, ...res.data.trip]

        this.setData({
          results,
          count: res.data.count,
          updateDate: res.data.updateDate
        })

        if (res.data.trip.length < size) {
          this.setData({
            loadUp: true
          });
        }
      }
    })
  },
  fetchCity() {

    fetch({
      url: '/virusTrip/city',
      method: 'get',
      data: {
        city: this.data.params.city,
        ...this.data.params,
      }
    }).then(res => {
      if (res.data) {
        let size = this.data.params.size;

        res.data.trip.map(item => {
          item.tripDate = moment(item.tripDate).format('MM/DD'); // 日期
          item.tripDeptime = moment(item.tripDeptime).format('MM/DD HH:mm'); // 出发时间
          item.tripArrtime = moment(item.tripArrtime).format('MM/DD HH:mm'); // 到达时间
          return item;
        })

        let results = [...this.data.results, ...res.data.trip]

        this.setData({
          results,
          count: res.data.count,
          updateDate: res.data.updateDate
        })

        if (res.data.trip.length < size) {
          this.setData({
            loadUp: true
          });
        }
      }
    })
  },
  fetchAll() {

    fetch({
      url: '/virusTrip/all',
      method: 'get',
      data: {
        tripType: this.data.params.item || 'train'
      }
    }).then(res => {
      if (res.data) {
        let size = this.data.params.size;

        res.data.trip.map(item => {
          item.tripDate = moment(item.tripDate).format('MM/DD'); // 日期
          item.tripDeptime = moment(item.tripDeptime).format('MM/DD HH:mm'); // 出发时间
          item.tripArrtime = moment(item.tripArrtime).format('MM/DD HH:mm'); // 到达时间
          return item;
        })

        let results = [...this.data.results, ...res.data.trip]

        this.setData({
          results,
          count: res.data.count,
          updateDate: res.data.updateDate
        })

        if (res.data.trip.length < size) {
          this.setData({
            loadUp: true
          });
        }
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
    if (this.data.loadUp) {
      return false;
    }
    this.init();
  }
})