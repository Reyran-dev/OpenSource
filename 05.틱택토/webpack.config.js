// webPack는 node가 실행하는 영역이기 때문에, 여타 jsx 파일과는 달리 import 사용 불가
// node에서 경로를 쉽게 다루기 위한 선언
const path = require('path');
// 개발용 Server Refresh(Source에서 수정사항이 있을 경우, 바로 Web에 반영 = 핫로더)
const RefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
    name : 'tictactoe-setting',
    mode : 'development', // 실서비스 : production으로 변경
    devtool : 'eval',

    // app부의 파일 확장자를 안적어도 가능하게 하기 위한 설정
    resolve : {
        extensions: ['.js', '.jsx']
    },

    // webPack의 입력부
    entry : {
        // 현재 폴더에 있는 client.jsx파일을 불러온다
        // 또한 './client.jsx'파일과 './NewName.jsx'파일을 하나로 합치기 위해
        // app : ['./client.jsx', './NewName.jsx'], <- 이런식으로 써야하나,
        //  client.jsx파일에서 이미 NewName.jsx파일을 불러오기 때문에,
        // './NewName.jsx'부분은 안적어 준다.
        
        // resolve 안쓸경우, 확장자 까지 써준다.
        // app : ['./client.jsx'],

        // resolve 사용시, 확장자를 사용하지 않아도 된다.
        app : ['./client'],
    },

    module : {
        rules : [{
            test : /\.jsx?/,
            loader : 'babel-loader',
            options : {
                presets : [
                    ['@babel/preset-env', {
                        targets : {
                            browsers : ['> 1% in KR'], // browerslist(한국에서 1%이상이 사용중인 브라우저에 대한 지원)
                        },
                    }],
                    '@babel/preset-react'
                ],
                plugins : [
                    '@babel/plugin-proposal-class-properties',
                    'react-refresh/babel', // 개발용 Server Refresh(Source에서 수정사항이 있을 경우, 바로 Web에 반영 = 핫로더)
                ],
            },
        }],
    },
    plugins : [
        new RefreshWebpackPlugin()
    ], 
    // webPack의 출력부
    output : {
        path : path.join(__dirname, 'dist'), // __dirname : 현재 폴더(lecture), 실제 경로
        filename : 'app.js'
    },
    devServer : { // 개발용 Server Refresh(Source에서 수정사항이 있을 경우, 바로 Web에 반영 = 핫로더)
        publicPath : '/dist/', // webpack DevServer의 가상 경로
        hot : true,
    },
};