import React, { Component } from "react";

import Lotto from '../04.로또/LottoClass';

class GameMatcher extends Component {
    render() {
        // Query String에 담아서 온 데이터를 URLSearchParams를 이용하여 데이터값을 가져온다.
        let urlSearchParams = new URLSearchParams(this.props.location.search.slice(1));
        console.log('query 값 : ', urlSearchParams.get('query'));
        console.log('hello 값 : ', urlSearchParams.get('hello'));
        console.log('bye 값 : ', urlSearchParams.get('bye'));

        if(this.props.match.params.name === 'lotto-generator') {
            return <Lotto />
        } else if(this.props.match.params.name === 'index') {
            return <div>게임매쳐</div>
        } 
        return (
            <div>일치하는 게임이 없습니다.</div>
        );
    }
}

export default GameMatcher;