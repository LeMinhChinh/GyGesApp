import React, { Component } from 'react'
import {
    Page,
    Layout,
    Card,
    TextField,
    FormLayout,
    Button,
    Select,
    ButtonGroup
} from '@shopify/polaris'
import '../settingtheme.css'

export default class SettingTheme extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selected: "Select Theme",
            theme: [],
            ids: "",
            install: false,
            uninstall: false
        }
    }

    componentDidMount(){
        var self = this

        fetch('http://localhost:8888/api/getApiKey')
        .then((response) => response.json())
        .then((response) => {
            self.setState({
                theme: response.theme
            })
        });
    }

    handleChange = (value) =>{
        this.setState({
            selected : parseInt(value)
        })
    }

    install = () => {
        var self = this
        var ids = this.state.selected
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        self.setState({install: true})
        fetch('http://localhost:8888/api/installTheme',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": token
            },
            body: JSON.stringify({
                idTheme: ids
            })
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.success == "Theme not found"){
                alert("Theme not found")
            }

            if(response.success == "fail"){
                alert("Theme not found")
            }

            self.setState({
                install: false
            })
        });
    }

    uninstall = () => {
        var self = this
        var ids = this.state.selected
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        self.setState({uninstall: true})
        fetch('http://localhost:8888/api/uninstallTheme',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": token
            },
            body: JSON.stringify({
                idTheme: ids
            })
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.success == "Theme not found"){
                alert("Theme not found")
            }

            if(response.success == "fail"){
                alert("Theme not found")
            }

            self.setState({
                uninstall: false
            })
        });
    }

    render(){
        const {
            selected,
            theme,
            ids,
            install,
            uninstall
        } = this.state

        const themes = theme.map((item) => {
            return {
                label: item.name,
                value: item.id
            }
        })

        const options = [
            {
                value: "Select Theme",
                label: "Theme",
            },
            ...themes
        ]

        return (
            <Page
                title="Setting Theme"
            >
                <Layout>
                    <Layout.AnnotatedSection
                        title="Translation"
                        description="Shopify and your customers will use this information to contact you."
                    >
                        <Card sectioned>
                            <FormLayout>
                                <Select
                                    label="Select Theme"
                                    options={options}
                                    onChange={(selected) => this.handleChange(selected)}
                                    value={selected}
                                />
                                <div className="btnGroup">
                                    <ButtonGroup>
                                        <Button
                                            onClick={() => this.uninstall()}
                                            loading={uninstall}
                                            destructive
                                        >
                                            Uninstall
                                        </Button>
                                        <Button
                                            onClick={() => this.install()}
                                            loading={install}
                                            primary
                                        >
                                            Install
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </FormLayout>
                        </Card>
                    </Layout.AnnotatedSection>
                </Layout>
            </Page>
        )
    }
}
