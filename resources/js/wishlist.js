import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import hashHistory from "react-router";
import './todo.css'
import {BrowserRouter,Route, Link, Router} from 'react-router-dom'
import history from './history';

import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import Setting from './components/Setting'
import FrameExample from './components/FrameExample'
ReactDOM.render(
    <BrowserRouter basepath="/wishlist">
        <Router history={history}>
            <FrameExample history={history} />
        </Router>,
    </BrowserRouter>,
    document.getElementById('root')
);
