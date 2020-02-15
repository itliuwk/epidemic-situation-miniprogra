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
    address: '当前中心位置',
    showMap: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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

      let markers = res.data.map((item, index) => {
        item.width = 25;
        item.height = 35;
        item.distance = (item.distance / 1000).toFixed(2)
        item.iconPath = '../../assets/images/mark.png'

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
        setLocal('province', (res.data[0].province).replace('省', ''))
        setLocal('city', (res.data[0].city).replace('市', ''))
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
              that.setData({
                latitude: res.latitude,
                longitude: res.longitude,
                range: screenScales(resScale.scale),
              }, () => {
                that.fetchMark()
              })
            }
          })

        }
      })
    }
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
          address: '当前中心位置'
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
  onShareAppMessage: function(res) {
    return {
      title: '查查离我最近“新型肺炎”病人，曾到过的小区！',
      path: '/pages/index/index',
      imageUrl: '../../assets/images/share.png' //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    }
  }
})