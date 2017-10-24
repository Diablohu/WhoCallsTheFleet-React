module.exports = (async () => ({

    // 
    domain: require('../../../apps/app/config/site').domain,
    server: global.NOT_WEBPACK_RUN
        ? require('../../../apps/app/server').default
        : '',

    //
    webpack: {
        client: await (async () => {
            // 描述环境
            // dev 开发 | dist 部署
            const ENV = process.env.WEBPACK_BUILD_ENV || 'dev'

            // 描述场景
            // client 客户端 | server 服务端
            const STAGE = process.env.WEBPACK_STAGE_MODE || 'client'

            if (STAGE === 'client' && ENV === 'dev') return await require('./client-dev')
            if (STAGE === 'client' && ENV === 'dist') return await require('./client-dist')

            if (STAGE === 'server' && ENV === 'dev') return await require('./client-dev')
            if (STAGE === 'server' && ENV === 'dist') return await require('./client-dist')

            return {}
        })()
    }
}))()