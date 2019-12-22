import React from "react";
import {withRouter} from "react-router-dom";
import {
    Banner,
    Button,
    Card,
    DropZone,
    FormLayout,
    Layout,
    Link,
    Page,
    SkeletonBodyText,
    SkeletonDisplayText,
    SkeletonPage, Stack,
    TextContainer, TextField,
    TextStyle,
    Select,
    Checkbox,
    RadioButton,
    Heading, PageActions
} from "@shopify/polaris";
import {ToastsContainer, ToastsStore} from 'react-toasts';
import axios from "axios";
import {CopyToClipboard} from 'react-copy-to-clipboard';

class General extends React.Component{
    state = {
        copied: false,
        textCopy: '<div class="gbStoreInventory">\n' +
            '\t<strong>Inventory:</strong><br />\n' +
            '\t<span class="gbStore-inventoryLocationLoading">Loading..</span>\n' +
            '</div>',
        submit: false,
        getThemeAction: false,
        loadSettings: false,
        urlProductTemplate: '',
        general: {
            googleMap: {
                status: false,
                apiKey: '',
                style: 'Standard',
                zoom: '12',
                pinIcon: Laravel.url + '/images/location-512.png',
                distance_length_unit: 'km'
            },
            inventory: {
                hideOutOfStockLocations: false,
                onlyShowOutOfStockOrInStock: false,
                showUnlinkedLocations: false,
                useInventoryThreshold: false,
                outOfStock: {number: 0, text: 'Out of Stock'},
                lowStock: {number: 5, text: 'Low Stock'},
                highStock: {number: null, text: 'High Stock'},
                noInventoryFound: {show: false, text: ''},
            },

        },
        errors: {},
        rejectedFiles: {},
        hasError: false,
    };

    componentDidMount() {
        this.getThemeAction();
        this.getSettings();
    }

    getSettings = () => {
        fetch(Laravel.url + '/api/getSettings?setting=general')
            .then(res=>res.json())
            .then((data) => {
                if (data.success) {
                    if (data.settings) this.setState({general: data.settings});
                    this.setState({
                        loadSettings: false
                    })
                } else {
                    if (data.authorize) {
                        this.props.history('/authorize')
                    }
                }
            })
    };

    getThemeAction = () => {
      fetch(Laravel.url + '/api/getThemeAction')
          .then(res => res.json())
          .then((data) => {
              let urlProductTemplate = '';
              urlProductTemplate = 'https://' + Laravel.shopOrigin + '/admin/themes/'+data.themeAction+'?key=sections/product-template.liquid';
              if (data.success) {
                  this.setState({
                      urlProductTemplate,
                      getThemeAction: true,
                  })
              } else {
                  if (data.authorize) {
                      this.props.history('/authorize')
                  }
              }
          })
    };

    handleChange = (data) => {
        this.setState(prevState => {
            let newState = { ...prevState };
            Object.keys(data).map(id => {
                let value = data[id];
                let keys = id.replace(new RegExp("]", "g"), "").split("[");
                if (keys.length == 1) {
                    newState[keys[0]] = value;
                } else if (keys.length == 2) {
                    newState[keys[0]][keys[1]] = value;
                } else if (keys.length == 3) {
                    newState[keys[0]][keys[1]][keys[2]] = value;
                } else if (keys.length == 4) {
                    newState[keys[0]][keys[1]][keys[2]][keys[3]] = value;
                } else if (keys.length == 5) {
                    newState[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] = value;
                }
                if (id == 'general[inventory][outOfStock][number]') {
                    if (Number(newState.general.inventory.lowStock.number) <= Number(value)) {
                        newState.general.inventory.lowStock.number = Number(value) + 1
                    }
                }
                if (id == 'general[inventory][onlyShowOutOfStockOrInStock]') {
                    if (value && newState.general.inventory.useInventoryThreshold) {
                        newState.general.inventory.useInventoryThreshold = false;
                    }
                }
                if (id == 'general[inventory][useInventoryThreshold]') {
                    if (value && newState.general.inventory.useInventoryThreshold) {
                        newState.general.inventory.onlyShowOutOfStockOrInStock = !value;
                    }
                }
            });
            return newState;
        });
    };

