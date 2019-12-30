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
    Page,
    DataTable,
    ChoiceList
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
            sortValue: "",
            data: [],
            selected: [],
            popoverActive: false,
            idCustomer: [],
            sortedRows: [],
            availability: "",
            productType: "",
            keys: {
                availability : '',
                productType : ''
            }
        }
        this.setSelected = this.setSelected.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleFiltersClearAll = this.handleFiltersClearAll.bind(this)
    }

    componentDidMount(){
        var self = this
        fetch('http://localhost:8888/api/getCustomer')
        .then((response) => response.json())
        .then((response) => {
            let counted = response.count.map((item) => {
                return [
                    item.name,
                    item.id_product,
                    item.price,
                    item.count_id,
                    item.image,
                ]
            })
            self.setState({
                idCustomer: response.idCus,
                data: response.count,
                sortedRows: counted
            })
        });
    }

    setSelected(selected){
        var self = this
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
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

    togglePopoverActive = () => {
        let {popoverActive} = this.state
        this.setState({popoverActive: !popoverActive})
    }

    handleSort = (index, direction) => {
        let sorted = this.sortCurrency(this.state.sortedRows, index, direction)
        this.setState({'sortedRows': sorted});
    }

    sortCurrency = (rows, index, direction) => {
        return [...rows].sort((rowA, rowB) => {
            const amountA = parseFloat((rowA[index].toString().substring(0,1)));
            const amountB = parseFloat((rowB[index].toString().substring(0,1)));

            return direction === 'descending' ? amountB - amountA : amountA - amountB;
            // return direction === 'descending' ? 1 : -1; =>sort string
        });
    }

    handleFilter = (newState) => {
        var self = this
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        fetch('http://localhost:8888/api/filterajax',{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": token
        },
        body: JSON.stringify({
            data: {
                'name': newState.availability,
                'price' : newState.productType,
                'tagwith' : newState.taggedWith
            }
        })
        })
        .then((response) => response.json())
        .then(function(response){
            let setData = response.data.map((item) => {
                return [
                    item.name,
                    item.id_product,
                    item.price,
                    item.count_id,
                    item.image,
                ]
            })
            self.setState({
                sortedRows: setData,
                data: response.data,
            })
        })
    }

    handleChange = (key, value) => {
        var self = this;
        var newState = self.state;
        newState[key] = value;
        self.setState({[key] : value})
        self.handleFilter(newState)
    }

    handleRemove = (key) => {
        var self = this;
        var newState = self.state;
        newState[key] = "";
        self.setState({[key] : ""})
        self.handleFilter(newState)
    }

    handleFiltersClearAll(){
        // var self = this
        // var newState = self.state
        // newState[
        //     availability: "",
        //     productType: "",
        //     taggedWith: ""
        // ]
        // self.setState({
        //     availability: "",
        //     productType: "",
        //     taggedWith: ""
        // })
        // self.handleFilter(newState)
        this.setState({
            availability: "",
            productType: "",
            taggedWith: ""
        });
    }

    render(){
        const{
            queryValue,
            taggedWith,
            sortValue,
            data,
            selected,
            popoverActive,
            idCustomer,
            sortedRows,
            availability,
            productType
        }=this.state

        const items = data.map((item, index) => {
          return {
                id: index,
                id_product: item.id_product,
                name:item.name,
                price: item.price,
                image: item.image,
                id_cus: item.customer_id,
                count: item.count_id
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
                    onChange={(value) => this.handleChange('taggedWith',value)}
                />
              ),
              shortcut: true,
            },
            {
                key: 'availability',
                label: 'Name',
                filter: (
                  <ChoiceList
                    title="Name Product"
                    titleHidden
                    choices={[
                        {label: 'T-Shirt Women Summer', value: 'T-Shirt Women Summer'},
                        {label: 'Hand Bag Women', value: 'Hand Bag Women'},
                        {label: 'Shoes Women', value: 'Shoes Women'},
                        {label: 'Jean Women Summer', value: 'Jean Women Summer'},
                    ]}
                    selected={availability || []}
                    onChange={(value) => this.handleChange('availability',value)}
                    allowMultiple
                  />
                ),
                shortcut: true,
              },
              {
                key: 'productType',
                label: 'Price range',
                filter: (
                  <ChoiceList
                    title="Price range"
                    titleHidden
                    choices={[
                        {label: '<=2000', value: '0,2000'},
                        {label: '2000-4000', value: '2000,4000'},
                        {label: '4000<=', value: '4000'},
                    ]}
                    selected={productType || []}
                    onChange={(value) => this.handleChange('productType',value)}
                    // allowMultiple
                  />
                ),
              }
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
                label: "All"
            },
            ...options
        ]

        const appliedFilters = [];
        if (!isEmpty(availability)) {
            const key = 'availability';
            appliedFilters.push({
            key,
            label: disambiguateLabel(key, availability),
            onRemove: () => this.handleRemove('availability'),
            });
        }
        if (!isEmpty(productType)) {
            const key = 'productType';
            appliedFilters.push({
            key,
            label: disambiguateLabel(key, productType),
            onRemove: () => this.handleRemove('productType'),
            });
        }
        if (!isEmpty(taggedWith)) {
            const key = 'taggedWith';
            appliedFilters.push({
            key,
            label: disambiguateLabel(key, taggedWith),
            onRemove: () => this.handleRemove('taggedWith'),
            });
        }

        const activator = (
            <Button onClick={() => this.togglePopoverActive()} disclosure>
              Filter
            </Button>
        );
        const filterControl = (
            <Filters
              queryValue={queryValue}
              filters={filters}
              appliedFilters={appliedFilters}
              onQueryChange={(queryValue) => this.handleChange('queryValue',queryValue)}
              onQueryClear={() => this.handleRemove('queryValue')}
              onClearAll={this.handleFiltersClearAll}
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

        const rows = sortedRows.map((value) => {
            return (
                [
                    <p className="name_pr"><img src={value[4]} className="img_pr"></img>{value[0]}</p>,
                    value[1],
                    <CurrencyFormat value={value[2]} displayType={'text'} thousandSeparator={true} prefix={'$'} />,
                    value[3]
                ]
            )
        })

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
                            {label: 'Sort Product', value: ''},
                            {label: 'Sort Count ASC', value: 'ASC'},
                            {label: 'Sort Count DESC', value: 'DESC'}
                        ]}
                        onSortChange={(sortValue) =>  this.handleChange('sortValue',sortValue) }
                        filterControl={filterControl}
                    />
                </Card>
                <Card>
                    <DataTable
                        columnContentTypes={[
                            'text',
                            'text',
                            'numeric',
                            'numeric'
                        ]}
                        headings={[
                            'Product',
                            'Handle',
                            'Price',
                            'Count',
                        ]}
                        rows={rows}
                        sortable={[true,true,true,true]}
                        defaultSortDirection= "none"
                        initialSortColumnIndex={3}
                        onSort={this.handleSort}
                    />
                </Card>
            </Page>
        );

        function renderItem(item) {
            const { id_product, name, price, image, id_cus, count} = item;
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
                {count && (
                    <div className="infoP">Count: {count}</div>
                )}
              </ResourceItem>
            );
        }

        function disambiguateLabel(key, value) {
            switch (key) {
              case 'taggedWith':
                return `Tagged with ${value}`;
              case 'availability':
                return value.map((val) => `Name: ${val}`).join(', ');
              case 'productType':
                return value.map((val) => `Price range: ${val}`).join(', ');
              default:
                return value;
            }
        }

        function isEmpty(value) {
            if (Array.isArray(value)) {
              return value.length === 0;
            } else {
              return value === '' || value == null;
            }
        }
    }
}
