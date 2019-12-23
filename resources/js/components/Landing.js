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
    Layout
} from '@shopify/polaris'

export default class Landing extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedItems: [],
            queryValue: "",
            taggedWith: "",
            data: []
        }
    }

    componentDidMount(){
        var self = this
        fetch('http://localhost:8888/api/getProducts')
        .then((response) => response.json())
        .then((response) => {
            self.setState({data: response.idCustomer})
        });
    }
    render(){
        const{
            selectedItems,
            queryValue,
            taggedWith,
            data
        }=this.state

        console.log(data);


        const items = [
            {
                id: 341,
                url: 'customers/341',
                name: 'LMC',
                location: 'Decatur, USA',
                latestOrderUrl: 'orders/1456',
            }

        ];

        // const promotedBulkActions = [
        //     {
        //       content: 'Edit customers',
        //       onAction: () => console.log('Todo: implement bulk edit'),
        //     },
        // ];

        // const bulkActions = [
        //     {
        //       content: 'Add tags',
        //       onAction: () => console.log('Todo: implement bulk add tags'),
        //     },
        //     {
        //       content: 'Remove tags',
        //       onAction: () => console.log('Todo: implement bulk remove tags'),
        //     },
        //     {
        //       content: 'Delete customers',
        //       onAction: () => console.log('Todo: implement bulk delete'),
        //     },
        // ];

        const filters = [
            {
              key: 'taggedWith',
              label: 'Tagged with',
              filter: (
                <TextField
                  label="Tagged with"
                  value={taggedWith}
                //   onChange={handleTaggedWithChange}
                  labelHidden
                />
              ),
              shortcut: true,
            },
        ];

        const filterControl = (
            <Filters
              queryValue={queryValue}
              filters={filters}
            >
              <div style={{paddingLeft: '8px'}}>
                <Button onClick={() => console.log('New filter saved')}>Save</Button>
              </div>
            </Filters>
          );
        return (
            <Card>
                <ResourceList
                    items={items}
                    renderItem={renderItem}
                    selectedItems={selectedItems}
                        // promotedBulkActions={promotedBulkActions}
                        // bulkActions={bulkActions}
                    sortOptions={[
                        {label: 'Customer', value: 'DATE_MODIFIED_DESC'},
                        {label: 'Count wishlist', value: 'DATE_MODIFIED_ASC'},
                    ]}
                    onSortChange={(selected) => {
                        setSortValue(selected);
                        console.log(`Sort option changed to ${selected}.`);
                    }}
                    filterControl={filterControl}
                />
            </Card>
        );

        function renderItem(item) {
            const {id, url, name, location, latestOrderUrl} = item;
            const media = <Avatar customer size="medium" name={name} />;
            const shortcutActions = latestOrderUrl
              ? [{content: 'View latest order', url: latestOrderUrl}]
              : null;
            return (
              <ResourceItem
                id={id}
                url={url}
                media={media}
                accessibilityLabel={`View details for ${name}`}
                shortcutActions={shortcutActions}
                persistActions
              >
                <h3>
                  <TextStyle variation="strong">{name}</TextStyle>
                </h3>
                <div>{location}</div>
              </ResourceItem>
            );
        }

        // function disambiguateLabel(key, value) {
        //     switch (key) {
        //         case 'taggedWith':
        //         return `Tagged with ${value}`;
        //         default:
        //         return value;
        //     }
        // }
    }
}
