const path = require('path');
const RefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
    mode : 'development',
    devtool : 'eval', // hidden-source-map
    resolve : {
        extensions : ['.jsx', '.js'],
    },
    entry : {
        app : './client',
    },
    module : {
        rules : [{
            test : /\.jsx?/,
            loader : 'babel-loader',
            options : {
                presets : [
                    ['@babel/preset-env', {
                        targets : {
                            browsers : ['> 1% in KR'], // browerslist
                        },
                    }],
                    '@babel/preset-react'
                ],
                plugins : [
                    '@babel/plugin-proposal-class-properties',
                    'react-refresh/babel',
                ],
            },
        }],
    },
    plugins : [
        new RefreshWebpackPlugin()
    ], 
    // webPack의 출력부
    output : {
        path : path.join(__dirname, 'dist'), // __dirname : 현재 폴더(lecture)
        filename : 'app.js'
    },
    devServer : {
        publicPath : '/dist/',
        hot : true,
    },
};