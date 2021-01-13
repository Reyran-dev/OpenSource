// Class 방식의 Source Code
// useRef : 일반 값을 기억
// useMemo : 복잡한 함수의 결과값을 기억(return 값)
// useCallBack : 함수 자체를 기억
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
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

// Hooks 방식
const LottoHooks = () => {
    const [winBalls, setWinBalls] = useState([]);

    // Hooks 방식에서 LottoHooks 전체가 다시 렌더링 되기 때문에 성능이슈 발생할 가능성 높음
    // 따라서 useMemo를 사용하여 필요없는 렌더링을 제외 할 수 있도록 해야한다.
    const lottoNumbers = useMemo( () => getWinNumbers(), [winBalls] ); // 두번째 인자값이 바뀌지 않는 한, 함수가 재실행 되지 않는다.
                                                                       // Hooks 는 순서가 중요
    const [winNumbers, setWinNumbers] = useState(lottoNumbers);

    //const [winNumbers, setWinNumbers] = useState(getWinNumbers());
    const [bonus, setBonus] = useState(null);
    const [redo, setRedo] = useState(false);
    const timeouts = useRef([]);

    // useEffect에서 componentDidUpdate일때만 함수를 실행하고 싶을때(componentDidMount에서는 실행X)
    // 하나의 패턴으로 기억하자
    // const mounted = useRef(false);
    // useEffect( () => {
    //     if(!mounted.current){
    //         mounted.current = true;
    //     }
    //     // 실행 하고 싶은 내용
    // }, [바뀌는 값]);

    // useCallback으로 함수를 기억해두면, 함수가 재 실행 될 때 해당 함수를 다시 생성하는 것을 막아준다.
    // 자식 Component에 props로 함수를 넘길 때에는 꼭 useCallback를 넣어줘야 한다.
    // useCallback를 안넣어주면, 자식 Component에서 props를 받을때 마다 매번 렌더링을 한다.
    const onClickRedo =  useCallback( () => {
        console.log('onClickRedo');
        console.log(winNumbers);
        
        setWinNumbers(getWinNumbers());
        setWinBalls([]);
        setBonus(null);
        setRedo(false);
        timeouts.current = [];  // timeouts.current가 바뀜
    }, [winNumbers]); // useCallback안에서 쓰이는 state는 항상 두번째 인자값으로 넣어줘야 값이 바뀐다.
                      // 두번째 인자값에 winNumbers 안넣어주면, 처음 실행할때 생성된 winNumbers가 계속 log에 나온다.

    useEffect ( () => {
        console.log('useEffect');

        for (let i = 0; i < winNumbers.length -1; i++) {
            timeouts.current[i] = setTimeout( () => { // timeouts.current 배열에 요소를 넣어줌
                setWinBalls( (prevBalls) => [ ...prevBalls, winNumbers[i] ] );
            }, ( i + 1 ) * 1000 );
        } // 당첨공 6개

        timeouts.current[6] = setTimeout( () => {
            setBonus(winNumbers[6]);
            setRedo(true);
        }, 7000); // 보너스 당첨공 1개

        return () => {
            timeouts.current.forEach( (v) => {
                clearTimeout(v);
            });
        }; // componentWillUnmaount의 역할

    }, [timeouts.current]); // timeouts.current가 바뀌는 시점 : onClickRedo때
    // input가 빈 배열 = componentDidMount랑 똑같다.
    // 배열에 요소가 있으면 componentDidMount와 componentDidUpdate 둘 다 수행

    return (
        <>
            <div>당첨숫자</div>
            <div id = "결과창">
                { winBalls.map( (v) => <Ball key = {v} number = {v} />) } {/*props 전달 부분 */}
            </div>
            <div>보너스!</div>
            { bonus && <Ball number = { bonus } />} {/* 조건문 */}
            { redo && <button onClick = { onClickRedo }>한 번 더!</button>} {/* 조건문 */}
        </>
    );
};

export default LottoHooks;