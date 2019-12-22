import React, { Component } from 'react'
import ReactDOM from 'react-dom'
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
    Heading,
    RadioButton,
    Select,
    TextStyle,
    Frame,
    ContextualSaveBar
} from '@shopify/polaris'
import { SketchPicker } from 'react-color'
import '../setting.css'

export default class Setting extends Component{
    constructor(props) {
        super(props);
        this.state = {
            active : true,
            active_launch : true,
            value: "",
            activeColor1: false,
            activeColor2: false,
            activeColor3: false,
            valueColor: "#b99191",
            valueColor2: "#b99191",
            valueColor3: "#b99191",
            value_launch: "",
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
            status: false
        }
    }

    handleToogle = (key) => {
        let stt = this.state[key]
        this.setState({[key]: !stt})
    }

    handleChange = (value) => {
        this.setState({value})
    }

    handleChangeLaunch = (value_launch) => {
        this.setState({value_launch})
    }

    handleSelectChange = (value) => {
        this.setState({selected: value})
    }

    handleShowColor = (key) => {
        let action = this.state[key];
        this.setState({[key]: !action})

    }

    handleChangeColor = (key,valueColor) => {
        this.setState({[key]: valueColor})
    }

    handleChangeDisplay = (value_display) => {
        this.setState({value_display})
    }

    handleChangeStt = () => {
        let {value_stt} = this.state
        this.setState({value_stt: !value_stt})
    }

    handleChangeInfor = (key, value) => {
        this.setState({[key]: value});
    }

    handleApperSaveBar = () => {
        let {status} = this.state
        this.setState({status: !status});
    }

