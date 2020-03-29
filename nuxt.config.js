import TerserPlugin from 'terser-webpack-plugin'

require('dotenv').config()
const env = process.env
;['PUBLIC_PATH', 'API_SERVER', 'COOKIE_PATH', 'NO_LOGIN'].forEach(key =>
  console.log('%s\t: %s', key, env[key])
)

const isProd = env.MODE == 'prod'
const apiServer = env.API_SERVER // 不能以斜杠结尾
const publicPath = env.PUBLIC_PATH // 必须以斜杠结尾
const favicon =
  env.FACICON ||
  'https://deepexi-moby.oss-cn-shenzhen.aliyuncs.com/daas-data-app/daas-logo.png'
const aliIconFont =
  env.ALI_ICON_FONT || '//at.alicdn.com/t/font_1242739_5i7puj92i7p.css'
const config = {
  favicon,
  aliIconFont,
  env: {
    mock: {
      '/deepexi-daas-metrics': 'http://39.100.141.76:3000/mock/976/',
      '/deepexi-daas-datasource': 'http://39.100.141.76:3000/mock/637/',
      '/deepexi-daas-data-service': 'http://39.100.141.76:3000/mock/62/',
      '/deepexi-daas-security': 'http://39.100.141.76:3000/mock/757/'
    },
    //开发环境
    dev: {
      '/deepexi-daas-metrics': 'http://daas.dev.deepexi.top/',
      '/deepexi-daas-datasource': 'http://daas.dev.deepexi.top/',
      '/deepexi-daas-data-service': 'http://daas.dev.deepexi.top/',
      '/deepexi-daas-security': 'http://daas.dev.deepexi.top/'
    },
    // 测试环境
    test: {
      '/deepexi-daas-metrics': 'http://daas.test.deepexi.top/',
      '/deepexi-daas-datasource': 'http://daas.test.deepexi.top/',
      '/deepexi-daas-data-service': 'http://daas.test.deepexi.top/',
      '/deepexi-daas-security': 'http://daas.test.deepexi.top/'
    },
    //预生产环境
    uat: {
      '/deepexi-daas-metrics': 'http://daas.uat.deepexi.top/',
      '/deepexi-daas-datasource': 'http://daas.uat.deepexi.top/',
      '/deepexi-daas-data-service': 'http://daas.uat.deepexi.top/',
      '/deepexi-daas-security': 'http://daas.uat.deepexi.top/'
    }
  }
}

let axios = {
  proxy: true
}

// 如果生产指定apiServer, 则使用绝对路径请求api
if (isProd && apiServer) {
  axios = {
    proxy: false,
    baseURL: apiServer
  }
}

module.exports = {
  srcDir: 'src/',
  mode: 'spa',
  env: {
    MODE: env.MODE,
    NO_LOGIN: env.NO_LOGIN,
    BANNED: env.BANNED,
    COOKIE_PATH: env.COOKIE_PATH || '/'
  },
  proxy: config.env[env.MODE],
  router: {
    middleware: ['auth', 'permission', 'redirect'],
    mode: 'hash'
  },
  /*
   ** Build configuration
   */
  build: {
    publicPath,
    extractCSS: true,
    /* babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: '~node_modules/@femessage/theme-deepexi/lib'
          }
        ]
      ]
    }, */
    /*
     ** Run ESLint on save
     */
    extend(config, {isDev, isClient}) {
      // 避免警告提示
      config.performance = Object.assign({
        hints: 'warning',
        maxEntrypointSize: 5000000,
        maxAssetSize: 3000000
      })

      if (isDev && isClient) {
        config.devtool = '#source-map'
      }
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'DEEPEXI DaaS',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {'http-equiv': 'x-ua-compatible', content: 'IE=edge, chrome=1'},
      {
        hid: 'description',
        name: 'description',
        content: 'deepexi daas,大数据,开发平台,数据应用'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: config.favicon
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: config.aliIconFont
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#5D81F9'
  },
  /**
   * Share variables, mixins, functions across all style files (no @import needed)
   * @Link https://github.com/nuxt-community/style-resources-module/
   */
  styleResources: {
    less: '~assets/var.less'
  },
  css: [
    {
      src: '~assets/global.less',
      lang: 'less'
    }
  ],
  plugins: [
    {
      src: '~/plugins/axios'
    },
    {
      src: '~/plugins/element'
    },
    {
      src: '~/plugins/prototype'
    }
  ],
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    ['@nuxtjs/dotenv', {path: './'}]
  ],
  axios
}
