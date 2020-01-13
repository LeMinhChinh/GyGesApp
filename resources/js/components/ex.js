import React, { Component } from 'react';
import { ChoiceList, TextField, Layout, Card, FormLayout, PageActions, Form, Select,Page } from '@shopify/polaris';
import { SketchPicker } from 'react-color';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Switch } from 'antd';

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: {
                // goToCart: false,
                limit_wishlist_products_status: false,
                limit_wishlist_products: 6,
                button_wishlist: 'icon',
                add_wishlist_button_color: '#FF4500',
                added_wishlist_button_color: '#FF4500'
            },
            field: {
                isDisplayImage: true,
                isDisplayTitle: true,
                isDisplayPrice: true,
                // isDisplayAvailability: true,
                isDisplayAction: true
            },
            translation: {
                add_to_wishlist: 'Add to wishlist',
                added_to_wishlist: 'Added to wishlist',
                image: 'Image',
                title: 'Title',
                price: 'Price',
                action: 'Action',
                add_to_cart: 'Add to cart',
                added_to_cart: 'Added to cart',
                // read_more: '',
                // select_options: '',
                // availability: '',
                // instock: '',
                // out_of_stock: ''
            },
            change: false,
            isDisplayPickColor: {
                addToWishlist: false,
                addedToWishlist: false
            },
            theme: '',
            list_themes: {}
        }
    }

    componentWillMount() {
        let self = this;
        jQuery.getJSON('/wishlist_app/public/api/shop',function(data){
            if(data.settings !== ""){
                var state = JSON.parse(data.settings);
                self.setState({
                    settings: state.settings,
                    field: state.field,
                    translation: state.translation,
                    list_themes: data.themes,
                    theme: data.themes[0].id
                })
            }else{
                self.setState({
                    list_themes: data.themes,
                    theme: data.themes[0].id
                })
            }
        })
    }

    // handleGoToCart = () => {
    //     var { settings } = this.state;
    //     settings.goToCart = !settings.goToCart;
    //     this.setState({ settings, change: true });
    // }

    handleLimitWishlist = (value) => {
        var { settings } = this.state;
        settings.limit_wishlist_products_status = value[0];
        this.setState({
            settings: settings,
            change: true
        })
    }
    handleChangeLimit = (value) => {
        var {settings} = this.state;
        settings.limit_wishlist_products = value[0];
        this.setState({
            settings: settings,
            change: true
        })
    }

    onChangeField = (value, name) => {
        let { field } = this.state;
        field[name] = value;
        this.setState({
            field,
            change: true
        });
    }

    onChangeTranslation = (value, field) => {
        let { translation } = this.state;
        translation[field] = value
        this.setState({ translation, change: true });
    }

    handleChangeButtonWishProduct = (value) => {
        var { settings } = this.state;
        settings.button_wishlist = value[0];
        this.setState({ settings, change: true });
    }

    onSubmit = (event) => {
        event.preventDefault();
        let self = this;
        var { settings, field, translation,theme } = self.state;
        const data = {
            settings: settings,
            field: field,
            translation: translation,
            theme: theme
        };
        axios.post(
            '/wishlist_app/public/api/settings/save',
            data)
            .then(function (response) {
                if (response.status >= 200 && response.status < 300) {
                    self.setState({ change: false });
                    return response;
                } else {
                    alert('Something happened wrong');
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    handleChangeColorButtonAddWishList = (color) => {
        var { settings } = this.state;
        settings.add_wishlist_button_color = color.hex;
        this.setState({
            settings: settings,
            change: true
        })
    }

    handleChangeColorButtonAddedWishList = (color) => {
        var { settings } = this.state;
        settings.added_wishlist_button_color = color.hex;
        this.setState({
            settings: settings,
            change: true
        })
    }

    showPickColor = (field) => {
        var { isDisplayPickColor } = this.state;
        isDisplayPickColor[field] = !isDisplayPickColor[field]
        this.setState({
            isDisplayPickColor: isDisplayPickColor
        })
    }

    handleChooseTheme = (value)=>{
        this.setState({
            theme: parseInt(value),
            change: true
        })
    }

    render() {
        var { settings, field, translation, change, isDisplayPickColor, list_themes,theme } = this.state;
        var themes_option = [];
        for (var i = 0; i < list_themes.length; i++) {
            themes_option.push(
                {
                    value: list_themes[i].id,
                    label: list_themes[i].name
                }
            )
        }

        return (
            <Page title="Setting">
                <Form onSubmit={this.onSubmit} method="post">
                    <div className="mt-20">
                        <Layout>
                            <Layout.AnnotatedSection title="Theme">
                                <Card sectioned>
                                    <Select
                                        label="Date range"
                                        options={themes_option}
                                        onChange={(value) => this.handleChooseTheme(value)}
                                        value={theme}
                                    />
                                </Card>
                            </Layout.AnnotatedSection>
                        </Layout>
                    </div>
                    <div className="mt-20">
                        <Layout>
                            <Layout.AnnotatedSection
                                title="Settings"
                                description="Shopify and your customers will use this information to contact you."
                            >
                                <Card sectioned>
                                    <FormLayout>
                                        {/* <FormLayout.Group condensed>
                                            <Checkbox
                                                label="Go to cart directly"
                                                checked={settings.goToCart}
                                                onChange={this.handleGoToCart}
                                            />
                                        </FormLayout.Group> */}
                                        <FormLayout.Group condensed>
                                            <ChoiceList
                                                title="Limit wishlist products"
                                                choices={[
                                                    { label: 'Disable', value: false },
                                                    { label: 'Enable', value: true }
                                                ]}
                                                selected={[settings.limit_wishlist_products_status]}
                                                onChange={(value) => this.handleLimitWishlist(value)}
                                            />
                                        </FormLayout.Group>
                                        <FormLayout.Group condensed>
                                            <TextField type="number" value={settings.limit_wishlist_products} onChange={(value) => this.handleChangeLimit(value)} disabled={!settings.limit_wishlist_products_status} />
                                        </FormLayout.Group>
                                        <FormLayout.Group condensed>
                                            <ChoiceList
                                                title="Company name"
                                                choices={[
                                                    { label: <i style={{color: settings.add_wishlist_button_color}} className="far fa-heart"></i>, value: 'icon' },
                                                    { label: <button className="add_to_wishlist" style={{ backgroundColor: settings.add_wishlist_button_color }}>{translation.add_to_wishlist}</button>, value: 'label' },
                                                    { label: <button className="added_to_wishlist" style={{ backgroundColor: settings.add_wishlist_button_color }}><i className="far fa-heart mr-5"></i>{translation.add_to_wishlist}</button>, value: 'icon_label' },
                                                ]}
                                                selected={[settings.button_wishlist]}
                                                onChange={(value) => this.handleChangeButtonWishProduct(value)}
                                            />
                                        </FormLayout.Group>
                                        <FormLayout.Group>
                                            <div className="element_button_color">
                                                <label>Button Add to wishlist</label>
                                                <div className="pickColor" style={{ backgroundColor: settings.add_wishlist_button_color }} onClick={() => this.showPickColor('addToWishlist')}>
                                                </div>

                                                <div className="module_pick_color">
                                                    {isDisplayPickColor.addToWishlist === true ? <SketchPicker color={settings.add_wishlist_button_color} onChangeComplete={this.handleChangeColorButtonAddWishList} /> : ''}
                                                </div>
                                            </div>
                                            <div className="element_button_color">
                                                <label>Button Added to wishlist</label>
                                                <div className="pickColor" style={{ backgroundColor: settings.added_wishlist_button_color }} onClick={() => this.showPickColor('addedToWishlist')}>
                                                </div>

                                                <div className="module_pick_color">
                                                    {isDisplayPickColor.addedToWishlist === true ? <SketchPicker color={settings.added_wishlist_button_color} onChangeComplete={this.handleChangeColorButtonAddedWishList} /> : ''}
                                                </div>
                                            </div>
                                        </FormLayout.Group>
                                    </FormLayout>
                                </Card>
                            </Layout.AnnotatedSection>
                        </Layout>

                    </div>
                    <div className="mt-20">
                        <Layout>
                            <Layout.AnnotatedSection
                                title="Field"
                                description="Shopify and your customers will use this information to contact you."
                            >
                                <Card sectioned>
                                    <div className="field-table">
                                        <Switch checked={field.isDisplayImage} onChange={(value) => this.onChangeField(value, 'isDisplayImage')} />
                                        <label>Image</label>
                                    </div>
                                    <div className="field-table">
                                        <Switch checked={field.isDisplayTitle} onChange={(value) => this.onChangeField(value, 'isDisplayTitle')} />
                                        <label>Title</label>
                                    </div>
                                    <div className="field-table">
                                        <Switch checked={field.isDisplayPrice} onChange={(value) => this.onChangeField(value, 'isDisplayPrice')} />
                                        <label>Price</label>
                                    </div>
                                    {/* <div className="field-table">
                                        <Switch checked={field.isDisplayAvailability} onChange={(value) => this.onChangeField(value, 'isDisplayAvailability')} />
                                        <label>Availability</label>
                                    </div> */}
                                    <div className="field-table">
                                        <Switch checked={field.isDisplayAction} onChange={(value) => this.onChangeField(value, 'isDisplayAction')} />
                                        <label>Action</label>
                                    </div>
                                </Card>
                            </Layout.AnnotatedSection>
                        </Layout>
                    </div>
                    <div className="mt-20">
                        <Layout>
                            <Layout.AnnotatedSection
                                title="Translation"
                                description="Shopify and your customers will use this information to contact you."
                            >
                                <Card sectioned>
                                    <FormLayout>
                                        <FormLayout.Group condensed>
                                            <TextField value={translation.add_to_wishlist} label="Add to wishlist" onChange={(value) => this.onChangeTranslation(value, 'add_to_wishlist')} />
                                            <TextField value={translation.added_to_wishlist} label="Added to wishlist" onChange={(value) => this.onChangeTranslation(value, 'added_to_wishlist')} />
                                        </FormLayout.Group>
                                        <TextField value={translation.image} label="Image" onChange={(value) => this.onChangeTranslation(value, 'image')} />
                                        <TextField value={translation.title} label="Title" onChange={(value) => this.onChangeTranslation(value, 'title')} />
                                        <TextField value={translation.price} label="Price" onChange={(value) => this.onChangeTranslation(value, 'price')} />
                                        <TextField value={translation.action} label="Action" onChange={(value) => this.onChangeTranslation(value, 'action')} />
                                        <FormLayout.Group condensed>
                                            <TextField value={translation.add_to_cart} label="Add to cart" onChange={(value) => this.onChangeTranslation(value, 'add_to_cart')} />
                                            <TextField value={translation.added_to_cart} label="Added to cart" onChange={(value) => this.onChangeTranslation(value, 'added_to_cart')} />
                                        </FormLayout.Group>
                                        {/* <FormLayout.Group condensed>
                                            <TextField value={translation.read_more} label="Read more" onChange={(value) => this.onChangeTranslation(value, 'read_more')} />
                                            <TextField value={translation.select_options} label="Select options" onChange={(value) => this.onChangeTranslation(value, 'select_options')} />
                                        </FormLayout.Group> */}
                                        {/* <TextField value={translation.availability} label="Availability" onChange={(value) => this.onChangeTranslation(value, 'availability')} /> /}
                                        {/* <FormLayout.Group condensed>
                                            <TextField value={translation.instock} label="In stock" onChange={(value) => this.onChangeTranslation(value, 'instock')} />
                                            <TextField value={translation.out_of_stock} label="Out of stock" onChange={(value) => this.onChangeTranslation(value, 'out_of_stock')} />
                                        </FormLayout.Group> */}
                                    </FormLayout>
                                </Card>
                            </Layout.AnnotatedSection>
                        </Layout>
                    </div>
                    <PageActions primaryAction={{ content: 'Save', disabled: !change, submit: true }} />
                </Form>
            </Page>
        );
    }
}

export default Setting;
