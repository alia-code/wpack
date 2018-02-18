require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const extractSass = new ExtractTextWebpackPlugin({
    filename: '[name].css',
    disable: false,
});
const config = {
    entry: {
        main: './src/index.ts',
        async: './src/async.ts',
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, process.env.themeDirectory),
        publicPath: process.env.themeDirectory,
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin([process.env.themeDirectory], {allowExternal: true}),
        new webpack.WatchIgnorePlugin([
            /\.d\.ts$/,
            /\.DS_Store$/
        ]),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Popper: 'popper.js'
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'commons',
        //     filename: 'commons.js',
        //     minChunks: Infinity
        // }),
        extractSass,
        new CopyWebpackPlugin ([
            { from: './src/theme', to: './' }
        ]),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/,
                loader: extractSass.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader'
                    },
                    ],
                    fallback: 'style-loader',
                }),
            },
            {
                test: /\.(jpe?g|png|gif|svg)/,
                use: [
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            svgo: {
                                removeComments: true,
                                removeDoctype: true,
                                removeViewBox: true,
                                minifyStyles: true
                            }
                        }
                    },
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: './src'
                        }
                    }],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.php$/,
                use: [
                    {loader: 'raw-loader'},
                ]
            }
        ],
    },
};

if (process.env.NODE_ENV === 'development') {
    config.watch = true;
    config.devtool = 'source-map';
    config.devServer = {
        hot: true,
        historyApiFallback: true,
    };
    config.plugins.push(
        new BrowserSyncPlugin({
            port: 3000,
            proxy: process.env.appURL,
            watchOptions: {
                include: process.env.themeDirectory,
                ignoreInitial: true,
                ignored: './src'
            },
            injectChanges: true,
            ui: false,
            ghostMode: false,
            logPrefix: process.env.appName,
            logFileChanges: true
        }, {
            reload: false
        }),
        new webpack.HotModuleReplacementPlugin()
    );
} else {
    config.filename = '[name].[hash:8].js';
    extractSass.filename = '[name].[hash:8].css';
    config.plugins.push(
        new UglifyJSPlugin(),
        new ManifestPlugin(),
        new CompressionWebpackPlugin({
            asset: '[path].gz',
        })
    );
}
module.exports = config;