// pages/od/index.js
import fetch from '../../utils/fetch.js'
import {
  getLocal,
  setLocal
} from '../../utils/local';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinces: [],
    index: 0,
    citys: [],
    cityIdx: 0,
    params: {
      cityCode: '',
      latitude: '',
      longitude: '',
      word: '',
    },
    hospitals: [],
    province: "",
    city: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.init()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  fetchHospitals() {
    let that = this;
    let {
      cityCode,
      longitude,
      latitude,
      word
    } = that.data.params
    fetch({
      url: '/hospital/hospital?cityCode=' + cityCode + '&longitude=' + longitude + '&latitude=' + latitude + '&word=' + word,
      method: 'get'
    }).then(res => {
      res.data.map((item, idx) => {
        item.fever = item.fever == 1 ? '发热门诊' : '非发热门诊';
        item.core = item.core == 1 ? '医疗救治定点医院' : '非医疗救治定点医院';
        item.distance = (item.distance / 1000).toFixed(2)
        return item;
      })
      that.setData({
        hospitals: res.data
      });
    })
  },
  bindProvinceChange: function(e) {
    let that = this;
    let value = e.detail.value;
    this.setData({
      index: value,
      cityIdx: 0,
      province: ''
    }, () => {
      setLocal('province', '')
      setLocal('city', '')
      let province = that.data.provinces[value]
      that.fetchCity(province.name)
    })
  },
  bindCityChange: function(e) {
    let that = this;
    let value = e.detail.value;
    let citys = that.data.citys[value]
    that.setData({
      cityIdx: value,
      city: '',
      params: {
        ...that.data.params,
        cityCode: citys.cityCode
      }
    }, () => {
      setLocal('city', '')
      that.fetchHospitals()
    });
  },
  wordChange(e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      params: {
        ...that.data.params,
        word: value
      }
    }, () => {
      that.fetchHospitals()
    });
  },
  openMap(e) {
    let {
      latitude,
      longitude,
      addressName,
      name,
    } = e.currentTarget.dataset.item;
    wx.openLocation({
      latitude,
      longitude,
      scale: 18,
      name,
      address: addressName
    })
  },
  fetchProvince() {
    let that = this;
    let province = getLocal('province');
    fetch({
      url: '/hospital/province',
      method: 'get',
      data: {
        ...that.data.params
      }
    }).then(res => {
      that.setData({
        provinces: res.data,
        province
      }, () => {
        if (province) {
          that.fetchCity(province);
          return
        }
        that.fetchCity(res.data[0].name)
      });
    })
  },
  fetchCity(province) {
    let that = this;
    let city = getLocal('city');
    fetch({
      url: '/hospital/city?province=' + province,
      method: 'get'
    }).then(res => {
      let cityCode = res.data[0].cityCode
      res.data.map(item => {
        if (city == item.name) {
          cityCode = item.cityCode
        }
        return item;
      })
      that.setData({
        citys: res.data,
        city,
        cityIdx: 0,
        params: {
          ...that.data.params,
          cityCode
        }
      }, () => {
        that.fetchHospitals()
      });
    })
  },
  /**
   * 获取位置微信许可
   */
  init() {
    let that = this;


    // 获取经纬度
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        that.setData({
          params: {
            ...that.data.params,
            longitude: res.longitude,
            latitude: res.latitude
          }
        }, () => {
          that.fetchProvince()
        })
      },
      fail(err) {
        wx.showToast({
          title: '取消位置授权,影响该应该的使用',
          icon: 'none',
          duration: 2500
        })
        that.getUserLocation()
      },
      complete(res) {}
    })



  },

  /**
   * 定位方法
   */
  getUserLocation: function() {
    var _this = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
                _this.getUserLocation()
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function(res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.init();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.init();
        } else {
          console.log('授权成功')
          //调用wx.getLocation的API
          _this.init();
        }
      }
    })

  },
})