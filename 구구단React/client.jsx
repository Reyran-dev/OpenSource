//import React, { Component } from "react" // 신규버전 문법
const React = require('react'); // 구버전 문법

// import ReactDOM from "react-dom" // 신규버전 문법
const ReactDOM = require('react-dom'); // 구버전 문법

const GuGuDan = require('./GuGuDan'); // const명령어로 GuGuDan.jsx파일을 불러올수 있음

ReactDOM.render(<GuGuDan />, document.querySelector('#root'));