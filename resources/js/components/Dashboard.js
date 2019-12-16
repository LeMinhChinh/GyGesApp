import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter,Route, Link} from 'react-router-dom'


export default class Dashboard extends Component{

    render = () => {
        return (
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark static-top">
                    <a className="navbar-brand mr-1" href="">
                        <i className="fas fa-user"></i>
                    </a>

                    <button className="btn btn-link btn-sm text-white order-1 order-sm-0" id="sidebarToggle" href="#">
                        <i className="fas fa-bars"></i>
                    </button>

                    <form className="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">
                        <input type="text" className="form-control" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2"></input>
                        <button className="btn btn-primary" type="button">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>

                    <ul className="navbar-nav ml-auto ml-md-0">
                        <li className="nav-item dropdown no-arrow mx-1">
                            <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-bell fa-fw"></i>
                                <span className="badge badge-danger">9+</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="alertsDropdown">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown no-arrow mx-1">
                            <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-envelope fa-fw"></i>
                                <span className="badge badge-danger">7</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="messagesDropdown">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown no-arrow">
                            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-user-circle fa-fw"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                                <a className="dropdown-item" href="#">Settings</a>
                                <a className="dropdown-item" href="#">Activity Log</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">Logout</a>
                            </div>
                        </li>
                    </ul>
                </nav>

                <div id="wrapper">
                        <ul className="sidebar navbar-nav">
                            <li className="nav-item active">
                                <a className="nav-link" href="">
                                <i className="fas fa-fw fa-home"></i>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="" id="pagesDropdown" role="button" data-toggle="dropdown">
                                    <i className="fas fa-fw fa-tv"></i>
                                    <span>Product</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="">
                                <i className="fas fa-fw fa-file-invoice"></i>
                                <span>Wishlist</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="">
                                <i className="fas fa-fw fa-users"></i>
                                <span>Users</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="">
                                <i className="fas fa-fw fas fa-hand-point-left"></i>
                                <span>Back page</span></a>
                            </li>
                        </ul>
                    <div id="content-wrapper">
                        <footer className="sticky-footer">
                            <div className="container my-auto">
                                <div className="copyright text-center my-auto">
                                <span>Copyright © Your Website 2019</span>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>

                <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                            <div className="modal-footer">
                                <form >
                                    <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                                    <button className="btn btn-primary" type="submit">Logout</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
        )
    }
}
