import React, { memo } from 'react';

const Ball = memo( ( { number } ) => { // Hooks가 아닌 함수 Component, memo를 넣어서 PureComponent 역할을 한다.
    let background;

    if(number <= 10) {
        background = 'red';
    }else if(number <= 20) {
        background = 'orange';
    }else if(number <= 30) {
        background = 'yellow';
    }else if(number <= 40) {
        background = 'blue';
    }else {
        background = 'green';
    }

    return (
        <div className = "ball" style = { { background } }>{ number }</div>
    );
});

export default Ball;