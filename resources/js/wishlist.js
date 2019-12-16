import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './todo.css'
import {BrowserRouter,Route, Link} from 'react-router-dom'

import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import Setting from './components/Setting'
ReactDOM.render(
    <BrowserRouter>
        <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/wishlistview">WishList</Link></li>
                <li><Link to="/setting">Setting</Link></li>
            </ul>
            <Route exact path="/" render={ ( ) => (<h2> HomePage </h2>) } />
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/wishlistview" component={Landing}/>
            <Route path="/setting" component={Setting} />
        </div>
    </BrowserRouter>,
    document.getElementById('root')
);
