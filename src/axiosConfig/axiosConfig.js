import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import router from '@/router/index'
import LEND from '@/util/util'
import store from '@/store'
import { Domainurl as domainurl } from './config'
var blackurlArr = ['account/signup',
  'mail/send',
  'mail/blocksend',
  'oauth/token',
  'account/resetpwd',
  'invest/mobile/index',
  'invest/recommends',
  'borrow/detail',
  'borrow/types',
  'borrow-pairs',
  'user/nickname',
  'gxb/authorize',
  'ico/getTime',
  'ico/investlist',
  'ico/borrowlist',
  'gxb/authorize'
]
axios.defaults.headers.common['Authorization'] = 'Basic ZnJvbnRlbmQ6ZnJvbnRlbmQ=' // 请求时候统一设置的头部
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded' // post请求时候统一设置的头部
axios.defaults.timeout = 20000 // 统一的全局参数配置
axios.defaults.withCredentials = true
/* eslint-disable  */
console.log('process.online:' + process.online,process.nowenv)
/* eslint-disable  */
//  axios.defaults.baseURL = (!process.online)?'http://apitest.lendx.vip':'https://api.lendx.vip' // 启用线上接口 统一全局接口地址
axios.defaults.baseURL = (!process.online)?'http://apitest.lendx.vip':'http://apitest.lendx.vip' //启用测试接口  统一全局接口地址测试
const getlangname = function () {
  let lang = localStorage.getItem('LENDCHAIN_LANGUAGE') ? localStorage.getItem('LENDCHAIN_LANGUAGE') : ((navigator.appName === 'Netscape') ? (navigator.language).substr(0, 2) : (navigator.userLanguage).substr(0, 2))
  lang = (lang === 'ch' || lang === 'zh') ? 'ch' : (lang === 'ko' ? 'ko' : 'en')
  const langobj = {'zh': 'zh_CN', 'en': 'en_US', 'ko': 'ko', 'ch': 'zh_CN'}
  return langobj[lang]
}
axios.interceptors.request.use((request) => {
  request.headers['Authorization'] = 'Bearer ' + (LEND.localStorage('access_token') || '')
  for (let i in blackurlArr) {
    if ((request.url.indexOf(blackurlArr[i]) > 0) && (request.url.indexOf('mail/send/me') < 0)) {
      request.headers['Authorization'] = 'Basic ZnJvbnRlbmQ6ZnJvbnRlbmQ='
    }
  }
  if (request.method === 'post') {
    for (let key in request.data) { // 统一过滤 XSS
      request.data[key] = filterXSS(request.data[key])
    }
    request.data.lang = getlangname()
    request.data = LEND.encrypt(request.data)
    request.data = qs.stringify(request.data)
  }
  if (request.method === 'get') {
    request.params = { ...request.params, stamp: new Date().getTime(), lang: getlangname()}
    request.params = LEND.encrypt(request.params)
  }
  // ie cache策略
  return request
})

axios.interceptors.response.use(function (res) {
  switch (Number(res.data.code)) {
    case 2000:
      if (res.config.url.indexOf('oauth/token') > 0) {
        LEND.localStorage('access_token', res.data.access_token)
        if (res.data.data.identif.email) {
          LEND.localStorage('haslogin', true) // 改为登录状态
        } else {
          LEND.localStorage('haslogin', false) // 改为非登录状态
        }
      }
      if ((res.config.url.indexOf('account/signin') > 0) || (res.config.url.indexOf('oauth/token') > 0) || (res.config.url.indexOf('account/resetpwd') > 0) || (res.config.url.indexOf('user/profile') > 0)) {
        if (res.data.data.identif !== undefined) {
          LEND.localStorage('iphone', res.data.data.identif.phone, {
            expires: 7,
            domain: domainurl
          })
          LEND.localStorage('kyc', res.data.data.identif.kyc, {
            expires: 7,
            domain: domainurl
          })
          LEND.localStorage('igoogle', res.data.data.identif.google, {
            expires: 7,
            domain: domainurl
          })
        }
      } else if (res.config.url.indexOf('mfa/auth') > 0) {
        LEND.localStorage('igoogle', 1, {
          expires: 7,
          domain: domainurl
        })
      } else if (res.config.url.indexOf('sms/auth-phone') > 0) {
        LEND.localStorage('iphone', 1, {
          expires: 7,
          domain: domainurl
        })
      }
      break
    case 2002: // access_token过期
      res.message = 'Login expired, please login again'
      if (store.state.blockchain === 0) {
        axios.post('/trade/oauth/token?grant_type=password', {
          username: LEND.localStorage('uuid_b'),
          password: LEND.localStorage('access_token_b'),
          client: 'frontend'
        }).then(res => {
          if (Number(res.code) === 2000) {
            store.dispatch('changeState', {
              type: 'blockchain',
              value: res.data.identif.email === '' ? 0 : 1
            })
            LEND.localStorage('access_token', res.data.access_token)
          } else if (Number(res.code) === 1006) {
            // 登录时返回状态是1006  请求重新授权
            location.href = '/trade/gxb/authorize'
            // location.href = 'https://mobile.lendx.vip/trade/gxb/authorize'
          } else {
            this.$toast('net error')
          }
        })
      } else { // 重定向到Personnal页面并打开login弹窗
        router.push({path: '/Login', query: {redirect: router.fullPath}})
      }
      break
    case 4000:
      console.log('request is error')
      break
    case -99:
      console.log('net error')
      break
    case -100:
      console.log('net error')
      break
    case 429:
      console.log('net error')
      break
    case -102:
      console.log('net error')
      break
    case 1010:
      console.log('net error')
      break
    case 4001:
      LEND.cleanCookies()
      // 更新用户信息
      break
    case 4002:
      LEND.cleanCookies()
      // 更新用户信息
      break
    case 4003:
      LEND.cleanCookies()
      // 更新用户信息
      break
    case 4006:
      // alert('url签名错误');
      break
  }
  return res.data
}, function (err) {
  return Promise.reject(err)
  // throw new Error('网络错误')
})
// 请求全局错误配置
Vue.prototype.$axios = axios
