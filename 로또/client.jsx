// 쪼갠 파일을 불러오기 위한 선언부분
import React from 'react'; // <=> const React = require('react');
import ReactDom from 'react-dom'; // <=> const ReactDom = require('react-dom');

import LottoClass from './LottoClass';

ReactDom.render(<LottoClass />, document.querySelector('#root'));