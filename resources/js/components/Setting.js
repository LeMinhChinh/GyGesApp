import React, { Component } from 'react'
import {
    Button,
    AppProvider,
    Card,
    FormLayout,
    Layout,
    Page,
    TextField,
    Stack,
    Collapsible,
    PageActions,
    RadioButton,
    Select,
    TextStyle,
    ChoiceList,
} from '@shopify/polaris'
import { SketchPicker } from 'react-color'
import '../setting.css'

export default class Setting extends Component{
    constructor(props) {
        super(props);
        this.state = {
            active : true,
            active_launch : true,
            status: false,
            activeColor1: false,
            activeColor2: false,
            activeColor3: false,
            data: {
                valueColor: "#b99191",
                valueColor2: "#b99191",
                valueColor3: "#b99191",
                value_launch: "",
                value: "",
                selected: "bt_right",
                value_module: "",
                value_display: "",
                value_stt: true,
                empty: "",
                title: "",
                price: "",
                action: "",
                addtocart: "",
                addedtocart: "",
                readmore: "",
                selectoption: "",
                availability: "",
                instock: "",
                outstock: "",
                status_title: false,
                status_image: false,
                status_price: false,
                status_avai: false,
                status_action: false,
                select: "icon_txtbg"
            },
            shop: [],
            dtSetting: []
        }
    }

    componentDidMount = () => {
        var self = this

        fetch('http://localhost:8888/api/getProducts')
        .then((response) => response.json())
        .then((response) => {
            self.setState({
                shop: response.shop
            })
        });

        fetch('http://localhost:8888/api/getSettings')
        .then((response) => response.json())
        .then((response) => {
            var settings = JSON.parse(response.dtSetting.setting);
            self.setState({
                data:settings
            })
        });
    }

    handleChange = (value, key) => {
        console.log(value)
        let {data} = this.state
        data[key] = value
        this.setState({data})
    }

    handleToogle = (value, key) => {
        this.setState({[key]: value})
    }

