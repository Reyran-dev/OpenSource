// Class 방식의 Source Code
import React, { Component, useState } from 'react';
import Ball from './Ball';

function getWinNumbers() {
    console.log('getWinNumbers');

    const candidate = Array(45).fill().map((v, i) => i + 1); // map : 반복문
    const shuffle = [];

    while (candidate.length > 0) {
        shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
    }
    const bonusNumber = shuffle[shuffle.length - 1];
    const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);

    return [...winNumbers, bonusNumber];
};

class LottoClass extends Component {
    state = {
        winNumbers : getWinNumbers(),   // 당첨 숫자를 미리 뽑아놓는다.
        winBalls : [],  // 당첨공
        bonus : null,   // 보너스 공
        redo : false,
    };
    
    timeouts = [];

    //공통되는 부분은 따로 빼준다.
    runTimeouts = () => {
        console.log('run Timeouts');

        const { winNumbers } = this.state;
        for (let i = 0; i < this.state.winNumbers.length -1; i++) {
            this.timeouts[i] = setTimeout( () => {
                this.setState( (prevState) => {
                    return {
                        winBalls : [...prevState.winBalls, winNumbers[i]],
                    };
                });
            }, ( i + 1 ) * 1000 );
        } // 당첨공 6개

        this.timeouts[6] = setTimeout( () => {
            this.setState({
                bonus : winNumbers[6],
                redo : true,
            });
        }, 7000); // 보너스 당첨공 1개
    };

    componentDidMount() { // Compoenent가 Mount 될 때
        console.log('did Mount');

        this.runTimeouts();
    };

    componentDidUpdate(prevProps, prevState) { // Component가 Update될 때
        console.log('did Update');

        if(this.state.winBalls.length === 0) {
            this.runTimeouts();
        }
    };

    componentWillUnmount() { // Component가 UnMount될 때 setState등을 지워주지 않으면 메모리 누수 발생
        console.log('did Unmount');

        this.timeouts.forEach( (v) => {
            clearTimeout(v);
        });
    };

    onClickRedo = () => {
        console.log('on Click Redo');

        this.setState( {
            winNumbers : getWinNumbers(),   // 당첨 숫자를 미리 뽑아놓는다.
            winBalls : [],  // 당첨공
            bonus : null,   // 보너스 공
            redo : false,   // 재시도
        });
        this.timeouts = [];
    };

    render() {
        const { winBalls, bonus, redo } = this.state;
        return (
            <>
                <div>당첨숫자</div>
                <div id = "결과창">
                    { winBalls.map( (v) => <Ball key = {v} number = {v} />) } {/*props 전달 부분 */}
                </div>
                <div>보너스!</div>
                { bonus && <Ball number = { bonus } />} {/* 조건문 */}
                { redo && <button onClick = { this.onClickRedo }>한 번 더!</button>} {/* 조건문 */}
            </>
        );
    }
}

export default LottoClass;