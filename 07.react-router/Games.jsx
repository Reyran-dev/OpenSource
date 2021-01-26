import React from 'react';
import { BrowserRouter, Link, HashRouter, Route } from 'react-router-dom';

import GameMatcher from './GameMatcher';

const Games = () => {
    return (
        <BrowserRouter>
        <div>
            {/*query String : url에 직접 원하는 값을 넣어서 전달*/}
            <Link to ="/game/lotto-generator?query=10&hello=minhosong&bye=react">로또 추첨기</Link>
            &nbsp;
            <Link to="/game/index">게임 매쳐</Link>
            &nbsp;
            <Link to="/game/default">아무것도 없음</Link>
            &nbsp;
        </div>
        <div>
            {/*바뀌는 영역, :name = params*/}
            {/* <Route path="/game/:name" component={GameMatcher} /> */}
            {/*render를 이용하여, props를 바로 넘길 수 있다.*/}
            <switch>
                {/* Switch안에 있는 Route path는 가장 먼저 일치하는 경우만 한번 렌더링 한다. */}
                <Route path="/game/:name" render={(props) => <GameMatcher {...props} />} />
                <Route path="/game/index" render={(props) => <GameMatcher {...props} />} />
                <Route path="/game/index" render={(props) => <GameMatcher {...props} />} />
                <Route path="/game/index" render={(props) => <GameMatcher {...props} />} />
                <Route path="/game/index" render={(props) => <GameMatcher {...props} />} />
                <Route path="/game/index" render={(props) => <GameMatcher {...props} />} />
            </switch>

            {/* 상위의 /주소와 /game/index주소를 동시에 일치한다고 처리해서 두번 렌더링 됨 */}
            {/* 이럴때 path앞에 exact를 써서 path와 정확하게 주소가 일치할때만 렌더링 되게 만든다. */}
            <switch>
                {/* <Route path="/" render={(props) => <GameMatcher {...props} />} /> */}
                <Route exact path="/" render={(props) => <GameMatcher {...props} />} />
                <Route exact path="/game/index" render={(props) => <GameMatcher {...props} />} />
            </switch>
        </div>
        </BrowserRouter>

        // <HashRouter>
        //     <div>
        //         {/*바뀌지 않는 영역*/}
        //         <Link to ="/lotto-generator">로또 추첨기</Link>
        //         &nbsp;
        //     </div>
        //     <div>
        //         {/*바뀌는 영역*/}
        //         <Route path="/lotto-generator" component={Lotto} />
        //     </div>
        // </HashRouter>
    );
};

export default Games;