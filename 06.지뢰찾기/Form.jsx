import React, { useState, useCallback, useContext, memo } from 'react';
import { START_GAME, TableContext } from './MineSearch';

// 쓸데없는 렌더링 방지를 위해 Memo 사용
// memo 사용시에는 하위 Component도 전부 memo가 적용 되어야 상위 Component도 memo가 적용된다.
const Form = memo(() => {
    const [row, setRow] = useState(10);
    const [cell, setCell] = useState(10);
    const [mine, setMine] = useState(20);
    // MineSearch.jsx에 있는 tableContext를 가져온다.
    const { dispatch } = useContext(TableContext);

    // callBack은 항상 써주는게 좋다.
    const onChangeRow = useCallback((e) => {
        setRow(e.target.value);
    }, []);

    const onChangeCell = useCallback((e) => {
        setCell(e.target.value);
    }, []);

    const onChangeMine = useCallback((e) => {
        setMine(e.target.value);
    }, []);

    // Context API 적용 할 부분
    const onClickBtn = useCallback(()=> {
        dispatch({ type: START_GAME, row, cell, mine });
    }, [row, cell, mine]);

    return (
        <div>
            <input type="number" placeholder="세로" value={row} onChange={onChangeRow} />
            <input type="number" placeholder="가로" value={cell} onChange={onChangeCell} />
            <input type="number" placeholder="지뢰" value={mine} onChange={onChangeMine} />
            <button onClick={onClickBtn}>시작</button>
        </div>
    );
});

export default Form;