import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter,Route, Link} from 'react-router-dom'


export default class Dashboard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            product: []
        }
    }

    componentDidMount = () => {
        fetch('http://localhost:8888/api/testAPI')
        .then((response) => response.json())
        .then((response) => {
            let products = response.product
            let data = products.map((item) => {
                return [
                    item.id,
                    item.handle,
                    item.title,
                    item.variants,
                    item.images
                ]
            })
            this.setState({
                product: data
            })
        });
    }

    render = () => {
        const {
            product
        } = this.state

        const item = product.map((index, item) => {
            return {
                id: index,
                ids: item.id,
                title: item.title
            }
        })

        return (
            <p style={{ margin: '0px' }}>React JS</p>
        )
    }
}
