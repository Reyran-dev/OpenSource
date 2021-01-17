import React, { useReducer, createContext, useMemo } from 'react';
import Table from './Table';
import Form from './Form';

export const CODE = {
    // 칸 상태에 대한 CODE 부여
    MINE: -7,
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    CLICKED_MINE: -6,
    OPENED: 0, // 0이상이면 전부 OPENED
}

// Context API를 통해 자식 Component에게 이하의 내용을 전달
export const TableContext = createContext({
    tableData: [],
    halted: true,
    dispatch: () => {},
});

const initialState = {
    tableData: [],
    timer: 0,
    result: '',
    halted: true,
};

// tableData 지뢰를 심는 함수
const plantMine = (row, cell, mine) => {
    console.log(row, cell, mine);

    // 지뢰를 심을 후보 칸들을 만든다.
    const candidate = Array(row * cell).fill().map((arr, i) => {
        return i;
    });

    const shuffle = [];

    while (candidate.length > row * cell - mine) {
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(chosen);
    }

    // return할 배열 변수를 생성
    const data = [];

    // 게임을 할 구역을 생성
    for (let i = 0; i < row; i++) {
        const rowData = [];

        data.push(rowData);

        for (let j = 0; j < cell; j++) {
            rowData.push(CODE.NORMAL); // 닫혀있는 칸 만들기
        }
    }

    for (let k = 0; k < shuffle.length; k++) {
        // 2차원 배열의 위치를 알아내기 위한 함수
        const ver = Math.floor(shuffle[k] / cell);
        const hor = shuffle[k] % cell;
        data[ver][hor] = CODE.MINE;
    }

    console.log(data);

    return data; // 지뢰를 심은 칸을 return;
};

export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';

const reducer = (state, action) => {
    switch (action.type) {
        case START_GAME:
            return {
                ...state,
                // 지뢰 심는 부분이 복잡하므로 함수로 만들어서 사용
                tableData: plantMine(action.row, action.cell, action.mine),
                halted: false,
            };
        case OPEN_CELL: {
            // 불변성 유지를 위한 Code
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            tableData[action.row][action.cell] = CODE.OPENED;

            return {
                ...state,
                tableData,
            };
        }
        case CLICK_MINE: {
            // 불변성 유지를 위한 Code
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            tableData[action.row][action.cell] = CODE.CLICKED_MINE;

            return {
                ...state,
                tableData,                
                halted : true, // 게임을 멈추기 위한 상태
            };
        }
        case FLAG_CELL: {
            // 불변성 유지를 위한 Code
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if(tableData[action.row][action.cell] === CODE.MINE){
                tableData[action.row][action.cell] = CODE.FLAG_MINE;
            } else {
                tableData[action.row][action.cell] = CODE.FLAG;
            }

            return {
                ...state,
                tableData,
            };
        }
        case QUESTION_CELL: {
            // 불변성 유지를 위한 Code
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if(tableData[action.row][action.cell] === CODE.FLAG_MINE){
                tableData[action.row][action.cell] = CODE.QUESTION_MINE;
            } else {
                tableData[action.row][action.cell] = CODE.QUESTION;
            }

            return {
                ...state,
                tableData,
            };
        }
        case NORMALIZE_CELL: {
            // 불변성 유지를 위한 Code
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if(tableData[action.row][action.cell] === CODE.QUESTION_MINE){
                tableData[action.row][action.cell] = CODE.MINE;
            } else {
                tableData[action.row][action.cell] = CODE.NORMAL;
            }

            return {
                ...state,
                tableData,
            };
        }
        default:
            return state;
    }
};

const MineSearch = () => {
    // state 는 우리가 앞으로 컴포넌트에서 사용 할 수 있는 상태를 가르키게 되고,
    // dispatch는 액션을 발생시키는 함수. 이 함수는 다음과 같이 사용한다: dispatch({ type: 'INCREMENT' }).
    // 그리고 useReducer에 넣는 첫번째 파라미터는 reducer 함수이고, 두번째 파라미터는 초기 상태를 뜻함.
    const [state, dispatch] = useReducer(reducer, initialState);
    // rerendering으로 인한 성능 저하 방지를 위해 useMemo 사용하여 캐싱

    // Code가 길어진다 싶으면 구조분해를 한번 해주자
    const { tableData, halted, timer, result } = state;
    const value = useMemo(() => ({ tableData: tableData, halted: halted,dispatch }), [tableData, halted]); //dispatch는 항상 같게 유지되기 때문에 뺀다.

    return (
        //Provider를 사용하여 자식 Component들에게 줄 정보를 정의(tableData와 dispatch)
        <TableContext.Provider value={value}>
            <Form />
            <div>{timer}</div>
            <Table />
            <div>{result}</div>
        </TableContext.Provider>
    );
};

export default MineSearch;