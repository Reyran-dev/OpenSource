// 프로젝트 구조 : TicTacToe.jsx -> Table.jsx -> Tr.jsx -> Td.jsx
import React, { useEffect, useReducer, useCallback } from 'react';
import Table from './Table';

const initialState = {
    winner: '',
    turn: 'O',
    tableData: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ],
    recentCell: [-1, -1], // 없는 칸으로 초기화
};

 // Reducer의 type 변수는 바깥으로 빼는게 좋다.
 // action들은 export를 붙여서 모듈로 만들어준다.
export const SET_WINNER = 'SET_WINNER';
export const SET_DRAW = 'SET_DRAW';
export const CLICK_CELL = 'CLICK_CELL'; // Td.jsx 에서 사용
export const CHANGE_TURN = 'CHANGE_TURN';
export const RESET_GAME = 'RESET_GAME';

const reducer = (state, action) => {
    switch (action.type) {  // action을 실행하여 case 별로 나눠서 표시
        case SET_WINNER: {
            // state.winner = action.winner 이렇게 하면 안됨.
            return {
                ...state,   // 기존 State에서 바뀌는 부분만 바꾼다.
                winner: action.winner + '님의 승리!',
            };
        }
        case SET_DRAW: {
            // state.winner = action.winner 이렇게 하면 안됨.
            return {
                ...state,   // 기존 State에서 바뀌는 부분만 바꾼다.
                winner: '비겼습니다.',
            };
        }
        case CLICK_CELL: {
            const tableData = [...state.tableData]; // tableData의 얕은 복사(...XXX), 얕은 복사를 해야 불변성을 지킬수 있다.
            tableData[action.row] = [...tableData[action.row]]; // immer라는 라이브러리로 가독성 해결
            tableData[action.row][action.cell] = state.turn;
            return{
                ...state,
                tableData,
                recentCell: [action.row, action.cell],
            };
        }
        case CHANGE_TURN : {
            return{
                ...state,
                turn: state.turn === 'O' ? 'X' : 'O', // O일때 X로 바꾸고 X일때 O로 바꿈
            };
        }
        case RESET_GAME: {
            return {
                ...state,
                turn: 'O',
                tableData: [
                    ['', '', ''],
                    ['', '', ''],
                    ['', '', '']
                ],
                recentCell: [-1, -1], // 없는 칸으로 초기화
            }
        }
        default:
            return state;
    }
};

const TicTacToe = () => {
    // 해당 부분을 Reducer를 이용해서 줄이는 연습
    // const [winner, setWinner] = useState('');
    // const [turn, setTurn] = useState('O');
    // const [tableData, setTableData] = useState(['', '', ''], ['', '', ''], ['', '', '']);
    const [state, dispatch] = useReducer(reducer, initialState);

    const { tableData, turn, winner, recentCell } = state;

    const onClickTable = useCallback( () => {
        dispatch({ type: SET_WINNER, winner: 'O' }) // dispatch안에는 action 객체가 들어간다
        // 이 action을 dispatch할때마다 reducer부분이 실행 된다.
    }, []);

    // Td.jsx에서 reducer가 비동기로 처리되기 때문에, useEffect를 사용하여 처리
    useEffect( () => {
        const [row, cell] = recentCell;
        if (row < 0) {
            return;
        }

        let win = false;

        if (tableData[row][0] === turn && tableData[row][1] === turn && tableData[row][2] === turn) {
            win = true;
        }
        if (tableData[0][cell] === turn && tableData[1][cell] === turn && tableData[2][cell] === turn) {
            win = true;
        }
        if (tableData[0][0] === turn && tableData[1][1] === turn && tableData[2][2] === turn) {
            win = true;
        }
        if (tableData[0][2] === turn && tableData[1][1] === turn && tableData[2][0] === turn) {
            win = true;
        }

        if (win) {  // 승리시
            dispatch({ type: SET_WINNER, winner: turn });
            dispatch({ type: RESET_GAME });
        } else {
            let all = true; // all이 true일 경우, 무승부

            tableData.forEach( (row) => {   // 무승부 검사
                row.forEach( (cell) => {
                    if ( !cell ) {
                        all = false;
                    }
                });
            });
            
            if (all) {
                dispatch({ type: SET_DRAW });
                dispatch({ type: RESET_GAME });
            } else {
                dispatch({ type: CHANGE_TURN });
            }
        }
    }, [recentCell]); // click한 cell이 바뀔때 마다 검사

    return (
        <>
            <Table onClick={ onClickTable } tableData={ tableData } dispatch={ dispatch } />
            { winner && <div>{ winner }</div>}
        </>    
    );
};

export default TicTacToe;