// const fs = require('fs-extra')
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const {
    app: pathApp,
    output: pathOutput,
    ...dirs
} = require('../../../directories.js')
const {
    pathNameSub
} = require(path.resolve(pathApp, './config/site'))
const publicPath = `/${pathNameSub}/`

const pluginCopyImages = require('../base/plugin-copy-images')

const config = require('../base/factory')({
    isExtractTextPlugin: true
})

module.exports = (async () => Object.assign({}, config, {

    entry: {
        ...config.entry,
        "critical-extra-old-ie": [
            "babel-polyfill",
            path.resolve(pathApp, './client/critical.extra-old-ie.js')
        ],
        client: [
            path.resolve(pathApp, `./client`)
        ]
    },

    output: {
        filename: `[name].[chunkhash].js`,
        chunkFilename: `chunk.[name].[chunkhash].js`,
        path: pathOutput,
        publicPath: publicPath // TODO 改成静态第三方URL用于CDN部署 http://localhost:3000/
    },

    plugins: [
        'default',
        {
            'pwa': {
                outputPath: path.resolve(pathOutput, '../'),
                outputFilename: `service-worker.${pathNameSub}.js`,
                // customServiceWorkerPath: path.normalize(appPath + '/src/client/custom-service-worker.js'),
                globPattern: `/${pathNameSub}/**/*`,
                globOptions: {
                    ignore: [
                        '/**/_*/',
                        '/**/_*/**/*'
                    ]
                },
                // appendUrls: getUrlsFromRouter()
                appendUrls: []
            }
        },
        [
            ...config.plugins,
            new ExtractTextPlugin('[name].[chunkhash].css'),
            new webpack.DefinePlugin({
                '__ELECTRON__': false,
                // '__PUBLIC__': JSON.stringify(publicPath),
            }),
            ...await pluginCopyImages(),
        ]
    ],

})
)()