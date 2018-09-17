'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const nowenv=process.argv.splice(2)
console.log('打包環境::'+(!!nowenv[0]?nowenv[0]:'綫上'))//此处自定义
module.exports = {
    dev: {

        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            // '/apidm/**': {
            //     target: 'http://1-api.lendx.vip/', // 通过本地服务器将你的请求转发到这个地址
            //     //target:'http://1-api.lendchain.io/',  
            //     changeOrigin: true, // 设置这个参数可以避免跨域 
            //     pathRewrite: {
            //         '^/apidm/': '/'
            //     }
            // }
            // '/price': {
            //     target: 'https://price.lendx.vip',
            //     secure: false,
            //     changeOrigin: true, // 设置这个参数可以避免跨域 
            // },
            // '/trade': {
            //     target: 'http://main.lendx.vip',
            //     secure: false,
            //     changeOrigin: true, // 设置这个参数可以避免跨域 
            // },
        },
        // Various Dev Server settings
      //  host:'localhost',
        // host: 'webapp.lendx.vip', // can be overwritten by process.env.HOST host: '10.7.20.105'
        host: '192.168.50.150', // can be overwritten by process.env.HOST host: '10.7.20.105'
        port: 81, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        // Use Eslint Loader?
        // If true, your code will be linted during bundling and
        // linting errors and warnings will be shown in the console.
        useEslint: false,
        // If true, eslint errors and warnings will also be shown in the error overlay
        // in the browser.
        showEslintErrorsInOverlay: false,

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'cheap-module-eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        cssSourceMap: true
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
      //  assetsSubDirectory: 'static/'+(!!nowenv[0]?nowenv[0]:''),//此处自定义
        assetsSubDirectory: 'static/'+(!!nowenv[0]?nowenv[0]:'')+new Date().getFullYear()+(new Date().getMonth()+1).toLocaleString('zh',{minimumIntegerDigits:2})+new Date('2018-09-04').getDate().toLocaleString('zh',{minimumIntegerDigits:2})+new Date().getHours().toLocaleString('zh',{minimumIntegerDigits:2})+new Date().getMinutes().toLocaleString('zh',{minimumIntegerDigits:2}),//暂时全部放在test
        assetsPublicPath: 'https://s.lendx.vip/',

        /**
         * Source Maps
         */

        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
}