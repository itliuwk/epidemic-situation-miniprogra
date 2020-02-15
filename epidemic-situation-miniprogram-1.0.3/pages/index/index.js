// pages/index/index.js


import config from '../../config.js'
const BASE_URL = config.BASE_URL;
import fetch from '../../utils/fetch.js'
import {
  screenScales
} from '../../utils/scales.js'
import {
  setLocal
} from '../../utils/local';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    range: '10000',
    markers: [],
    address: '附近病例',
    showMap: false,
    isShowToday: false,
    banner: [],
    date: '2-10',
    statistics: {},
    days: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var date = new Date();

    let getMonth = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    getMonth = getMonth < 10 ? '0' + getMonth : getMonth

    let getDate = date.getDate(); //获取当前日(1-31)

    this.setData({
      date: getMonth + '-' + getDate
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.mapctx = wx.createMapContext("map");
    this.init()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.fetchBanner()
    this.fetchStatistics()
  },
  fetchStatistics() {
    let that = this;
    fetch({
      url: '/infectTrend/today',
      method: 'get',
      data: {

      }
    }).then(res => {
      if (res.data) {

        let isShowToday = false;
        if (res.data.today) {
          let {
            confirm,
            dead,
            heal,
            suspect
          } = res.data.today.today;
          if (confirm || dead || heal || suspect) {
            isShowToday = true
          }
        }

        that.setData({
          statistics: {
            today: res.data.today.today,
            total: res.data.today.total,
          },
          isShowToday,
          days: res.data.days
        })
      }
    })
  },
  fetchBanner() {
    let that = this;
    fetch({
      url: '/banner',
      method: 'get',
      data: {
        page: 'sy'
      }
    }).then(res => {
      if (res.data && res.data.image) {
        that.setData({
          banner: JSON.parse(res.data.image)
        })
      }
    })
  },
  fetchMark() {
    let that = this;

    let position = {
      longitude: that.data.longitude,
      latitude: that.data.latitude,
    }
    setLocal('position', position)
    fetch({
      url: '/community',
      method: 'get',
      data: {
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        address: that.data.address,
        range: that.data.range
      }
    }).then(res => {

      let obj = {
        id: 9999900000,
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        width: 25,
        height: 38,
        iconPath: '../../assets/images/dingwei.png'
      }
      res.data.unshift(obj)
      let markers = res.data.map((item, index) => {
        if (item.id != 9999900000) {
          item.width = 30;
          item.height = 37;
          item.distance = (item.distance / 1000).toFixed(2)
          item.iconPath = '../../assets/images/mark.png'
        }


        return item;
      });
      that.setData({
        showMap: true,
        markers
      });
      if (!res.data.length) {
        wx.showToast({
          title: '可缩放地图查看更多数据',
          icon: 'none'
        })
      }
      if (res.data && res.data.length) {
        setLocal('province', (res.data[1].province).replace('省', ''))
        setLocal('city', (res.data[1].city).replace('市', ''))
      }
    })

  },
  markertap(e) {
    let markerId = e.markerId;
    this.data.markers.map((item, index) => {
      if (markerId == item.id) {
        console.log(item)
        wx.showToast({
          duration: 3000,
          title: item.city + item.name,
          icon: 'none'
        })
      }
    });

  },

  /**
   * 地图移动
   */
  regionchange(e) {
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      let that = this;
      that.mapCtx = wx.createMapContext("map");

      that.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function(res) {
          that.mapCtx.getScale({
            success(resScale) {
              let scale = parseInt(resScale.scale)
              that.setData({
                latitude: res.latitude,
                longitude: res.longitude,
                range: screenScales(scale),
              }, () => {
                that.fetchMark()
              })
            }
          })

        }
      })
    }
  },
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },
  /**
   * 地理位置自定义搜索
   */
  search() {
    let that = this
    wx.chooseLocation({
      success: function(res) {

        if (res.name != '') {
          that.setData({
            address: res.name,
            longitude: res.longitude,
            latitude: res.latitude,
          }, () => {
            that.fetchMark()
          })
        } else {
          that.setData({
            address: res.address,
            longitude: res.longitude,
            latitude: res.latitude,
          }, () => {
            that.fetchMark()
          })
        }

      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
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
   * 重定位地图中心
   */
  movetoCenter: function() {
    this.mapctx.moveToLocation();
    this.init()
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
          longitude: res.longitude,
          latitude: res.latitude,
          address: '附近病例'
        }, () => {
          that.fetchMark()
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
  toPageMask() {
    wx.navigateTo({
      url: '/pages/mask/index',
    })
  },
  toWebView(e) {
    let link = e.currentTarget.dataset.link
    if (link && link != 'undefined') {
      wx.navigateTo({
        url: '/pages/webview/index?url=' + link,
      })
    }
  },
  doubt() {
    wx.showModal({
      title: '算法说明',
      content: '当日新增疑似病例数量，2月4日起每日新增疑似病例较上日减少平均数，得出新增疑似病例归零数。',
      showCancel: false,
      confirmText: '关闭',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onShareAppMessage: function(res) {
    let num = Math.floor(Math.random() * 15);
    let obj = {}
    if (num > 5) {
      obj = {
        title: '算一算疫情什么时候结束！',
        path: '/pages/index/index',
        // imageUrl: '../../assets/images/share1.png'
        imageUrl: 'https://cdn.renqilai.com/2020_02_14/22_08_06_share1.png'
      }
    } else {
      obj = {
        title: '最全领口罩攻略，就在这里！',
        path: '/pages/index/index',
        // imageUrl: '../../assets/images/share.png'
        imageUrl: 'https://cdn.renqilai.com/2020_02_14/22_08_02_share.png'
      }
    }

    return obj

  }
})