import React, { useRef, useEffect, memo, useMemo } from 'react';
import Td from './Td';

// memo는 반복문에서 사용하면 좋다.
const Tr = memo( ( {rowData, rowIndex, dispatch} ) => {
    console.log('Tr rendering');

    // 최적화를 위한 구문들 작성
    const ref = useRef([]);
    useEffect( () => {
        // 어느 요소가 Rerendering을 실행하는지 모르니 일단 다 찍어보자 -> 여기도 문제 없음 ㅋㅋ
        console.log(rowIndex === ref.current[0], dispatch === ref.current[1], rowData === ref.current[2]);

        ref.current = [rowIndex, dispatch, rowData];

    }, [rowIndex, dispatch, rowData]);

    return (
        <tr>
            {Array(rowData.length).fill().map( (td, i) => (
                // 성능 최적화의 최후의 수단 : useMemo
                useMemo( ()=>
                    <Td key={i} dispatch={dispatch} rowIndex={rowIndex}  cellIndex={i} cellData={rowData[i]}>{''}</Td>,
                    [rowData[i]],
                )
            ))}
        </tr>
    );
});

export default Tr;