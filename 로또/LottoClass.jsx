// Class 방식의 Source Code
import React, {Component} from 'react';

class LottoClass extends Component{
    state = {
                text : 'Hello Webpack 실시간 변경 반영중',
            };
        
    render() {
        return (
            <>
                <h1>{this.state.text}</h1>
            </>);
    }
}

// 파일을 쪼개기 위한 선언부
export default LottoClass;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// export default NewName; => default로 export 한 경우는 import NewName;의 형식으로 가져오는 변수             //
// export const NewName; => default가 아닌 경우로 export 한 경우는 import {NewName}의 형식으로 가져오는 변수   //
// 한 개의 file default로 선언은 한 번만 가능하며, 그 외의 경우는 여러번 사용 가능하다.                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////