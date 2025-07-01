const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const fileListPugin = require("@winning-plugin/webpack-filelist-export")
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = defineConfig({
  transpileDependencies: ['vue-clamp', 'resize-detector'],
  chainWebpack: (config) => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach((item) => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: [
            './src/style/index.scss'
          ]
        })
        .end()

    })
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))

      config
      .plugin("filePlugin")
      .after("html")
      .use(fileListPugin,[
        {
          jsExternals: [
            `/web-public/icons/base.js`,
            `/web-public/icons/multi.js`,
          ]
        }
      ]).end()
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
})