    handleSubmit = () => {
        let {data} = this.state
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        let {shop} = this.state

        fetch('http://localhost:8888/api/saveSettings',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": token
            },
            body: JSON.stringify({
                idShop: shop.id,
                data: data
            })
        })
        .then((response) => response.json())
        .then(function(response){
            if(response.success){
                alert('Success')
            }
        })
    }

    render = () => {
        const {
            data,
            active,
            active_launch,
            status,
            activeColor1,
            activeColor2,
            activeColor3
        } = this.state

        const rd1 = <div className="bgcRadioButton"><i className="far fa-heart"></i><span>ADD TO CART</span></div>
        const rd2 = <div className="bgcRadioButton"><span>ADD TO CART</span></div>
        const rd3 = <div className="RadioButton"><i className="far fa-heart"></i><span>ADD TO CART</span></div>
        const rd4 = <div className="RadioButton"><span>ADD TO CART</span></div>
        const rd5 = <div className="RadioButton"><i className="far fa-heart"></i><span style={{ color:'#fff' }}>ADD TO CART</span></div>
        const divColor1 = <div className="color" onClick={() => this.handleToogle(!activeColor1, 'activeColor1')}><div
            style={{
                width: '25px',
                height: '25px',
                backgroundColor: data.valueColor,
                margin: '4px auto'
            }}
        ></div></div>
        const divColor2 = <div className="color" onClick={() => this.handleToogle(!activeColor2, 'activeColor2')}><div
            style={{
                width: '25px',
                height: '25px',
                backgroundColor: data.valueColor2,
                margin: '4px auto'
            }}
        ></div></div>
        const divColor3 = <div className="color" onClick={() => this.handleToogle(!activeColor3, 'activeColor3')}><div
            style={{
                width: '25px',
                height: '25px',
                backgroundColor: data.valueColor3,
                margin: '4px auto'
            }}
        ></div></div>
        const options = [
            {label: 'Bottom Right', value: 'bt_right'},
            {label: 'Bottom Left', value: 'bt_left'},
            {label: 'Bottom Center', value: 'bt_center'},
        ];

        return (
            <AppProvider>
                <Page
                    title="Setting"
                >
                    <div className="posiColor">
                    <Layout>
                        <Layout.AnnotatedSection
                            title="Translation"
                            description="Shopify and your customers will use this information to contact you."
                        >
                            <div className="setting_wl">
                                <Card sectioned>
                                    <Stack vertical>
                                    <Button
                                        onClick={() => this.handleToogle(!active, 'active')}
                                        ariaExpanded={active}
                                        ariaControls="basic-collapsible"
                                        fullWidth
                                    >
                                        Toggle
                                    </Button>
                                    <Collapsible open={active} id="basic-collapsible">
                                        <p>Wishlist Button Type</p>
                                        <FormLayout.Group>
                                            <RadioButton
                                                label={rd1}
                                                checked={data.value === '<div class="bgcRadioButton" style="background-color:'+data.valueColor+'"><a><i class="fa fa-heart"></i><span>ADD TO CART</span></a></div>' }
                                                onChange={() => this.handleChange('<div class="bgcRadioButton" style="background-color:'+data.valueColor+'"><a><i class="fa fa-heart"></i><span>ADD TO CART</span></a></div>','value')}
                                            />
                                            <RadioButton
                                            label={rd2}
                                            checked={data.value === '<div class="bgcRadioButton" style="background-color:'+data.valueColor+'"><a><span>ADD TO CART</span></a></div>'}
                                            onChange={() => this.handleChange('<div class="bgcRadioButton" style="background-color:'+data.valueColor+'"><a><span>ADD TO CART</span></a></div>','value')}

                                            />
                                        </FormLayout.Group>
                                        <FormLayout.Group>
                                            <RadioButton
                                                label={rd3}
                                                checked={data.value === '<div class="RadioButton" style="background-color:'+data.valueColor+'"><a><i className="fa fa-heart"></i><span>ADD TO CART</span></a></div>'}
                                                onChange={() => this.handleChange('<div class="RadioButton" style="background-color:'+data.valueColor+'"><a><i className="fa fa-heart"></i><span>ADD TO CART</span></a></div>','value')}
                                            />
                                            <RadioButton
                                            label={rd4}
                                            checked={data.value === '<div class="RadioButton" style="background-color:'+data.valueColor+'"><a><span>ADD TO CART</span></a></div>'}
                                            onChange={() => this.handleChange('<div class="RadioButton" style="background-color:'+data.valueColor+'"><a><span>ADD TO CART</span></a></div>','value')}
                                            />
                                        </FormLayout.Group>
                                        <FormLayout.Group>
                                            <RadioButton
                                                label={rd5}
                                                checked={data.value === '<div class="RadioButton" style="background-color:'+data.valueColor+'"><a><i class="fa fa-heart"></i><span style="color:#fff">ADD TO CART</span></a></div>'}
                                                onChange={() => this.handleChange('<div class="RadioButton" style="background-color:'+data.valueColor+'"><a><i class="fa fa-heart"></i><span style="color:#fff">ADD TO CART</span></a></div>','value')}
                                            />
                                        </FormLayout.Group>
                                        <FormLayout.Group>
                                            <ChoiceList
                                                title="Wishlist buton type"
                                                choices={[
                                                    {
                                                        label: <div className="bgcRadioButton" style={{ backgroundColor: data.valueColor, color: data.valueColor2}}><a><i className="fa fa-heart"></i><span>ADD TO CART</span></a></div>,
                                                        value: 'icon_txtbg'
                                                    },
                                                    {
                                                        label: <div className="bgcRadioButton" style={{ backgroundColor: data.valueColor, color: data.valueColor2 }}><a><span>ADD TO CART</span></a></div>,
                                                        value: 'txt_bg' },
                                                    {
                                                        label: <div className="RadioButton" style={{ color: data.valueColor2 }}><a><i className="fa fa-heart"></i><span>ADD TO CART</span></a></div>,
                                                        value: 'icon_txt'
                                                    },
                                                    {
                                                        label: <div className="RadioButton"  style={{ color: data.valueColor2 }}><a><span>ADD TO CART</span></a></div>,
                                                        value: 'txt' },
                                                    {
                                                        label: <div className="RadioButton"><a><i className="fa fa-heart" style={{ color: data.valueColor2 }}></i></a></div>,
                                                        value: 'icon'
                                                    },
                                                ]}
                                                selected={data.select}
                                                onChange={(value) => this.handleChange(value,'select')}
                                            />
                                        </FormLayout.Group>
                                        <div>
                                            <div>
                                                <div>
                                                <TextField
                                                    label="Pick a color of the button/icon before user has added to their Wishlist"
                                                    connectedRight={divColor1}
                                                    value={data.valueColor}
                                                />
                                                </div>
                                                {activeColor1 ? <div>
                                                    <div className="upColor" onClick={() => {this.handleToogle(!activeColor1, 'activeColor1')}}></div>
                                                    <div className="sortColor">
                                                    <SketchPicker
                                                        color={data.valueColor}
                                                        onChange={(color) => this.handleChange(color.hex,'valueColor')}
                                                    />
                                                    </div>
                                                </div> : null}
                                            </div>
                                            <div>
                                                <TextField
                                                    label="Pick a color of the button/icon after user has added to their Wishlist"
                                                    connectedRight={divColor2}
                                                        value={data.valueColor2}
                                                />
                                                {activeColor2 ? <div>
                                                    <div className="upColor" onClick={() => {this.handleToogle(!activeColor2, 'activeColor2')}}></div>
                                                    <div className="sortColor">
                                                        <SketchPicker
                                                            color={data.valueColor2}
                                                            onChange={(color) => this.handleChange(color.hex, 'valueColor2')}
                                                        />
                                                    </div>
                                                </div> : null}
                                            </div>
                                        </div>
                                    </Collapsible>
                                    </Stack>
                                </Card>
                            </div>
                        </Layout.AnnotatedSection>
                    </Layout>
                    </div>
                    <div style={{ marginBottom: "45px" }}>
                        <Layout>
                            <Layout.AnnotatedSection
                                title="Translation"
                                description="Shopify and your customers will use this information to contact you."
                            >
                                <Card>
                                    <div className="divSwitch">
                                        <label className="switch">
                                        <input type="checkbox" checked={data.status_image ? true : false} onChange={() => this.handleChange(!data.status_image, 'status_image')}/>
                                        <span className="slider round"></span>
                                        </label>
                                        <p className="title">Image</p>
                                    </div>
                                    <div className="divSwitch">
                                        <label className="switch">
                                        <input type="checkbox" checked={data.status_title ? true : false} onChange={() => this.handleChange(!data.status_title,'status_title')}/>
                                        <span className="slider round"></span>
                                        </label>
                                        <p className="title">Title</p>
                                    </div>
                                    <div className="divSwitch">
                                        <label className="switch">
                                        <input type="checkbox" checked={data.status_price ? true : false} onChange={() => this.handleChange(!data.status_price,'status_price')}/>
                                        <span className="slider round"></span>
                                        </label>
                                        <p className="title">Price</p>
                                    </div>
                                    <div className="divSwitch">
                                        <label className="switch">
                                        <input type="checkbox" checked={data.status_avai ? true : false} onChange={() => this.handleChange(!data.status_avai, 'status_avai')}/>
                                        <span className="slider round"></span>
                                        </label>
                                        <p className="title">Availability</p>
                                    </div>
                                    <div className="divSwitch">
                                        <label className="switch">
                                        <input type="checkbox" checked={data.status_action ? true : false} onChange={() => this.handleChange(!data.status_action,'status_action')}/>
                                        <span className="slider round"></span>
                                        </label>
                                        <p className="title">Action</p>
                                    </div>
                                </Card>
                            </Layout.AnnotatedSection>
                        </Layout>
                    </div>
                    <div className="posiColor">
                    <Layout>
                        <Layout.AnnotatedSection>
                            <div className="setting_wl">
                                <Card sectioned>
                                    <Stack vertical>
                                    <Button
                                        onClick={() => this.handleToogle(!active_launch, 'active_launch')}
                                        ariaExpanded={active_launch}
                                        ariaControls="basic-collapsible"
                                        fullWidth
                                    >
                                        Lunch Point Type
                                    </Button>
                                    <Collapsible open={active_launch} id="basic-collapsible">
                                        <div><p className="title_launch">How should the launch point be exposed on your site?</p></div>
                                        <FormLayout>
                                            <RadioButton
                                                label= "As a floating button"
                                                checked={data.value_launch === 'fl_button' }
                                                onChange={() => this.handleChange('fl_button','value_launch')}
                                            />
                                            <RadioButton
                                                label= "As a menu item"
                                                checked={data.value_launch === 'menu_item' }
                                                onChange={() => this.handleChange('menu_item','value_launch')}
                                            />
                                            <RadioButton
                                                label= "Add to your header menu"
                                                checked={data.value_launch === 'header_menu' }
                                                onChange={() => this.handleChange('header_menu','value_launch')}
                                            />
                                        </FormLayout>
                                        <Select
                                            label="Choose a placement point for the button on your site"
                                            options={options}
                                            onChange={(selected) => this.handleChange(selected ,'selected')}
                                            value={data.selected}
                                        />
                                        <TextField
                                            label="What do you want to call your Wishlist module?"
                                            value={data.value_module}
                                            onChange={(value) => this.handleChange(value, 'value_module')}
                                        />
                                        <div>
                                            <div>
                                            <TextField
                                                label="Pick a color of the launch button"
                                                connectedRight={divColor3}
                                                value={data.valueColor3}
                                            />
                                            </div>
                                            {activeColor3 ? <div>
                                                <div className="upColor" onClick={() => {this.handleToogle(!activeColor3, 'activeColor3')}}></div>
                                                <div className="sortColor">
                                                <SketchPicker
                                                    color={data.valueColor3}
                                                    onChange={(color) => this.handleChange(color.hex, 'valueColor3')}
                                                />
                                                </div>
                                            </div> : null}
                                        </div>
                                        <div><p className="title_launch">Display the Wishlist modules as:</p></div>
                                        <FormLayout>
                                            <RadioButton
                                                label= "Pop up windown"
                                                checked={data.value_display === 'pop_up' }
                                                onChange={() => this.handleChange('pop_up','value_display')}
                                            />
                                            <RadioButton
                                                label= "Separate page"
                                                checked={data.value_display === 'separate' }
                                                onChange={() => this.handleChange('separate','value_display')}
                                            />
                                        </FormLayout>
                                        <div className="settingDisplay">
                                            <p className="contentDisplay">Display of number of items in the user's Wishlist on the anchor is <TextStyle variation="strong">{data.value_stt ? 'enable' : 'disable'}</TextStyle>.</p>
                                            <div className="contentDisplay"><Button primary={data.value_stt} onClick={() => this.handleChange(!data.value_stt, 'value_stt')} >{data.value_stt ? 'Enable' : 'Disable'}</Button></div>
                                        </div>
                                    </Collapsible>
                                    </Stack>
                                </Card>
                            </div>
                        </Layout.AnnotatedSection>
                    </Layout>
                    </div>
                    <div>
                    <Layout>
                        <Layout.AnnotatedSection
                            title="Translation"
                            description="Shopify and your customers will use this information to contact you."
                        >
                            <Card sectioned>
                                <FormLayout>
                                    <TextField label="Empty" value={data.empty} onChange={(value) => this.handleChange(value, 'empty')} />
                                    <TextField label="Title" value={data.title} onChange={(value) => this.handleChange(value, 'title')} />

                                    <TextField label="Price" value={data.price} onChange={(value) => this.handleChange(value, 'price')} />
                                    <TextField label="Action" value={data.action} onChange={(value) => this.handleChange(value,'action')} />
                                    <FormLayout.Group>
                                        <TextField label="Add to cart" value={data.addtocart} onChange={(value) => this.handleChange(value, 'addtocart')} />
                                        <TextField label="Added to cart" value={data.addedtocart} onChange={(value) => this.handleChange(value, 'addedtocart')} />
                                    </FormLayout.Group>
                                    <FormLayout.Group>
                                        <TextField label="Read more" value={data.readmore} onChange={(value) => this.handleChange(value, 'readmore')} />
                                        <TextField label="Select options" value={data.selectoption} onChange={(value) => this.handleChange(value, 'selectoption')} />
                                    </FormLayout.Group>
                                    <TextField label="Availability" value={data.availability} onChange={(value) => this.handleChange(value, 'availability')} />
                                    <FormLayout.Group>
                                        <TextField label="In stock" value={data.instock} onChange={(value) => this.handleChange(value, 'instock')} />
                                        <TextField label="Out of stock" value={data.outstock} onChange={(value) => this.handleChange(value, 'outstock')} />
                                    </FormLayout.Group>
                                </FormLayout>
                            </Card>
                        </Layout.AnnotatedSection>
                    </Layout>
                    </div>
                    <PageActions
                        primaryAction={{
                            content: 'Save',
                            onAction: () => this.handleSubmit()
                        }}
                    />
                </Page>
            </AppProvider>
        )
    }
}
