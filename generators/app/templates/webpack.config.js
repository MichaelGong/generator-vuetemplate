var path = require('path');
var webpack = require('webpack');
var IP = process.env.IP || false;
var ip = IP ? 'localhost': require('ip').address();
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
var ENV = process.env.NODE_ENV || 'development';
var isDev = ENV === 'development';
var port = 3007;

const cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}



module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: './main.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
        publicPath: isDev ? `//${ip}:${port}/dist/` : `//care.yiyaojd.com/dist/`,
        chunkFilename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
        sourceMapFilename: './map/[file].map'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options:{
                loaders: cssLoaders({ sourceMap: true, extract: isDev ? false : true }),
                postcss: [autoprefixer({ browsers: ['> 1%', 'last 10 versions'] })],
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader?-autoprefixer', 'postcss-loader']
            })
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader?-autoprefixer', 'postcss-loader', 'sass-loader']
            })
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.(jpg|jpeg|gif|png)$/i,
            loader: 'file-loader?name=[name].[hash:8].[ext]'
        }, {
            test: /\.woff(2)?(\??.*)$/,
            loader: 'url-loader?limit=1000&minetype=application/font-woff'
        }, {
            test: /\.(ttf|eot|svg)(\??.*)$/,
            loader: 'file-loader'
        }]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'vuex$': 'vuex/dist/vuex.js',
            'vueRouter$': 'vue-router/dist/vue-router.js',
        },
        extensions: ['.js', '.vue']
    },
    plugins: [
        // new WebpackMd5Hash(),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
        new ExtractTextPlugin({
            filename: (ENV === 'production' || ENV === 'testing') ?
            '[name].[contenthash:8].css' : '[name].css',
            disable: false, 
            allChunks: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                ip: JSON.stringify(ip),
                test: JSON.stringify(process.env.test)
            }
        }),
        // new webpack.DllReferencePlugin({
        //     context: path.join(__dirname, 'client'),
        //     manifest: require('./client/manifest.json')
        // }),
        new HtmlWebpackPlugin({
            filename: isDev ? path.join(__dirname, './index.html') : path.join(__dirname, './dist/index.html'),
            template: path.join(__dirname, './index.tpl'),
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackHarddiskPlugin(),
        new webpack.ProvidePlugin({
            //   $: 'jquery',
            //   jQuery: 'jquery',
            //   'window.jQuery': 'jquery'
        }),
        new CleanWebpackPlugin(['dist'],　 //匹配删除的文件
            {
                root: __dirname,       　　　　　　　　　　//根目录
                verbose: true,        　　　　　　　　　　//开启在控制台输出信息
                dry: false        　　　　　　　　　　//启用删除文件
            }
        ),
        
    ],
    devtool: isDev ? 'inline-source-map' : '',
    // devtool: 'source-map',
    
    devServer: {
        contentBase: __dirname,
        host: ip,
        port: port,
        // https: true,
        hot: true,
        // inline: true,
        // noInfo: true,
        historyApiFallback: true,
        // proxy: {
        //     '/yiyaoapp/*': {
        //         target: 'http://yiyaoapp-gw.jd.com',
        //         changeOrigin: true,
        //         // autoRewrite: true,
        //         // pathRewrite: {'^/yiyao' : ''},
        //         headers: {
        //             Host: 'yiyaoapp-gw.jd.com',
        //             Origin: 'http://care.yiyaojd.com'
        //         }
                
        //     }
        // }
    }
};

if (isDev) {
    module.exports.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()     
    );
} else {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告  
                warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            },
            sourceMap: true
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new BundleAnalyzerPlugin()
        // //在 plugin 中添加
        // new CompressionWebpackPlugin({ //gzip 压缩
        //     asset: '[path].gz[query]',
        //     algorithm: 'gzip',
        //     test: new RegExp(
        //         '\\.(js|css)$'    //压缩 js 与 css
        //     ),
        //     threshold: 10240,
        //     minRatio: 0.8
        // })
    );
}