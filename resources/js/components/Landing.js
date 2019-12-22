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
        )
    }
}