    handleSubmit = () => {
        console.log('success');
        fetch('http://localhost:8888/api/saveSettings',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": token
            }
        }
        .then((response) => response.json())
        .then((data) => {

        })
        )
    }

    render = () => {
        const {
            active,
            value,
            activeColor1,
            activeColor2,
            valueColor,
            valueColor2,
            active_launch,
            value_launch,
            selected,
            value_module,
            activeColor3,
            valueColor3,
            value_display,
            value_stt,
            status,
            empty,
            title,
            price,
            action,
            addtocart,
            addedtocart,
            readmore,
            selectoption,
            availability,
            instock,
            outstock,
        } = this.state

        const rd1 = <div className="bgcRadioButton"><i className="far fa-heart"></i><span>ADD TO WISHLIST</span></div>
        const rd2 = <div className="bgcRadioButton"><span>ADD TO WISHLIST</span></div>
        const rd3 = <div className="RadioButton"><i className="far fa-heart"></i><span>ADD TO WISHLIST</span></div>
        const rd4 = <div className="RadioButton"><span>ADD TO WISHLIST</span></div>
        const rd5 = <div className="RadioButton"><i className="far fa-heart"></i><span style={{ color:'#fff' }}>ADD TO WISHLIST</span></div>
        const divColor1 = <div className="color" onClick={() => this.handleShowColor('activeColor1')}><div
            style={{
                width: '25px',
                height: '25px',
                backgroundColor: valueColor,
                margin: '4px auto'
            }}
        ></div></div>
        const divColor2 = <div className="color" onClick={() => this.handleShowColor('activeColor2')}><div
            style={{
                width: '25px',
                height: '25px',
                backgroundColor: valueColor2,
                margin: '4px auto'
            }}
        ></div></div>
        const divColor3 = <div className="color" onClick={() => this.handleShowColor('activeColor3')}><div
            style={{
                width: '25px',
                height: '25px',
                backgroundColor: valueColor3,
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
                <Page>
                    <div className="posiColor">
                    <Layout>
                        <Layout.AnnotatedSection>
                            <div className="setting_wl">
                                <Card sectioned>
                                    <Stack vertical>
                                    <Button
                                        onClick={() => this.handleToogle('active')}
                                        ariaExpanded={active}
                                        ariaControls="basic-collapsible"
                                        fullWidth
                                    >
                                        Toggle
                                    </Button>
                                    <Collapsible open={active} id="basic-collapsible">
                                        <Heading>Wishlist Button Type</Heading>
                                        <FormLayout.Group>
                                            <RadioButton
                                                label={rd1}
                                                checked={value === 'rd1' }
                                                onChange={() => this.handleChange('rd1')}
                                            />
                                            <RadioButton
                                            label={rd2}
                                            checked={value === 'rd2'}
                                            onChange={() => this.handleChange('rd2')}

                                            />
                                        </FormLayout.Group>
                                        <FormLayout.Group>
                                            <RadioButton
                                                label={rd3}
                                                checked={value === 'rd3'}
                                                onChange={() => this.handleChange('rd3')}
                                            />
                                            <RadioButton
                                            label={rd4}
                                            checked={value === 'rd4'}
                                            onChange={() => this.handleChange('rd4')}
                                            />
                                        </FormLayout.Group>
                                        <FormLayout.Group>
                                            <RadioButton
                                                label={rd5}
                                                checked={value === 'rd5'}
                                                onChange={() => this.handleChange('rd5')}
                                            />
                                        </FormLayout.Group>
                                        <div>
                                            <div>
                                                <div>
                                                <TextField
                                                    label="Pick a color of the button/icon before user has added to their Wishlist"
                                                    connectedRight={divColor1}
                                                    value={valueColor}
                                                    // onChange={handleChangeText}
                                                />
                                                </div>
                                                {activeColor1 ? <div className="sortColor">
                                                    <SketchPicker
                                                        color={valueColor}
                                                        onChange={(color) => this.handleChangeColor('valueColor',color.hex)}
                                                    />
                                                </div> : null}
                                            </div>
                                            <div>
                                                <TextField
                                                    label="Pick a color of the button/icon after user has added to their Wishlist"
                                                    connectedRight={divColor2}
                                                        color={valueColor2}
                                                        value={ valueColor2}
                                                    // onChange={handleChangeText}
                                                />
                                                {activeColor2 ? <div className="sortColor">
                                                    <SketchPicker
                                                        color={valueColor2}
                                                        onChange={(color) => this.handleChangeColor('valueColor2',color.hex)}
                                                    />
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
                                        <input type="checkbox"/>
                                        <span className="slider round"></span>
                                        </label>
                                        <p className="title">Image</p>
                                    </div>
                                    <div className="divSwitch">
                                        <label className="switch">
                                        <input type="checkbox"/>
                                        <span className="slider round"></span>
                                        </label>
                                        <p className="title">Title</p>
                                    </div>
                                    <div className="divSwitch">
                                        <label className="switch">
                                        <input type="checkbox"/>
                                        <span className="slider round"></span>
                                        </label>
                                        <p className="title">Price</p>
                                    </div>
                                    <div className="divSwitch">
                                        <label className="switch">
                                        <input type="checkbox"/>
                                        <span className="slider round"></span>
                                        </label>
                                        <p className="title">Availability</p>
                                    </div>
                                    <div className="divSwitch">
                                        <label className="switch">
                                        <input type="checkbox"/>
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
                                        onClick={() => this.handleToogle('active_launch')}
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
                                                checked={value_launch === 'fl_button' }
                                                onChange={() => this.handleChangeLaunch('fl_button')}
                                            />
                                            <RadioButton
                                                label= "As a menu item"
                                                checked={value_launch === 'menu_item' }
                                                onChange={() => this.handleChangeLaunch('menu_item')}
                                            />
                                            <RadioButton
                                                label= "Add to your header menu"
                                                checked={value_launch === 'header_menu' }
                                                onChange={() => this.handleChangeLaunch('header_menu')}
                                            />
                                        </FormLayout>
                                        <Select
                                            label="Choose a placement point for the button on your site"
                                            options={options}
                                            onChange={this.handleSelectChange}
                                            value={selected}
                                        />
                                        <TextField
                                            label="What do you want to call your Wishlist module?"
                                            value={value_module}
                                            onChange={(value) => this.handleChangeInfor('value_module', value)}
                                        />
                                        <div>
                                            <div>
                                            <TextField
                                                label="Pick a color of the launch button"
                                                connectedRight={divColor3}
                                                value={valueColor3}
                                            />
                                            </div>
                                            {activeColor3 ? <div className="sortColor">
                                                <SketchPicker
                                                    color={valueColor3}
                                                    onChange={(color) => this.handleChangeColor('valueColor3',color.hex)}
                                                />
                                            </div> : null}
                                        </div>
                                        <div><p className="title_launch">Display the Wishlist modules as:</p></div>
                                        <FormLayout>
                                            <RadioButton
                                                label= "Pop up windown"
                                                checked={value_display === 'pop_up' }
                                                onChange={() => this.handleChangeDisplay('pop_up')}
                                            />
                                            <RadioButton
                                                label= "Separate page"
                                                checked={value_display === 'separate' }
                                                onChange={() => this.handleChangeDisplay('separate')}
                                            />
                                        </FormLayout>
                                        <div className="settingDisplay">
                                            <p className="contentDisplay">Display of number of items in the user's Wishlist on the anchor is <TextStyle variation="strong">{value_stt ? 'enable' : 'disable'}</TextStyle>.</p>
                                            <div className="contentDisplay"><Button primary={value_stt} onClick={this.handleChangeStt} >{value_stt ? 'Enable' : 'Disable'}</Button></div>
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
                                    <TextField label="Empty" value={empty} onChange={(value) => this.handleChangeInfor('empty', value)} />
                                    <TextField label="Title" value={title} onChange={(value) => this.handleChangeInfor('title', value)} />

                                    <TextField label="Price" value={price} onChange={(value) => this.handleChangeInfor('price', value)} />
                                    <TextField label="Action" value={action} onChange={(value) => this.handleChangeInfor('action', value)} />
                                    <FormLayout.Group>
                                        <TextField label="Add to cart" value={addtocart} onChange={(value) => this.handleChangeInfor('addtocart', value)} />
                                        <TextField label="Added to cart" value={addedtocart} onChange={(value) => this.handleChangeInfor('addedtocart', value)} />
                                    </FormLayout.Group>
                                    <FormLayout.Group>
                                        <TextField label="Read more" value={readmore} onChange={(value) => this.handleChangeInfor('readmore', value)} />
                                        <TextField label="Select options" value={selectoption} onChange={(value) => this.handleChangeInfor('selectoption', value)} />
                                    </FormLayout.Group>
                                    <TextField label="Availability" value={availability} onChange={(value) => this.handleChangeInfor('availability', value)} />
                                    <FormLayout.Group>
                                        <TextField label="In stock" value={instock} onChange={(value) => this.handleChangeInfor('instock', value)} />
                                        <TextField label="Out of stock" value={outstock} onChange={(value) => this.handleChangeInfor('outstock', value)} />
                                    </FormLayout.Group>

                                </FormLayout>
                            </Card>
                        </Layout.AnnotatedSection>
                    </Layout>
                    </div>
                    <PageActions
                        primaryAction={{
                            content: 'Save',
                            onAction: this.handleApperSaveBar
                        }}
                    />
                    {status ? <div>
                        <AppProvider
                            theme={{
                            logo: {
                                width: 124,
                                contextualSaveBarSource:
                                'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999',
                            },
                            }}
                            i18n={{
                            Polaris: {
                                Frame: {
                                skipToContent: 'Skip to content',
                                },
                                ContextualSaveBar: {
                                save: 'Save',
                                discard: 'Discard',
                                },
                            },
                            }}
                        >
                            <Frame>
                            <ContextualSaveBar
                                message="Unsaved changes"
                                saveAction={{
                                onAction: () => this.handleSubmit(),
                                loading: false,
                                disabled: false,
                                }}
                                discardAction={{
                                onAction: () => console.log('add clear form logic'),
                                }}
                            />
                            </Frame>
                        </AppProvider>
                    </div> : null}
                </Page>
            </AppProvider>
        )
    }
}
