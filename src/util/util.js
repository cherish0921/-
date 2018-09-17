import backstatus from '../assets/i18n/lang/backstatus.js'
let util = {
  backstatus: backstatus,
  nowstatusLang: function (bs) {
    let lang = 'en'
    lang = (navigator.appName === 'Netscape') ? (navigator.language).substr(0, 2) : (navigator.userLanguage).substr(0, 2)// 获取浏览器配置语言前两位
    if (lang === 'zh') lang = 'ch'
    return bs[localStorage.getItem('LENDCHAIN_LANGUAGE')] || bs[lang]
  },
  fastCopy: function (element, txt) { // 复制功能（pC可用，手机使用Clipboard。js）
    element.select() // 选中文本
    document.execCommand('copy') // 执行浏览器复制命令
    return true
  },
  // fastpaste: function(e) { // paste事件
  //     var clipboardData = window.clipboardData // IE
  //     if (!clipboardData) { // chrome
  //         clipboardData = e.originalEvent.clipboardData
  //     }
  // },
  fastpaste: function () {
    return window.clipboardData.getData('Text')
  },
  // 检测是否开启localstorage
  localStorageEnable: function () {
    if (localStorage) {
      try {
        localStorage.setItem('key', 'value')
        localStorage.removeItem('key')
        return true
      } catch (e) {
        return false
      }
    } else {
      return false
    }
  },
  localStorage: function (key, val) {
    if (typeof val === 'undefined') {
      return localStorage[key.toString()]
    } else {
      localStorage.setItem(key.toString(), val)
    }
  },
  removeLocalStorage: function (key) {
    localStorage.removeItem(key.toString())
  },
  clearLocalStorage: function (key) {
    localStorage.clear()
  },
  // 检测是否开启cookie
  CookieEnable: function () {
    let domainurl = document.domain
    var result = false
    if (navigator.cookiesEnabled) {
      return true
    }
    document.cookie = 'cancookie=yes;max-age=86400;path=/;domain=' + domainurl
    var cookieSet = document.cookie
    if (cookieSet.indexOf('cancookie=yes') > -1) {
      result = true
    }
    document.cookie = 'cancookie=yes;max-age=0;path=/;domain=' + domainurl
    return result
  },
  toPercentage: function (val) { // 处理成百分数 如 +14% -15%
    return (Number(val) >= 0 ? '+' : '-') + util.fixFloat(Math.abs(Number(val)) * 100, 2) + '%'
  },
  cookie: function (key, value, options) { // 获得或设置cookie的值
    /* if (!CookieEnable()) {
        alert('对不起，您的浏览器的Cookie功能被禁用，请开启')
        return
      } */
    if (typeof value === 'undefined') { // 读取
      var cookies = document.cookie.split(';')
      for (var i = 0, len = cookies.length; i < len; i++) {
        let cookie = cookies[i].split('=')
        if (encodeURIComponent(cookie[0].replace(/^\s+|\s+$/g, '')) === key) {
          return decodeURIComponent(cookie[1])
        }
      }
      return null
    }
    options = options || {}
    var cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value)
    if ((typeof options.expires) !== 'undefined') {
      if (typeof options.expires === 'number') {
        let days = options.expires
        let exp = new Date()
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000)
        cookie += ';expires=' + exp.toUTCString()
      } else {
        cookie += ';expires=' + options.expires.toUTCString()
      }
    }
    if (typeof options.path !== 'undefined') {
      cookie += ';path=' + options.path
    }
    if (typeof options.domain !== 'undefined') {
      cookie += ';domain=' + options.domain
    } else {
      if (location.href.indexOf('lendchain') >= 0) {
        cookie += ';domain=lendx.vip'
      } else if (location.href.indexOf('lendx') > 0) {
        cookie += ';domain=lendx.vip'
      }
    }
    if (options.secure) {
      cookie += ';secure'
    }
    document.cookie = cookie
  },
  removeCookie: function (key, options) { // 删除对应的cookie的值
    options = options || {}
    options.expires = -1
    util.cookie(key, '', options)
  },
  cleanCookies: function () { // 清空所有cookie
    let domainurl = document.domain
    var keys = document.cookie.match(/[^ =;]+(?==)/g)
    if (keys) {
      for (var i = keys.length; i--;) {
        document.cookie = keys[i] + '=0;expires=' + new Date(-1).toUTCString()
        document.cookie = keys[i] + '=0;expires=' + new Date(-1).toUTCString() + ';path=/;'
        document.cookie = keys[i] + '=0;expires=' + new Date(-1).toUTCString() + ';path=/;domain=' + domainurl
      }
    }
  },
  encrypt: function (obj, salt1) { // md5加密
    // 需要md5支持，且仅支持一维json对象
    let salt
    if (util.localStorage('access_token') !== null && !(typeof (util.localStorage('access_token')) === 'undefined')) {
      salt = salt1 || util.localStorage('access_token')
    }
    let params = Object.keys(obj).sort()
    var paramsString = ''
    var returnObj = {}
    if (params.length > 0) {
      for (var i = 0; i < params.length; i++) {
        if (i < params.length - 1) {
          paramsString = +(params[i].toString() + '=' + obj[params[i]].toString() + '&')
        } else {
          paramsString = +(params[i].toString() + '=' + obj[params[i]].toString() + '&key=' + salt)
        }
        returnObj[params[i]] = obj[params[i]] //  {参数名:Md5((原参数值+token).toString())}
      }
    } else {
      paramsString = ('key=' + salt)
    }
    returnObj['sign'] = md5(paramsString.toString())
    return returnObj
  },
  timeToLocal: function (timeString) { /* //timeString 时间格式Thu Jun 22 2017 08:17:30 GMT+0000"  +0000是必须带的 */
    timeString = String(timeString).slice(0, 10)
    /* var unixTimestamp = new Date(parseInt(timeString) * 1000)
    var timeStringArr = unixTimestamp.toLocaleTimeString().split(':')
    let hours = ((unixTimestamp.getUTCHours() - unixTimestamp.getTimezoneOffset() / 60) > 23) ? ((unixTimestamp.getUTCHours() - unixTimestamp.getTimezoneOffset() / 60) - 24) : (unixTimestamp.getUTCHours() - unixTimestamp.getTimezoneOffset() / 60)
    var str = (unixTimestamp.toLocaleDateString('zh', {hour12: false}).replace(new RegExp('/', 'g'), '.') + ' ' + hours + ':' + timeStringArr[1] + ':' + timeStringArr[2])
    return str */
    var time = new Date(parseInt(timeString) * 1000)
    var y = time.getFullYear()
    var m = time.getMonth() + 1
    var d = time.getDate()
    var h = time.getHours()
    var mm = time.getMinutes()
    var s = time.getSeconds()
    return y + '.' + (Number(m)<10?('0'+m):m) + '.' + (Number(d)<10?('0'+d):d) + ' ' + (Number(h) < 10 ? ('0' + h) : h) + ':' + (Number(mm) < 10 ? ('0' + mm) : mm) + ':' + (Number(s) < 10 ? ('0' + s) : s)
  },
  timeToGmt: function (time) { // 转化为GMT格式
    var GMT = new Date(time)
    return GMT
  },
  decNum: function (a) { /* 获取小数位数 */
    var r = 0
    a = a.toString()
    if (a.indexOf('.') !== -1) {
      r = a.split('.')[1].length
    }else if(a.indexOf('e') !== -1){
      r =Math.abs(Number(a.split('e')[1])) 
    }
    return r
  },
  int: function (a) { /* 去除小数点并转成数值 */
    return parseInt(a.toString().replace('.', ''))
  },
  calc: function (a, b, type) { // 加减乘除
    var result, da = util.decNum(a),
      db = util.decNum(b),
      dsum = da + db,
      dmin = Math.min(da, db),
      dmax = Math.max(da, db)
    dsum += dmax - dmin
    dsum = Math.pow(10, dsum)
    dmax = Math.pow(10, dmax)
    a = util.int(a)
    b = util.int(b)
    if (da > db) {
      b *= Math.pow(10, da - db)
    } else {
      a *= Math.pow(10, db - da)
    }
    switch (type) {
      case 'add':
        result = (a + b) / dmax
        break
      case 'subtract':
        result = (a - b) / dmax
        break
      case 'multiply':
        result = (a * b) / dsum
        break
      case 'divide':
        result = a / b
        break
    }
    return result
  },
  a: function (a, b, digits) {
    var ds = Number(0 || digits)
    var result = (digits > 0) ? util.calc(a, b, 'add').toFixed(ds) : util.calc(a, b, 'add')
    return result
  },
  s: function (a, b, digits) {
    var ds = Number(0 || digits)
    var result = (digits > 0) ? util.calc(a, b, 'subtract').toFixed(ds) : util.calc(a, b, 'subtract')
    return result
  },
  m: function (a, b, digits) {
    var ds = (0 || digits)
    var result = (digits > 0) ? util.calc(a, b, 'multiply').toFixed(ds) : util.calc(a, b, 'multiply')
    return result
  },
  d: function (a, b, digits) {
    var ds = Number(0 || digits)
    var result = (digits > 0) ? util.calc(a, b, 'divide').toFixed(ds) : util.calc(a, b, 'divide')
    return result
  },
  floorFun: function (value, n) {
    return Math.floor(value * Math.pow(10, n)) / Math.pow(10, n)
  },
  fixFloat: function (numString, mixed) {
    let resultnum = numString.toString()
    let point_ = resultnum.indexOf('.')
    if (point_ >= 0) {
      let int_ = resultnum.slice(0, point_)
      let flot_ = resultnum.slice(point_, resultnum.length).slice(0, 7)
      while (flot_.charAt(flot_.length - 1) === '0') {
        flot_ = flot_.slice(0, flot_.length - 1)
      }
      resultnum = int_ + flot_
    }
    return resultnum
  },
  depositStatus: function (statuscode) {
    let statuscode1 = Number(statuscode)
    switch (statuscode1) {
      case 0:
        return this.nowstatusLang(this.backstatus).deposit.status0
      case 1:
        return this.nowstatusLang(this.backstatus).deposit.status1
      case 2:
        return this.nowstatusLang(this.backstatus).deposit.status2
      case 3:
        return this.nowstatusLang(this.backstatus).deposit.status3
      default:
    }
  },
  withdrawStatus: function (statuscode) {
    let statuscode1 = Number(statuscode)
    switch (statuscode1) {
      case 0:
        return this.nowstatusLang(this.backstatus).withdraw.status0
      case 1:
        return this.nowstatusLang(this.backstatus).withdraw.status1
      case 2:
        return this.nowstatusLang(this.backstatus).withdraw.status2
      case 3:
        return this.nowstatusLang(this.backstatus).withdraw.status3
      case 4:
        return this.nowstatusLang(this.backstatus).withdraw.status4
      default:
    }
  },
  getBorrowStatus: function (statuscode) {
    let statuscode1 = Number(statuscode)
    switch (statuscode1) {
      case -2:
        return this.nowstatusLang(this.backstatus).borrow[`status-2`]
      case -1:
        return this.nowstatusLang(this.backstatus).borrow[`status-1`]
      case 0:
        return this.nowstatusLang(this.backstatus).borrow[`status0`]
      case 1:
        return this.nowstatusLang(this.backstatus).borrow[`status1`]
      case 11:
        return this.nowstatusLang(this.backstatus).borrow[`status11`]
      case 12:
        return this.nowstatusLang(this.backstatus).borrow[`status12`]
      case 13:
        return this.nowstatusLang(this.backstatus).borrow[`status13`]
      case 14:
        return this.nowstatusLang(this.backstatus).borrow[`status14`]
      case 16:
        return this.nowstatusLang(this.backstatus).borrow[`status16`]
      case 17:
        return this.nowstatusLang(this.backstatus).borrow[`status17`]
      default:
    }
  },
  inverstmentStatus: function (statuscode) {
    let statuscode1 = Number(statuscode)
    switch (statuscode1) {
      case -2:
        return this.nowstatusLang(this.backstatus).inverst[`status-2`]
      case -1:
        return this.nowstatusLang(this.backstatus).inverst[`status-1`]
      case 0:
        return this.nowstatusLang(this.backstatus).inverst[`status0`]
      case 1:
        return this.nowstatusLang(this.backstatus).inverst[`status1`]
      case 2:
        return this.nowstatusLang(this.backstatus).inverst[`status2`]
      case 3:
        return this.nowstatusLang(this.backstatus).inverst[`status3`]
      case 11:
        return this.nowstatusLang(this.backstatus).inverst[`status11`]
      case 12:
        return this.nowstatusLang(this.backstatus).inverst[`status112`]
      case 13:
        return this.nowstatusLang(this.backstatus).inverst[`status13`]
      case 14:
        return this.nowstatusLang(this.backstatus).inverst[`status14`]
      case 16:
        return this.nowstatusLang(this.backstatus).inverst[`status16`]
      case 17:
        return this.nowstatusLang(this.backstatus).inverst[`status17`]
      default:
    }
  },
  browser: function (type) {
    var u = navigator.userAgent.toLowerCase()
    var versions = { // 移动终端浏览器版本信息
      trident: u.indexOf('trident') > -1, // IE内核
      presto: u.indexOf('presto') > -1, // opera内核
      webKit: u.indexOf('appleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
      mobile: !!u.match(/appleWebKit.*mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/), // ios终端
      android: u.indexOf('android') > -1 || u.indexOf('linux') > -1, // android终端或者uc浏览器
      iPhone: u.indexOf('iphone') > -1 || u.indexOf('mac') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('ipad') > -1, // 是否iPad
      iPod: u.indexOf('ipod') > -1,
      webApp: u.indexOf('safari') == -1, // 是否web应该程序，没有头部与底部
      wx: u.indexOf('micromessenger') > -1,
      nokia: u.indexOf('nokia') > -1,
      pcwx: u.indexOf('windowswechat') > -1,
      pc: !/Android|iPhone|SymbianOS|Windows\s+Phone|iPad|iPod/i.test(u),
      // ie: u.indexOf('msie') > -1,
      ie: (u.indexOf('msie') > -1 || u.indexOf('edge') > -1 || u.indexOf('trident') > -1) && u.indexOf('opera') == -1,
      x5: u.indexOf('mqqbrowser') > -1,
      weibo: u.indexOf('weibo') > -1 || u.indexOf('Weibo') > -1
    }
    return versions[type]
  },
  browserName: function () {
    var browserName = ''
    if (browser('pc')) {
      browserName = 'pc'
    } else {
      browserName = 'mobile'
    }
    return browserName
  },
  appName: function () {
    var appName = ''
    if (browser('wx') || browser('pcwx')) {
      appName = 'wechat'
    } else if (browser('weibo')) {
      appName = 'weibo'
    } else {
      appName = 'other'
    }
    return appName
  },
  preLoadImg: function (url, callback) { // 图片预加载
    var img = new Image()// 创建一个Image对象，实现图片的预下载
    img.onload = function () {
      img.onload = null
      typeof callback === 'function' && callback(img)
    }
    img.onerror = function () {}
    img.src = url
  },
  accDiv: function (arg1, arg2) { // 除法
    var t1 = 0,
      t2 = 0,
      r1, r2
    try {
      t1 = arg1.toString().split('.')[1].length
    } catch (e) {}
    try {
      t2 = arg2.toString().split('.')[1].length
    } catch (e) {}
    r1 = Number(arg1.toString().replace('.', ''))
    r2 = Number(arg2.toString().replace('.', ''))
    return util.accMul((r1 / r2), pow(10, t2 - t1))
  },
  accMul: function (arg1, arg2) { // 乘法
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString()
    try {
      m += s1.split('.')[1].length
    } catch (e) {}
    try {
      m += s2.split('.')[1].length
    } catch (e) {}
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
  },
  accAdd: function (arg1, arg2) { // 加法
    var r1, r2, m
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
  },
  accSub: function (arg1, arg2) { // 减法
    var r1, r2, m, n
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    n = (r1 >= r2) ? r1 : r2
    return ((arg1 * m - arg2 * m) / m).toFixed(n)
  },
  getQueryString: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  },
  checkPass: function (pwdText) {
    var pwdStrength = 0
    if (typeof pwdText === 'string') {
      if (pwdText.length < 8) {
        // 密码过短
        pwdStrength = -101
      } else if (pwdText.length > 20) {
        // 密码过长
        pwdStrength = -102
      } else {
        var containsDigitPattern = /^.*?[\d]+.*$/g
        var containsLetterPattern = /^.*?[a-z]+.*$/g
        var containsLetterPattern1 = /^.*?[A-Z]+.*$/g
        // eslint-disable-next-line
              var containsCharPattern = /^.*?[`~@#\$%\^&\*\(\)\-_=\+\\\|;:'",<\.>\/\?].*$/g
        if (containsCharPattern.test(pwdText)) {
          pwdStrength++
        }
        if (containsLetterPattern.test(pwdText)) {
          pwdStrength++
        }
        if (containsLetterPattern1.test(pwdText)) {
          pwdStrength++
        }
        if (containsDigitPattern.test(pwdText)) {
          pwdStrength++
        }
      }
    } else {
      // 密码无效
      pwdStrength = -404
    }
    return pwdStrength
  },
  checkMobile: function (str, iscnb) { // 校验手机
    let iscn = iscnb || false
    let recn = /^1[3|4|5|6|7|8|9][0-9]{9}$/
    let reNcn = /^[0-9]{6,15}$/
    let re = iscn ? recn : reNcn
    return re.test(str)
    // return str
  },
  updateUSerinfo: function (a, b) { // 更新userinfo 并 返回最终字符串形式json
    var newa
    if (typeof (a) === 'undefined' || a == null) {
      newa = {}
    } else {
      newa = a
    }
    for (var i in b) {
      newa[i] = b[i]
    }
    return JSON.stringify(newa)
  },
  checkMail: function (str) { // 校验邮箱
    // eslint-disable-next-line
      var reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g
    return reg.test(str)
  },
  hasClass: function (elem, cls) {
    cls = cls || ''
    if (cls.replace(/\s/g, '').length == 0) return false // 当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ')
  },
  addClass: function (ele, cls) {
    if (!hasClass(elem, cls)) {
      ele.className = ele.className == '' ? cls : ele.className + ' ' + cls
    }
  },
  removeClass: function (ele, cls) {
    if (hasClass(elem, cls)) {
      var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' '
      while (newClass.indexOf(' ' + cls + ' ') >= 0) {
        newClass = newClass.replace(' ' + cls + ' ', ' ')
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '')
    }
  },
  readlangname: function () {
    let lang = localStorage.getItem('LENDCHAIN_LANGUAGE') ? localStorage.getItem('LENDCHAIN_LANGUAGE') : ((navigator.appName === 'Netscape') ? (navigator.language).substr(0, 2) : (navigator.userLanguage).substr(0, 2))
    lang = (lang === 'ch' || lang === 'zh') ? 'ch' : (lang === 'ko' ? 'ko' : 'en')
    return lang
  }
}

export default util = util
