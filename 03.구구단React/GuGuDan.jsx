const React = require('react');
const { useState, useRef } = React;

// Hooks방식의 React
// 기존에 ref와 setState쓰지 않는 Component만 함수로 만들었으나,
// 함수에도 setState와 ref를 사용가능하게 만든 방식
const GuGuDan = () => {
    // State와 setState를 각각 분리하여 선언(해당 형식은 '비 구조화 할당 / 구조분해'이라고 부른다)
    // 비 구조화 할당 or 구조분해 (Distructuring) : 변수 부분에 배열이나 객체를 쓰는 방법
    const[first, setFirst] = useState(Math.ceil(Math.random() * 9));
    const[second, setSecond] = useState(Math.ceil(Math.random() * 9));
    const[value, setValue] = useState('');
    const[result, setResult] = useState('');
    
    // refernce 사용법(useRef())
    const inputRef = useRef(null);

    // Class방식의 React에서 setState를 위에 선언한 setFirst등등으로 바꿔준다.
    const onSubmitForm = (e) => {
        e.preventDefault();
        if(parseInt(value) === first * second){
            setResult('정답 : ' + value);
            setFirst(Math.ceil(Math.random() * 9));
            setSecond(Math.ceil(Math.random() * 9));
            setValue('');
            // Ref로 DOM에 접근 할 때에는 current 명시
            inputRef.current.focus();
        }else{
            setResult('땡!');
            setValue('');
            // Ref로 DOM에 접근 할 때에는 current 명시
            inputRef.current.focus();
        }
    };

    // Event Listener도 똑같이 함수로 만들어준다
    const onChangeInput = (e) => {
        setValue(e.target.value);
    }
 
    // Hooks의 단점 : 함수의 State가 바뀌면 함수가 통째로 다시 실행되기 때문에 조금 부하가 걸린다.

    return (
    <>
        <div>{first} 곱하기 {second} 은?</div>
        <form onSubmit = {onSubmitForm}>
            <input ref = {inputRef} onChange = {onChangeInput} value = {value}/>
            <button>입력</button>
        </form>
        <div>{result}</div>
    </>
    );
};

//export default GuGuDan; // 신규버전 문법
module.exports = GuGuDan;  // const명령어로 GuGuDan.jsx파일을 불러오게 하기위한 작업(구버전)