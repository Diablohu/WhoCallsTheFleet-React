const path = require('path')
const superBuild = require('./system/webpack/enter')


//


// 描述环境
// dev 开发 | dist 部署
const ENV = process.env.WEBPACK_BUILD_ENV || 'dev'

// 描述场景
// client 客户端 | server 服务端
const STAGE = process.env.WEBPACK_STAGE_MODE || 'client'


//


/**
 * {string} 打包目标目录
 * 默认会在该目录下建立 public 和 server 目录，分别对应 web 服务器和服务器执行代码
 */
const dist = path.resolve('./dist-web/')

/**
 * {object|function} Webpack 配置对象或生成方法，可为异步方法
 */
const config = async () => {
    if (STAGE === 'client' && ENV === 'dev') return await require('./src/webpack/client-dev')
    if (STAGE === 'client' && ENV === 'dist') return await require('./src/webpack/client-dist')

    if (STAGE === 'server' && ENV === 'dev') return await require('./src/webpack/client-dev')
    if (STAGE === 'server' && ENV === 'dist') return await require('./src/webpack/client-dist')

    return {}
}

/**
 * {object} 目录或文件别名
 * 在项目内的 Javascript 和 CSS/Less/Sass 中的引用方法均可直接使用这些别名，如
 * Javascript: require('@app/create.js')
 * LESS: @import "@app/base.less"
 * 
 * 建议使用绝对路径
 */
const aliases = {
    '@app': path.resolve('./src'),
    '@appConfig': path.resolve('./src/config'),
    '@appUtils': path.resolve('./src/utils'),
    '@appUI': path.resolve('./src/client/ui'),
    '@appLogic': path.resolve('./src/client/logic'),
    "@appData": path.resolve('./src/data'),
    "@appConstants": path.resolve('./src/constants'),
    "@appConst": path.resolve('./src/constants'),
    "@appRedux": path.resolve('./src/redux'),
    '@appLocales': path.resolve('./locales'),
    '@appAssets': path.resolve('./assets'),
    '@appDocs': path.resolve('./docs'),

    "~base.less": path.resolve('./src/client/ui/base.less'),
    "~Assets": path.resolve('./assets'),
    "~/": path.resolve('./src/client/ui')
}

/**
 * {function} 在 Webpack 打包执行前运行的方法，可为异步
 */
const beforeBuild = async () => {
    if (STAGE === 'client' && ENV === 'dist') {
        await require('./scripts/clean-web')()
    }
}
/**
 * {function} 在 Webpack 打包执行后运行的方法，可为异步
 */
const afterBuild = async () => {
    if (STAGE === 'client' && ENV === 'dist') {
        await require('./scripts/copyfiles-web')()
        await require('./scripts/clean-web-sourcemap')()
    }
}


//


superBuild({
    config,
    dist,
    aliases,
    beforeBuild,
    afterBuild,
})
