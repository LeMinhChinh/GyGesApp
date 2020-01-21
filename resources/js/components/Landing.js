import React, { Component } from 'react'
import {
    Card,
    ResourceList,
    ResourceItem,
    TextStyle,
    Filters,
    TextField,
    Button,
    Popover,
    OptionList,
    Page,
    DataTable,
    ChoiceList,
    RangeSlider,
    Stack,
    Key
} from '@shopify/polaris'
import '../wishlist.css'
import CurrencyFormat from 'react-currency-format';
import Pagination from "react-js-pagination";

const initialValue = [0, 5000];
const min = 0;
const max = 5000;
const prefix = '$';
const step = 20;

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
            // sortedRows: [],
            availability: "",
            productType: "",
            activePage: 1,
            totalItems: "",
            itemInPage: "",
            timeOutId: null,
            rangeValue: initialValue,
            intermediateTextFieldValue: initialValue,
            specs: []
        }
    }

    componentDidMount(){
        var self = this
        var page = this.state.activePage
        self.loadPage(page)
    }

    loadPage(page){
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        fetch('http://localhost:8888/api/loadPage?page='+page,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": token
            },
            body: JSON.stringify({
                rangeValue: this.state.rangeValue,
                name: this.state.availability,
                price: this.state.productType,
                tagwith: this.state.taggedWith,
                queryValue: this.state.queryValue
            })
        })
        .then((response) => response.json())
        .then((response) => {
            // let datas = response.count.data
            let total = response.count.total
            let item = response.count.per_page
            // let counted = datas.map((item) => {
            //     return [
            //         item.name,
            //         item.id_product,
            //         item.price,
            //         item.count_id,
            //         item.image,
            //     ]
            // })
            let specs = response.product.map((vals) => {
                return [
                    vals.title,
                    vals.handle,
                    vals.variants[0].price,
                    vals.count,
                    vals.images[0].src,
                ]
            })
            let dt = response.product.map((vals) => {
                return [
                    vals.title,
                    vals.handle,
                    vals.variants[0].price,
                    vals.images[0].src,
                    vals.count,
                ]
            })
            this.setState({
                idCustomer: response.idCus,
                data: dt,
                // sortedRows: counted,
                totalItems: total,
                itemInPage: item,
                specs: specs
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
            let datas = response.product.map((item) => {
                return [
                    item.title,
                    item.handle,
                    item.variants[0].price,
                    item.images[0].src
                ]
            })
            self.setState({
                data: datas
            })
        })
    }

    togglePopoverActive = () => {
        let {popoverActive} = this.state
        this.setState({popoverActive: !popoverActive})
    }


    handleSort = (index, direction) => {
        let sorted = this.sortCurrency(this.state.specs, index, direction)
        this.setState({'specs': sorted});
    }

    sortCurrency = (rows, index, direction) => {
        return [...rows].sort((rowA, rowB) => {
            // const amountA = parseFloat(rowA[index].toString().substring(0,1));
            // const amountB = parseFloat(rowB[index].toString().substring(0,1));
            const amountA = parseFloat((rowA[index]))
            const amountB = parseFloat(rowB[index])

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
            let datas = response.data.data
            let total = response.data.total
            let item = response.data.per_page
            let setData = datas.map((item) => {
                return [
                    item.name,
                    item.id_product,
                    item.price,
                    item.count_id,
                    item.image,
                ]
            })
            let specs = response.product.map((vals) => {
                return [
                    vals.title,
                    vals.handle,
                    vals.variants[0].price,
                    vals.count,
                    vals.images[0].src,
                ]
            })
            self.setState({
                sortedRows: setData,
                data: datas,
                totalItems: total,
                itemInPage: item,
                specs: specs
            })
        })
    }

    handleChange = (key, value) => {
        var self = this;
        var newState = self.state;
        newState[key] = value;
        if(this.state.timeOutId)
            clearTimeout(this.state.timeOutId);

        var timeOutId = setTimeout(() => {
            self.handleFilter(newState)
        }, 1000);

        self.setState({[key] : value, timeOutId: timeOutId})

    }

    handleRemove = (key) => {
        var self = this;
        var newState = self.state;
        var page = this.state.activePage
        newState[key] = "";
        self.setState({[key] : ""})
        if(newState == ""){
            self.loadPage(page)
        }else{
            self.handleFilter(newState)
        }
    }

    handleFiltersClearAll = () => {
        var page = this.state.activePage
        this.setState({
            availability: "",
            productType: "",
            taggedWith: ""
        });
        this.loadPage(page)
    }

    handlePageChange = (activePage) => {
        this.setState({activePage})
        this.loadPage(activePage)
    }

    handleRangeSliderChange = (value) => {
        var page = this.state.activePage
        if(this.state.timeOutId)
            clearTimeout(this.state.timeOutId);

        var timeOutId = setTimeout(() => {
            this.loadPage(page)
        }, 1000);

        this.setState({
            rangeValue: value,
            intermediateTextFieldValue: value,
            timeOutId: timeOutId
        })
    }

    handleLowerTextFieldChange = (value) => {
        var page = this.state.activePage
        if(this.state.timeOutId)
            clearTimeout(this.state.timeOutId);

        var timeOutId = setTimeout(() => {
            this.loadPage(page)
        }, 1000);

		this.setState({
			intermediateTextFieldValue: this.state.intermediateTextFieldValue.map(
				(item, index) => (index === 0 ? parseInt(value, 10) : item)
            ),
            timeOutId: timeOutId
		});
	};

	handleUpperTextFieldChange = (value) => {
        var page = this.state.activePage
        if(this.state.timeOutId)
            clearTimeout(this.state.timeOutId);

        var timeOutId = setTimeout(() => {
            this.loadPage(page)
        }, 1000);

		this.setState({
			intermediateTextFieldValue: this.state.intermediateTextFieldValue.map(
				(item, index) => (index === 1 ? parseInt(value, 10) : item)
            ),
            timeOutId: timeOutId
		});
    };

    handleLowerTextFieldBlur = () => {
		this.setState({
			rangeValue: [
                parseInt(this.state.intermediateTextFieldValue[0],10),
                this.state.rangeValue[1]
            ]
		});
	};

	handleUpperTextFieldBlur = () => {
		this.setState({
			rangeValue: [
				this.state.rangeValue[0],
				parseInt(this.state.intermediateTextFieldValue[1], 10)
            ]
		});
    };

    handleEnterKeyPress = (event) => {
		let newValue = this.state.intermediateTextFieldValue;
        let oldValue = this.state.rangeValue;
        var page = this.state.activePage
		if (event.keyCode === Key.Enter && newValue !== oldValue) {
            if(this.state.timeOutId)
            clearTimeout(this.state.timeOutId);

            var timeOutId = setTimeout(() => {
                this.loadPage(page)
            }, 1000);
			this.setState({
                rangeValue: newValue,
                timeOutId: timeOutId
			});
		}
    };

    handleSearch = (key,value) => {
        var page = this.state.activePage

        if(this.state.timeOutId)
            clearTimeout(this.state.timeOutId);

        var timeOutId = setTimeout(() => {
            this.loadPage(page)
        }, 1000);
        this.setState({[key]: value, timeOutId: timeOutId})
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
            // sortedRows,
            availability,
            productType,
            rangeValue,
            intermediateTextFieldValue,
            specs
        }=this.state

        const items = data.map((item) => {
          return {
                name: item[0],
                handle: item[1],
                price: item[2],
                image: item[3],
                count: item[4],
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
              shortcut: false,
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
                        {label: 'Glasses', value: 'Glasses'},
                    ]}
                    selected={availability || []}
                    onChange={(value) => this.handleChange('availability',value)}
                    allowMultiple
                  />
                ),
                shortcut: false,
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

        const rows = specs.map((value) => {
            return (
                [
                    <p className="name_pr"><img src={value[4]} className="img_pr"></img>{value[0]}</p>,
                    value[1],
                    <CurrencyFormat value={value[2]} displayType={'text'} thousandSeparator={true} prefix={'$'} />,
                    value[3]
                ]
            )
        })

        const lowerTextFieldValue =
            intermediateTextFieldValue[0] === rangeValue[0]
            ? rangeValue[0]
            : intermediateTextFieldValue[0];

        const upperTextFieldValue =
            intermediateTextFieldValue[1] === rangeValue[1]
            ? rangeValue[1]
            : intermediateTextFieldValue[1];

        return (
            <Page
                title="Wishlist"
            >
                <Card>
                    <Card.Section>
                        <Filters
                            queryValue={queryValue}
                            filters={filters}
                            appliedFilters={appliedFilters}
                            onQueryChange={(queryValue) => this.handleSearch('queryValue',queryValue)}
                            onQueryClear={() => this.handleRemove('queryValue')}
                            onClearAll={() => this.handleFiltersClearAll()}
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
                    </Card.Section>
                    <Card.Section>
                        <div onKeyDown={this.handleEnterKeyPress}>
                            <RangeSlider
                                output
                                label="Money spent is between"
                                value={rangeValue}
                                prefix={prefix}
                                min={min}
                                max={max}
                                step={step}
                                onChange={(rangeValue) => this.handleRangeSliderChange(rangeValue)}
                            />
                            <Stack distribution="equalSpacing" spacing="extraLoose">
                            <TextField
                                label="Min money spent"
                                type="number"
                                value={`${lowerTextFieldValue}`}
                                prefix={prefix}
                                min={min}
                                max={max}
                                step={step}
                                onChange={(value) => this.handleLowerTextFieldChange(value)}
                                onBlur={this.handleLowerTextFieldBlur}
                            />
                            <TextField
                                label="Max money spent"
                                type="number"
                                value={`${upperTextFieldValue}`}
                                prefix={prefix}
                                min={min}
                                max={max}
                                step={step}
                                onChange={(value) => this.handleUpperTextFieldChange(value)}
                                onBlur={this.handleUpperTextFieldBlur}
                            />
                            </Stack>
                        </div>
                    </Card.Section>
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
                    <Pagination
                        prevPageText='prev'
                        nextPageText='next'
                        firstPageText='first'
                        lastPageText='last'
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.itemInPage}
                        totalItemsCount={this.state.totalItems}
                        // pageRangeDisplayed={5}
                        onChange={(activePage) => this.handlePageChange(activePage)}
                    />
                </Card>
                <Card>
                    <ResourceList
                        items={items}
                        renderItem={renderItem}
                        sortValue={sortValue}
                        // sortOptions={[
                        //     {label: 'Sort Product', value: ''},
                        //     {label: 'Sort Count ASC', value: 'ASC'},
                        //     {label: 'Sort Count DESC', value: 'DESC'}
                        // ]}
                        // onSortChange={(sortValue) =>  this.handleChange('sortValue',sortValue) }
                        // filterControl={filterControl}
                    />
                </Card>
            </Page>
        );

        function renderItem(item) {
            const {name, handle, price, image,count} = item
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
                <div className="infoP">Handle: {handle}</div>
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
