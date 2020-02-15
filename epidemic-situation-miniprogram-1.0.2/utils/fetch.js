/**
 * 网络请求
 */
import config from '../config.js'
const BASE_URL = config.BASE_URL;
const app = getApp();
const fetch = function({
  url = '/',
  method = 'GET',
  data = {},
  header,
  isLoading = true,
  showLoadingTitle = "加载中..."
}) {
  return new Promise((resolve, reject) => {



    //显示加载图
    if (isLoading) {
      wx.showLoading({
        title: showLoadingTitle,
      })
    }
    /**
     * 添加共同URL路径，七牛获取token除外
     */

    if (!url.includes('/api/qiniu/upToken')) {
      url = "/api/wx" + url;
    }

    const requestTask = wx.request({
      url: BASE_URL + url,
      data: data,
      header: header,
      method: method.toUpperCase(),
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          console.error(res);
          wx.showToast({
            title: '后台连接错误,请重新刷新后再进入！',
            icon: "none"
          });
          reject({
            code: -1,
            errstr: res
          });
        }
      },
      fail: function(res) {
        console.error(res);
        //检查网络状态
        wx.getNetworkType({
          success: function(res) {
            if (res.networkType === 'none') {
              wx.showToast({
                title: '网络出错，请检查网络连接！',
                icon: "none",
                mask: true
              });
            }
          }
        });

        //请求超时处理
        if (res && res.errMsg === "request:fail timeout") {
          wx.showToast({
            title: '网络请求超时！',
            icon: "none"
          });
        }

        reject({
          code: -1,
          errstr: res
        });
      },

      complete: function() {
        //清除加载图
        if (isLoading) {
          wx.hideLoading();
        }
      }
    });


  });
}







function login() {
  let that = this
  wx.login({
    success: e => {
      let code = e.code

      // 登录注册接口
      if (code) {
        // 调用服务端登录接口，发送 res.code 到服务器端换取 openId, sessionKey, unionId并存入数据库中
        wx.getUserInfo({
          success: function(result) {

            wx.request({
              url: BASE_URL + '/wxa/login?code=' + code,
              method: 'post',
              data: {
                code
              },
              success: (res) => {
                wx.setStorageSync('codeInfo', result);
                let encryptedData = result.encryptedData;
                fetchWxlogin(res, encryptedData, result.iv); //调用服务器api

              }
            })

          }
        })
      }
    }
  });
}


function fetchWxlogin() {
  let that = this
  let Authorization = CusBase64.CusBASE64.encoder(`${config.client_id}:${config.client_secret}`);
  wx.request({
    url: BASE_URL + "/oauth/token",
    method: "post",
    data: {
      sessionKey: res.data.sessionKey,
      grant_type: 'wxa',
      encryptedData,
      iv
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Authorization}`
    },
    success: result => {
      console.log(result)
      if (result.data.access_token) {
        let expireTime = new Date().valueOf() + result.data.expires_in * 1000;
        result.data.expireTime = expireTime;
        try {
          that.globalData.token = result.data;
          wx.setStorageSync('tokenInfo', result.data);


        } catch (err) {
          console.error(err);
        }

      }

    }
  })
}

export default fetch;