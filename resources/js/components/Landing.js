import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {
    Card,
    ResourceList,
    Avatar,
    ResourceItem,
    TextStyle,
    Filters,
    TextField,
    Button,
    Layout,
    Popover,
    OptionList,
    Page
} from '@shopify/polaris'
import '../wishlist.css'
import CurrencyFormat from 'react-currency-format';

export default class Landing extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedItems: [],
            queryValue: "",
            taggedWith: "",
            sortValue: "Count_wishlist",
            data: [],
            selected: [],
            popoverActive: false,
            idCustomer: []
        }
        this.setSelected = this.setSelected.bind(this)
    }

    componentDidMount(){
        var self = this
        fetch('http://localhost:8888/api/getCustomer')
        .then((response) => response.json())
        .then((response) => {
            self.setState({idCustomer: response.idCus})
        });
    }

    setSelected(selected){
        var self = this
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
            idCus: selected
        })
        })
        .then((response) => response.json())
        .then(function(response) {
            self.setState({
                data: response.filterProduct
            })
        })
    }

    handleChange = (value) => {
        this.setState({sortValue: value})
    }

    togglePopoverActive = () => {
        let {popoverActive} = this.state
        this.setState({popoverActive: !popoverActive})
    }

    render(){
        const{
            selectedItems,
            queryValue,
            taggedWith,
            sortValue,
            data,
            selected,
            popoverActive,
            allProduct,
            idCustomer
        }=this.state

        const items = data.map((item, index) => {
          return {
                id: index,
                id_product: item.id_product,
                name:item.name,
                price: item.price,
                image: item.image
            }
        })

        const filters = [
            {
              key: 'taggedWith',
              label: 'Tagged with',
              filter: (
                <TextField
                  label="Tagged with"
                  value={taggedWith}
                  labelHidden
                />
              ),
              shortcut: true,
            },
        ];
        let arr_idCus = [];
        let id = idCustomer.map(value => {
            arr_idCus.push(value.id_customer)
        })

        let options = arr_idCus.map(value => {
            return {
                value: value,
                label: value
            }
        });
        let op = [
            {
                value: "",
                label: "None"
            },
            ...options
        ]

        const activator = (
            <Button onClick={() => this.togglePopoverActive()} disclosure>
              Filter
            </Button>
        );
        const filterControl = (
            <Filters
              queryValue={queryValue}
              filters={filters}
            >
                <div>
                    <Popover
                        active={popoverActive}
                        activator={activator}
                        onClose={this.togglePopoverActive}
                    >
                        <OptionList
                        title="Choose Customer"
                        onChange={(selected) => this.setSelected(selected)}
                        options={
                            op
                        }
                        selected={selected}
                        />
                    </Popover>
                </div>

            </Filters>
        );

        return (
            <Page
                fullWidth
                title="Wishlist"
            >
                <Card>
                    <ResourceList
                        items={items}
                        renderItem={renderItem}
                        sortValue={sortValue}
                        sortOptions={[
                            {label: 'Count wishlist', value: 'Count_wishlist'}
                        ]}
                        onSortChange={(selected) =>  this.handleChange(selected) }
                        filterControl={filterControl}
                    />
                </Card>
            </Page>
        );

        function renderItem(item) {
            const { id_product, name, price, image, id_cus} = item;
            const media = <div><img src={image} className="img_pr" /></div>
            var CurrencyFormat = require('react-currency-format');
            return (
              <ResourceItem
                media={media}
                persistActions
              >
                <h3>
                  <TextStyle variation="strong">{name}</TextStyle>
                </h3>
                <div className="infoP">Id Product: {id_product}</div>
                <div className="infoP">Price: <CurrencyFormat value={price} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
                <div className="infoP">User: {id_cus}</div>
              </ResourceItem>
            );
        }
    }
}
