export var Posturl = (!process.online ? 'http://apitest.lendx.vip' : 'https://api.lendx.vip') // build 测试版
export var Domainurl = (process.env.NODE_ENV === 'production' ? '.lendx.vip' : '.lendx.vip')
