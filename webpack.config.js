const path = require('path');
// vue-loader
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

const env=process.env.NODE_ENV;
console.log('------' + env + '-------');

global.dist = path.join(__dirname, '.', 'dist');

module.exports = {
    mode: 'development',
    entry: {
        app: [
            "babel-polyfill",
            path.join(__dirname, './src/index.js')
        ],
        vendor: [
            'vue', 'vue-router'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|jpg|gif|svg|eot|woff|woff2|ttf)$/,
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    plugins: [
        // 请确保引入这个插件来施展魔法
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, './index.html')
        }),
        // 将不变的第三方包提取出来缓存
        // new webpack.config.optimization.splitChunks({
        //     name: 'runtime'
        // }),
        // 压缩js
        new UglifyJSPlugin(),
        // 使vendor.[hash].js每次打包的时候hash不变，还要对应修改
        new webpack.HashedModuleIdsPlugin(),
        new CleanWebpackPlugin()
    ],
    // 路径配置
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            views: path.join(__dirname, 'views'),
            vue: 'vue/dist/vue.esm.js',
            common: path.join(__dirname, 'common')
        }
    },
}
