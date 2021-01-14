import React, { useCallback, useEffect, useRef, memo } from 'react';
import { CLICK_CELL } from './TicTacToe'; // action 호출

// TicTacToe -> Table -> Tr -> Td 순으로 dispatch를 넘겨준다.
// 이러한 과정이 Depth가 깊어질수록 복잡하기 때문에 Context API를 사용한다.
const Td = memo( ({rowIndex, cellIndex, dispatch, cellData}) => { // memo를 이용하여 최적화
    console.log('td rendering'); // 최적화를 위한 log

    // 최적화를 위한 구문들 작성
    const ref = useRef([]);

    useEffect( () => {
        // 어느 요소가 Rerendering을 실행하는지 모르니 일단 다 찍어보자 -> 검증 결과가 cellData가 바뀌는걸 확인
        console.log(rowIndex === ref.current[0], cellIndex === ref.current[1], dispatch === ref.current[2], cellData === ref.current[3]);

        // cellData가 어떻게 바뀌었는지 보다 자세히 확인하기 위한 log -> 검증 결과 Td의 문제가 아닌, 부모 component를 살펴야함
        console.log(cellData, ref.current[3]);

        ref.current = [rowIndex, cellIndex, dispatch, cellData];

    }, [rowIndex, cellIndex, dispatch, cellData]);

    // Td Click Event
    const onClickTd = useCallback( () => {
        console.log(rowIndex, cellIndex);

        if (cellData) {   // 이미 해당 cell에 Data가 있으면, 그냥 Return
            return;
        }

        // useReducer는 비동기로 State가 바뀐다.
        dispatch({ type: CLICK_CELL, row: rowIndex, cell: cellIndex });
    }, [cellData]);

    return (
        <td onClick = {onClickTd}>{cellData}</td>
    );
});

export default Td;