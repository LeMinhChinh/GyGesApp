import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class Landing extends Component{
    state = {
        products: [],
        idCust: []
    };

    componentDidMount = () => {
        var self = this

        fetch('http://localhost:8888/api/getProducts')
        .then((response) => response.json())
        .then((response) => {
            self.setState({idCust: response.idCustomer})
        });
    }
    handleChangeCustomer = (e) => {
       // console.log(e.target.value)
        var self = this
        let idCus = document.getElementById('idCustomer').value;
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        let header = new Headers
        fetch('http://localhost:8888/api/filterProducts',{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": token
        },
        body: JSON.stringify({
            idCus: document.getElementById('idCustomer').value
        })
        })
        .then((response) => response.json())
        .then(function(response) {
            self.setState({
                products: response.filterProduct
            })
        })
        .catch(function() {
        });
    }

    render = () => {
        // console.log(this.state.products);

        let pushedCustomers = []
        const optionsCustomers = this.state.idCust.map((product, index) => {
            if(typeof product.customer_id !== 'undefined' && pushedCustomers.indexOf(product.customer_id) === -1){
                pushedCustomers.push(product.customer_id)
                return (
                    <option key={index} value={product.customer_id}>{product.customer_id}</option>
                )
            }
        })
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
                        <div className="container-fluid">
                                <div>
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="#">Wishlist</a>
                                        </li>
                                        <li className="breadcrumb-item active">Overview</li>
                                    </ol>
                                    <div className="dropdown">
                                        <select onChange={this.handleChangeCustomer} id="idCustomer">
                                            <option>--- Choose Customer ---</option>
                                            {optionsCustomers}
                                        </select>
                                    </div>
                                    <table className="table table-border table-striped table-hover mt-2">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>ID Product</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Image</th>
                                                <th>Id Customer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.products.map((product, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{product.id_pr}</td>
                                                            <td>{product.id_product}</td>
                                                            <td>{product.name}</td>
                                                            <td>{product.price}</td>
                                                            <td>
                                                                <img src={product.image} alt="" width="120" height="120" className="img-fluid" />
                                                            </td>
                                                            <td>{product.customer_id}</td>
                                                        </tr>
                                                    )
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                        </div>

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