    resetError = (field) => {
        let {errors} = this.state;
        errors[field] = '';
        this.setState({errors: errors});
    };

    validation = () => {
        let {general, errors} = this.state;
        let check = false;
        if (general.googleMap.status) {
            if (!general.googleMap.apiKey || general.googleMap.apiKey == '') {
                errors.apiKey = 'This api key field is required';
                check = true;
            }
        }
        if (general.inventory.noInventoryFound.show && (general.inventory.noInventoryFound.text == null || general.inventory.noInventoryFound.text == '')) {
            errors.inventory = 'This text field is required';
            check = true;
        }
        this.setState({errors});
        return check
    };

    handleSubmit = async () => {
        if (this.validation()) {
            return false;
        }
        let errorSubmit = false;
        this.setState({submit: true});
        let {general} = this.state;
        if (typeof general.googleMap.pinIcon == 'object') {
            let formData = new FormData();
            formData.append("_token", window.Laravel.csrfToken);
            formData.append('pinIcon', general.googleMap.pinIcon);
            const config = {
                headers: {"content-type": "multipart/form-data"}
            };
            await axios
                .post(Laravel.url + '/api/savePinIcon', formData, config)
                .then(response => {
                    let data = response.data;
                    if (data.success) {
                        if (data.url){
                            general.googleMap.pinIcon = data.url
                        }
                    } else {
                        if (data.authorize) {
                            this.props.history('/authorize')
                        } else {
                            ToastsStore.error(data.message ? data.message : 'Whoops, looks like something went wrong.')
                            errorSubmit = true;
                        }
                    }
                })
                .catch(error => {
                    ToastsStore.error('Whoops, looks like something went wrong.');
                    errorSubmit = true;
                });
        }

        if (errorSubmit) {
            this.setState({submit: false});
            return  false
        }
        let data= {
            key: 'general',
            data : general,
            _token: window.Laravel.csrfToken
        };
        let options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
        };
        fetch(Laravel.url + '/api/saveSettings', options)
            .then(res=>res.json())
            .then((data) => {
                if (data.success) {
                    ToastsStore.success('The settings have been successfully updated on ' + data.nameTheme + ' theme. Please check on ' + data.nameTheme + ' theme.', 5000)
                } else {
                    if (data.authorize) {
                        this.props.history('/authorize')
                    } else {
                        ToastsStore.error(data.message ? data.message : 'Whoops, looks like something went wrong.')
                    }
                }
                this.getSettings();
                this.setState({submit: false});
            })
    };

    render() {
        let {loadSettings, textCopy, copied, general, errors, rejectedFiles, hasError, getThemeAction, urlProductTemplate, submit} = this.state;
        if (loadSettings && !getThemeAction) {
            return (
                <SkeletonPage>
                    <Layout>
                        <Layout.Section>
                            <Card sectioned>
                                <TextContainer>
                                    <SkeletonDisplayText size="small"/>
                                    <SkeletonBodyText lines={9}/>
                                </TextContainer>
                            </Card>
                        </Layout.Section>
                    </Layout>
                </SkeletonPage>
            );
        }
        let statusOptions = [
            {label: 'Enable', value: '1'},
            {label: 'Disable', value: '0'},
        ];

        let lengthUnit = [
            {label: 'Kilometer', value: 'km'},
            {label: 'Mile', value: 'm'},
        ];
        return (
            <Page
                breadcrumbs={[{content: 'Settings', onAction: () => this.props.history.push(window.Laravel.relativePath + '/settings')}]}
                primaryAction={{content: 'Save', onAction: () => this.handleSubmit(), loading: submit}}
                title='General'
            >
                <Layout>
                    <Layout.AnnotatedSection title='Google map'>
                        <Card sectioned>
                            <FormLayout>
                                <div className='actionToggle'>
                                    <div className='title'><p>Google map is <TextStyle variation="strong">{general.googleMap.status ? 'Enable' : 'Disable'}</TextStyle></p></div>
                                    <div className='action'>
                                        <Button
                                            primary={general.googleMap.status}
                                            onClick={() => this.handleChange({'general[googleMap][status]': !general.googleMap.status})}
                                        >
                                            {general.googleMap.status ? 'Disable' : 'Enable'}
                                        </Button>
                                    </div>
                                </div>
                            </FormLayout>
                        </Card>
                        {
                            general.googleMap.status && (
                                <Card sectioned>
                                    <FormLayout>
                                        <TextField
                                            label="Google Maps API Key"
                                            onChange={(value) => {this.handleChange({"general[googleMap][apiKey]": value}); this.resetError('apiKey')}}
                                            value={general.googleMap.apiKey}
                                            placeholder='AIzaSyCpEKmdDK_SS3Ezl1S2jODysLK3LOO1z5k'
                                            error={errors.apiKey}
                                        />
                                        <TextStyle variation="subdued">Click <Link
                                            url="https://help.shopify.com/en/manual/using-themes/change-the-layout/theme-settings/map-section-api-key"
                                            external>here</Link> to get your own API KEY.</TextStyle>
                                        <div className='dropZoneCustom'>
                                            <Stack vertical>
                                                {hasError && (
                                                    <Banner
                                                        status="critical"
                                                    >
                                                        <TextContainer>
                                                            <p>
                                                                {`"${rejectedFiles.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
                                                            </p>
                                                        </TextContainer>
                                                    </Banner>)}
                                                <div className="Polaris-Labelled__LabelWrapper">
                                                    <div className="Polaris-Label">
                                                        <label
                                                            className="Polaris-Label__Text">
                                                            Pin icon
                                                        </label>
                                                    </div>
                                                    <div className="Polaris-Labelled__Action">
                                                        <button type="button"
                                                                onClick={() => this.setState(
                                                                    prevState => (
                                                                        {...prevState,
                                                                            general: {...prevState.general,
                                                                                googleMap: {...prevState.general.googleMap,
                                                                                    pinIcon: Laravel.url + '/images/location-512.png'
                                                                                }
                                                                            }}
                                                                    )
                                                                )}
                                                                className="Polaris-Button Polaris-Button--plain"><span
                                                            className="Polaris-Button__Content"><span
                                                            className="Polaris-Button__Text">Reset</span></span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div style={{width: '250px', height: '200px'}}>
                                                        <DropZone
                                                            accept="image/*"
                                                            type="image"
                                                            onDrop={(files, acceptedFiles, rejectedFiles) => {
                                                                let {general} = this.state;
                                                                general.googleMap.pinIcon = acceptedFiles[0];
                                                                this.setState({
                                                                    general,
                                                                    rejectedFiles: rejectedFiles[0] ? rejectedFiles[0] : {},
                                                                    hasError: rejectedFiles.length > 0,
                                                                });
                                                            }}
                                                        >
                                                            {general.googleMap.pinIcon && (
                                                                <div
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "100%",
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        padding: "5px",
                                                                        cursor: "pointer"
                                                                    }}
                                                                >
                                                                    <img
                                                                        style={{
                                                                            width: "30px",
                                                                            maxHeight: "100px",
                                                                            objectFit: 'cover'
                                                                        }}
                                                                        alt={
                                                                            typeof general.googleMap.pinIcon == "object"
                                                                                ? general.googleMap.pinIcon.name
                                                                                : general.googleMap.pinIcon
                                                                        }
                                                                        src={
                                                                            typeof general.googleMap.pinIcon == "object"
                                                                                ? window.URL.createObjectURL(
                                                                                general.googleMap.pinIcon
                                                                                )
                                                                                : general.googleMap.pinIcon
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                            {!general.googleMap.pinIcon && <DropZone.FileUpload/>}
                                                        </DropZone>
                                                    </div>
                                                </div>
                                            </Stack>
                                        </div>
                                        <TextField
                                            label='Google Maps Zoom level'
                                            type='number'
                                            value={general.googleMap.zoom}
                                            min='0'
                                            onChange={value => this.handleChange({"general[googleMap][zoom]": value})}
                                        />
                                        <Select
                                            label='Distance Length Unit'
                                            options={lengthUnit}
                                            value={general.googleMap.distance_length_unit}
                                            onChange={selected => this.handleChange({"general[googleMap][distance_length_unit]": selected})}
                                        />
                                        <div className="Polaris-Label">
                                            <label
                                                className="Polaris-Label__Text">
                                                Google Map Style
                                            </label>
                                        </div>
                                        <div className="map-style">
                                            <div className="row">
                                                <div
                                                    className={`item ${general.googleMap.style == 'Standard' && "active"}`}
                                                    onClick={() => this.handleChange({"general[googleMap][style]": 'Standard'})}
                                                >
                                                    <div className="thumb">
                                                        <img
                                                            src={window.Laravel.url + "/map/standard.png"}
                                                        />
                                                    </div>
                                                    <div className="title">Standard</div>
                                                    <div className="selected">
                                                        <i className="fas fa-check"/>
                                                    </div>
                                                    <p className='titleStyle'>Standard</p>
                                                </div>
                                                <div
                                                    className={`item ${general.googleMap.style == 'Silver' && "active"}`}
                                                    onClick={() => this.handleChange({"general[googleMap][style]": 'Silver'})}
                                                >
                                                    <div className="thumb">
                                                        <img
                                                            src={window.Laravel.url + "/map/silver.png"}
                                                        />
                                                    </div>
                                                    <div className="title">Silver</div>
                                                    <div className="selected">
                                                        <i className="fas fa-check"/>
                                                    </div>
                                                    <p className='titleStyle'>Silver</p>
                                                </div>
                                                <div
                                                    className={`item ${general.googleMap.style == 'Retro' && "active"}`}
                                                    onClick={() => this.handleChange({"general[googleMap][style]": 'Retro'})}
                                                >
                                                    <div className="thumb">
                                                        <img
                                                            src={window.Laravel.url + "/map/retro.png"}
                                                        />
                                                    </div>
                                                    <div className="title">Retro</div>
                                                    <div className="selected">
                                                        <i className="fas fa-check"/>
                                                    </div>
                                                    <p className='titleStyle'>Retro</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div
                                                    className={`item ${general.googleMap.style == 'Aubergine' && "active"}`}
                                                    onClick={() => this.handleChange({"general[googleMap][style]": 'Aubergine'})}
                                                >
                                                    <div className="thumb">
                                                        <img
                                                            src={window.Laravel.url + "/map/aubergine.png"}
                                                        />
                                                    </div>
                                                    <div className="title">Aubergine</div>
                                                    <div className="selected">
                                                        <i className="fas fa-check"/>
                                                    </div>
                                                    <p className='titleStyle'>Aubergine</p>
                                                </div>
                                                <div
                                                    className={`item ${general.googleMap.style == 'Night' && "active"}`}
                                                    onClick={() => this.handleChange({"general[googleMap][style]": 'Night'})}
                                                >
                                                    <div className="thumb">
                                                        <img
                                                            src={window.Laravel.url + "/map/night.png"}
                                                        />
                                                    </div>
                                                    <div className="title">Night</div>
                                                    <div className="selected">
                                                        <i className="fas fa-check"/>
                                                    </div>
                                                    <p className='titleStyle'>Night</p>
                                                </div>
                                                <div
                                                    className={`item ${general.googleMap.style == 'Dark' && "active"}`}
                                                    onClick={() => this.handleChange({"general[googleMap][style]": 'Dark'})}
                                                >
                                                    <div className="thumb">
                                                        <img
                                                            src={window.Laravel.url + "/map/dark.png"}
                                                        />
                                                    </div>
                                                    <div className="title">Dark</div>
                                                    <div className="selected">
                                                        <i className="fas fa-check"/>
                                                    </div>
                                                    <p className='titleStyle'>Dark</p>
                                                </div>
                                            </div>
                                        </div>
                                    </FormLayout>
                                </Card>
                            )
                        }
                    </Layout.AnnotatedSection>
                    <Layout.AnnotatedSection title='Inventory Display Settings' description='Select how your inventory will be displayed to your customers'>
                        <Card sectioned>
                            <TextContainer>
                                <Heading>Install</Heading>
                                <p>
                                    Add this code to your active theme <Link url={urlProductTemplate} external={true}>product-template.liquid</Link> file somewhere below the product price for the location information to show up:
                                </p>
                                <div className='guide-Inventory'>
                                    <TextField
                                        multiline
                                        value={textCopy}
                                    />
                                </div>
                                <CopyToClipboard text={textCopy}
                                                 onCopy={() => {let self = this; self.setState({copied: true});setTimeout(function () {
                                                     self.setState({copied: false})
                                                 }, 3000)}}>
                                    <Button>Copy to clipboard</Button>
                                </CopyToClipboard>
                                {copied ? <span style={{color: 'red', marginLeft: '5px'}}>Copied.</span> : null}
                            </TextContainer>
                        </Card>
                        <Card sectioned>
                            <Checkbox
                                label="Hide out of stock locations"
                                checked={general.inventory.hideOutOfStockLocations}
                                onChange={() => this.handleChange({"general[inventory][hideOutOfStockLocations]": !general.inventory.hideOutOfStockLocations})}
                            />
                            <Checkbox
                                label={<p>Only show <b>out of stock</b> or <b>in stock</b> per location (no exact quantities)</p>}
                                checked={general.inventory.onlyShowOutOfStockOrInStock}
                                onChange={() => this.handleChange({"general[inventory][onlyShowOutOfStockOrInStock]": !general.inventory.onlyShowOutOfStockOrInStock})}
                            />
                            <Checkbox
                                label="Show unlinked locations with 0 inventory"
                                checked={general.inventory.showUnlinkedLocations}
                                onChange={() => this.handleChange({"general[inventory][showUnlinkedLocations]": !general.inventory.showUnlinkedLocations})}
                            />
                        </Card>
                        <Card sectioned>
                            <Checkbox
                                label="Use inventory Threshold"
                                checked={general.inventory.useInventoryThreshold}
                                onChange={() => this.handleChange({"general[inventory][useInventoryThreshold]": !general.inventory.useInventoryThreshold})}
                            />
                            <table>
                                <tbody>
                                <tr>
                                    <td>Inventory quantity</td>
                                    <td></td>
                                    <td>Text to show</td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextField
                                            value={general.inventory.outOfStock.number}
                                            onChange={(value) => this.handleChange({'general[inventory][outOfStock][number]' : value})}
                                            type='number'
                                            min='0'
                                        />
                                    </td>
                                    <td>:</td>
                                    <td>
                                        <TextField
                                            value={general.inventory.outOfStock.text}
                                            onChange={(value) => this.handleChange({'general[inventory][outOfStock][text]' : value})}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextField
                                            value={general.inventory.lowStock.number}
                                            onChange={(value) => this.handleChange({'general[inventory][lowStock][number]' : value})}
                                            type='number'
                                            min={Number(general.inventory.outOfStock.number) + 1}
                                        />
                                    </td>
                                    <td>:</td>
                                    <td>
                                        <TextField
                                            value={general.inventory.lowStock.text}
                                            onChange={(value) => this.handleChange({'general[inventory][lowStock][text]' : value})}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Everything over the low stock amount
                                    </td>
                                    <td>:</td>
                                    <td>
                                        <TextField
                                            value={general.inventory.highStock.text}
                                            onChange={(value) => this.handleChange({'general[inventory][highStock][text]' : value})}
                                        />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Card>
                        <Card sectioned>
                            <Stack vertical>
                                <RadioButton
                                    label="Hide Inventory block when no inventory information is found"
                                    checked={general.inventory.noInventoryFound.show === false}
                                    name="noInventoryFound"
                                    onChange={() => this.handleChange({'general[inventory][noInventoryFound][show]' : false})}
                                />
                                <RadioButton
                                    label="Show text when no inventory information is found"
                                    name="noInventoryFound"
                                    checked={general.inventory.noInventoryFound.show === true}
                                    onChange={() => this.handleChange({'general[inventory][noInventoryFound][show]' : true})}
                                />
                                <TextField
                                    label='Text to show'
                                    value={general.inventory.noInventoryFound.text}
                                    onChange={(value) => {this.handleChange({'general[inventory][noInventoryFound][text]' : value}); this.resetError('inventory')}}
                                    disabled={!general.inventory.noInventoryFound.show}
                                    error={errors.inventory}
                                />
                            </Stack>
                        </Card>
                    </Layout.AnnotatedSection>
                </Layout>
                <ToastsContainer store={ToastsStore}/>
                <PageActions
                    primaryAction={{content: 'Save', onAction: () => this.handleSubmit(), loading: submit}}
                />
            </Page>
        )
    }
}

export {General};
export default withRouter(General);
