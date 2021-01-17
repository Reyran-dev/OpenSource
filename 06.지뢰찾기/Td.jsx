import React, { useCallback, useContext } from 'react';
import { CODE, OPEN_CELL, CLICK_MINE, FLAG_CELL, QUESTION_CELL, NORMALIZE_CELL, TableContext } from './MineSearch';

// 상태에 따라 td의 색깔을 지정
const getTdStyle = (code) => {
    switch (code) {
        case CODE.NORMAL:
        case CODE.MINE:
            return {
                background: '#444',
            };
        case CODE.CLICKED_MINE:
        case CODE.OPENED:
            return {
                background: 'white',
            };
        case CODE.FLAG_MINE:
        case CODE.FLAG:
            return {
                background: 'red',
            };
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:
            return {
                background: 'yellow',
            };
        default: 
            return {
                background: 'white',
            };
    }
};

// code에 따라 td에 들어갈 글자를 지정
const getTdText = (code) => {
    switch (code) {
        case CODE.NORMAL:
            return '';
        case CODE.MINE:
            // Debugging용 임시
            return 'X';
        case CODE.CLICKED_MINE:
            return '펑';
        case CODE.FLAG_MINE:
        case CODE.FLAG:
            return '!';
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:
            return '?';
        default: 
            return '';
    }
};

const Td = ({ rowIndex, cellIndex }) => {
    // dispatch는 Context API로 한 방에 MineSearch.jsx에서 보내준 상태
    const { tableData, halted, dispatch } = useContext(TableContext);

    // Td에서 일어난 Event를 dispatch를 통해 MineSearch에서 직접 Data 변경
    const onClickTd = useCallback(() => {
        if (halted) {   // Game이 멈췄을 경우에는 아무일도 발생 시키지 않는다.
            return;
        }
        switch (tableData[rowIndex][cellIndex]) {
            case CODE.OPENED:
            case CODE.FLAG_MINE:
            case CODE.FLAG:
            case CODE.QUESTION:
            case CODE.QUESTION_MINE:
                return;
            case CODE.NORMAL:
                dispatch({ type: OPEN_CELL, row: rowIndex, cell: cellIndex });
                return;
            case CODE.MINE:
                dispatch({ type: CLICK_MINE, row: rowIndex, cell: cellIndex });
                return;
            default:
                return;
        }
    }, [tableData[rowIndex][cellIndex], halted]); // 바뀌는 data를 넣어준다

    const onRightClickTd = useCallback((e) => {
        e.preventDefault(); // 우 클릭시 웹페이지에서 메뉴가 안나오게 하기위한 처리

        if (halted) {   // Game이 멈췄을 경우에는 아무일도 발생 시키지 않는다.
            return;
        }

        switch (tableData[rowIndex][cellIndex]) {
            case CODE.NORMAL:
            case CODE.MINE:
                dispatch({ type: FLAG_CELL, row: rowIndex, cell: cellIndex });
                return;
            case CODE.FLAG_MINE:
            case CODE.FLAG:
                dispatch({ type: QUESTION_CELL, row: rowIndex, cell: cellIndex });
                return;
            case CODE.QUESTION:
            case CODE.QUESTION_MINE:
                dispatch({ type: NORMALIZE_CELL, row: rowIndex, cell: cellIndex });
                return;
            default:
                return;
        }
    }, [tableData[rowIndex][cellIndex], halted]); // 바뀌는 data를 넣어준다

    return(
        // TableData는 useContext로부터 받고,
        // 내가 몇번째 칸, 줄인지는 부모로부터 props로 받아 td에서 정확하게 자신의 data를 구성할 수 있다.
        <td style={getTdStyle(tableData[rowIndex][cellIndex])}
            onClick={onClickTd} // 왼쪽 클릭
            onContextMenu={onRightClickTd} // 오른쪽 클릭
        >{getTdText(tableData[rowIndex][cellIndex])}</td>
    );
};

export default Td;