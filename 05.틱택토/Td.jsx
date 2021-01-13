import React, { useCallback } from 'react';
import { CLICK_CELL } from './TicTacToe'; // action 호출

// TicTacToe -> Table -> Tr -> Td 순으로 dispatch를 넘겨준다.
// 이러한 과정이 Depth가 깊어질수록 복잡하기 때문에 Context API를 사용한다.
const Td = ( {rowIndex, cellIndex, dispatch, cellData} ) => {
    const onClickTd = useCallback( () => {
        console.log(rowIndex, cellIndex);

        if(cellData){   // 이미 해당 cell에 Data가 있으면, 그냥 Return
            return;
        }

        // useReducer는 비동기로 State가 바뀐다.
        dispatch({ type: CLICK_CELL, row: rowIndex, cell: cellIndex });
    }, [cellData]);

    return (
        <td onClick = { onClickTd }>{ cellData }</td>
    );
};

export default Td;