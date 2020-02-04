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
import Axios from 'axios';

export default class SettingTheme extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selected: "",
            theme: [],
            ids: "",
            install: false,
            uninstall: false
        }
    }

    componentDidMount(){
        var self = this

        Axios.get(`http://localhost:8888/api/getApiKey`)
        .then(res => {
            self.setState({
                theme: res.data.theme,
                selected: parseInt(res.data.themeid)
            })
        })
        .catch(error => console.log(error))
    }

    handleChange = (value) =>{
        this.setState({
            selected : parseInt(value)
        })
    }

    install = () => {
        var self = this
        self.setState({install: true})
        Axios.post(`http://localhost:8888/api/installTheme`,{
            idTheme: this.state.selected
        })
        .then(res => {
            if(res.data.status == "Error"){
                alert("Theme not found")
            }

            if(res.data.status == "success"){
                alert("Install theme success")
            }

            self.setState({
                install: false
            })
        })
        .catch(error => console.log(error))
    }

    uninstall = () => {
        var self = this
        self.setState({uninstall:true})
        Axios.post(`http://localhost:8888/api/uninstallTheme`,{
            idTheme: this.state.selected
        })
        .then(res => {
            if(res.data.status == "Error"){
                alert("Theme not found")
            }

            if(res.data.status == "success"){
                alert("Uninstall theme success")
            }

            self.setState({
                uninstall: false
            })
        })
        .catch(error => console.log(error))
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
                value: "0",
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
