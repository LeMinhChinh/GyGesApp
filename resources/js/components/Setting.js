import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {FormLayout, TextField} from '@shopify/polaris'
import {AppProvider, Page, Card, Button} from '@shopify/polaris';

export default class Setting extends Component{
    render = () => {
        return (

            // <h1>a</h1>
            <AppProvider>
                <Page>
                    <Card sectioned>
                        <Button onClick={() => alert('Button clicked!')}>Example button</Button>
                    </Card>
                    <FormLayout>
                        <TextField label="Store name" onChange={() => {}} />
                        <TextField type="email" label="Account email" onChange={() => {}} />
                    </FormLayout>
                </Page>
            </AppProvider>
        )
    }
}
