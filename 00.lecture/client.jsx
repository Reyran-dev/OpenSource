// 쪼갠 파일을 불러오기 위한 선언부분
import React from 'react'; // <=> const React = require('react');
import ReactDom from 'react-dom'; // <=> const ReactDom = require('react-dom');

// 쪼갠 NewName.jsx의 Class를 불러올 수 있다.
import NewName from './NewName'; // <=> const NewName = require('./NewName');

ReactDom.render(<NewName />, document.querySelector('#root'));