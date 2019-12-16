import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './todo.css'
import {BrowserRouter,Route, Link} from 'react-router-dom'
// import Master from './components/Master'
// import TodoList from './components/TodoList'
// import TodoItem from './components/TodoItem'
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './components/Landing'

ReactDOM.render(
    <Landing />,
    document.getElementById('root')
);
