import React, { useReducer, createContext, useMemo, useEffect, memo } from 'react';
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
    data: {
        row: 0,
        cell: 0,
        mine: 0,
    },
    timer: 0,
    result: '',
    halted: true,
    openedCount : 0,
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
export const INCREMENT_TIMER = 'INCREMENT_TIMER';

const reducer = (state, action) => {
    switch (action.type) {
        case START_GAME:
            return {
                ...state,
                data: {
                    row: action.row,
                    cell: action.cell,
                    mine: action.mine,
                },
                openedCount : 0,
                // 지뢰 심는 부분이 복잡하므로 함수로 만들어서 사용
                tableData: plantMine(action.row, action.cell, action.mine),                
                halted: false,
                timer: 0,
            };
        case OPEN_CELL: {
            // 불변성 유지를 위한 Code
            const tableData = [...state.tableData];
            //tableData[action.row] = [...state.tableData[action.row]];
            tableData.forEach((row, i) => { // 모든 칸에 대한 불변성 유지를 위해  새로운 객체로 만든다.
                tableData[i] = [...state.tableData[i]];
            });

            // const와 let의 차이 : const는 상수로, 재정의가 불가능 하지만, let으로 선언하면 재 정의가 가능하다.
            const checked = []; // 한번 검사한 칸은 다시 검사 못하도록 칸 정보를 배열로 만들어 관리
            let gameOpenedCount = 0;  // 열린 칸 숫자를 세기 위한 변수

            const checkAround = (row, cell) => {   // Click한 Cell 기준으로 주변의 지뢰 갯수를 검사하는 함수
                if ([CODE.OPENED, CODE.FLAG_MINE,
                     CODE.FLAG, CODE.QUESTION_MINE,
                     CODE.QUESTION].includes(tableData[row][cell])) {
                    return;
                }   // 닫힌 칸만 열기
                if (row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) {                    
                    return;
                }   // 맨 위칸, 맨 아래칸, 맨 오른칸, 맨 왼칸 필터링                
                if (checked.includes(row + '/' + cell)) {   // 한번 검사한 칸은 다시 검사 못하도록 칸 정보를 배열로 만들어 관리
                    return;
                } else {
                    checked.push(row + '/' + cell);
                }; 

                if (tableData[row][cell] === CODE.NORMAL) { // 현재 칸이 닫힌 칸일 때만 카운트 증가
                    gameOpenedCount += 1; // 칸이 열릴 때 마다 +1
                }

                let around = [];
            
                if (tableData[row - 1]) { //Click한 위치의 윗줄이 존재 할 경우
                    around = around.concat(
                        tableData[row - 1][cell],
                        tableData[row - 1][cell + 1],
                        tableData[row - 1][cell - 1],
                    );
                }
                around = around.concat( //Click한 Cell의 양 옆칸 확인
                    tableData[row][cell - 1],
                    tableData[row][cell + 1],
                );
                if (tableData[row + 1]) { //Click한 위치의 아랫줄이 존재 할 경우
                    around = around.concat(
                        tableData[row + 1][cell - 1],
                        tableData[row + 1][cell],
                        tableData[row + 1][cell + 1],
                    );
                }

                const count = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;
                tableData[row][cell] = count; // 지뢰 갯수 표기

                if (count === 0) {  // 지뢰 갯수가 0개일 경우 주변 칸을 열어주는 함수
                    const near = [];

                    if(row - 1 > -1) { // 제일 윗칸을 클릭하는 경우
                        near.push([row - 1, cell - 1]);
                        near.push([row - 1, cell]);
                        near.push([row - 1, cell + 1]);
                    }

                    near.push([row, cell - 1]);
                    near.push([row, cell + 1]);

                    if(row + 1 < tableData.length) {    // 제일 아랫칸을 클릭하는 경우
                        near.push([row + 1, cell - 1]);
                        near.push([row + 1, cell]);
                        near.push([row + 1, cell + 1]);
                    }

                    near.forEach((n) => {
                        if (tableData[n[0]][n[1]] !== CODE.OPENED) {
                            checkAround(n[0], n[1]);
                        }
                    });
                }
            };

            checkAround(action.row, action.cell);   // 주변 위치 확인해서 비어있을 경우 열어주는 함수

            let halted = false;
            let result = '';

            if (state.data.row * state.data.cell - state.data.mine === state.openedCount + gameOpenedCount) { // 승리
                halted = true;
                result = state.timer + '초만에 승리하셨습니다.';
            }

            return {
                ...state,
                tableData,
                openedCount: state.openedCount + gameOpenedCount,
                halted,
                result,
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
        case INCREMENT_TIMER: {
            return {
                ...state,
                timer: state.timer + 1,
            };
        }
        default:
            return state;
    }
};

const MineSearch = memo(() => {
    // state 는 우리가 앞으로 컴포넌트에서 사용 할 수 있는 상태를 가르키게 되고,
    // dispatch는 액션을 발생시키는 함수. 이 함수는 다음과 같이 사용한다: dispatch({ type: 'INCREMENT' }).
    // 그리고 useReducer에 넣는 첫번째 파라미터는 reducer 함수이고, 두번째 파라미터는 초기 상태를 뜻함.
    const [state, dispatch] = useReducer(reducer, initialState);

    // Code가 길어진다 싶으면 구조분해를 한번 해주자
    const { tableData, halted, timer, result } = state;

    // rerendering으로 인한 성능 저하 방지를 위해 useMemo 사용하여 캐싱
    const value = useMemo(() => ({ tableData: tableData, halted: halted, dispatch }), [tableData, halted]); //dispatch는 항상 같게 유지되기 때문에 뺀다.

    useEffect(() => {   // 1초마다 타이머를 돌린다.
        let timer;

        if (halted === false) {
            timer = setInterval(() => {
                dispatch({ type: INCREMENT_TIMER });
            }, 1000);
        }
        return () => {
            clearInterval(timer);
        }
    }, [halted]);

    return (
        //Provider를 사용하여 자식 Component들에게 줄 정보를 정의(tableData와 dispatch)
        <TableContext.Provider value={value}>
            <Form />
            <div>{timer}</div>
            <Table />
            <div>{result}</div>
        </TableContext.Provider>
    );
});

export default MineSearch;