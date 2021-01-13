// Hooks 방식의 Source Code
import React, {useState} from 'react'; // 이런식으로 아래처럼 두개로 나뉘어진 구문을 하나로 합치기 가능
//const React = require('react');
//const { useState } = React; // => react -> React -> useState

const TicTacToe = () => {
    const[text, setText] = useState('Hello Webpack 실시간 변경 반영중');
    
    return (
        <>
            <h1>{text}</h1>
        </>
    );
}

export default TicTacToe;