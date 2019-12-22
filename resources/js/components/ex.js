import React from 'react';

import {
    Checkbox,
    Button,
    ActionList,
    AppProvider,
    Card,
    ContextualSaveBar,
    DisplayText,
    Form,
    FormLayout,
    Frame,
    Label,
    Layout,
    Icon,
    Link as SLink,
    Loading,
    Modal,
    Navigation,
    Page,
    TextContainer,
    TextField,
    Toast,
    TopBar,
    SkeletonPage,
    SkeletonBodyText,
    SkeletonDisplayText
} from '@shopify/polaris';
import {
    EmbedMinor,
    ArrowLeftMinor,
    HomeMajorMonotone,
    CalendarMajorMonotone,
    ProductsMajorMonotone,
    NoteMajorMonotone,
    ProfileMajorMonotone,
    BillingStatementDollarMajorMonotone,
    SettingsMajorMonotone,
    ChatMajorMonotone,
    CircleDisabledMajorMonotone,
    LocationMajorMonotone,
    EmailMajorMonotone,
    FormsMajorMonotone
} from "@shopify/polaris-icons";
import {Switch, Route, Link, Redirect} from 'react-router-dom';
import history from '../history';


import Product from './Product'
import Blackout from './Blackout'
import Location from './Location'
import FormField from './FormField'
import Employees from './Employees'
import Calendar from './Calendar'
import Mail from './Mail'
import Theme from './Theme'
import Pricing from './Pricing'
import Sync from './Sync'
import InstallApp from './InstallApp'
import General from './General'
import Dashboard from './Dashboard'
import GettingStarted from './GettingStarted'
import Contact from "./Contact";
import {NotFound} from "./NotFound";

class App extends React.Component {
    defaultState = {
        emailFieldValue: 'dharma@jadedpixel.com',
        nameFieldValue: 'Jaded Pixel',
    };

    state = {
        showToast: false,
        isLoading: false,
        isDirty: false,
        searchActive: false,
        searchText: '',
        userMenuOpen: false,
        showMobileNavigation: false,
        modalActive: false,
        nameFieldValue: this.defaultState.nameFieldValue,
        emailFieldValue: this.defaultState.emailFieldValue,
        storeName: this.defaultState.nameFieldValue,
        supportSubject: '',
        supportMessage: '',
        step: 1,
    };

    handleRouter = (route) => {
        let {step} = this.state;
        if (step < 7) {
            this.getStepInstall(route);
        } else {
            history.push(window.Laravel.relativePath + route);
        }
    };

        componentDidMount = () => {
            this.getStepInstall();
        }

    getStepInstall = (route = null) => {
        fetch(Laravel.url + '/api/get-step-install')
            .then(response => response.json())
            .then((data) => {
                if (data.success) {
                    let step = data.step;
                    if (!step || step < 6) {
                        history.push(window.Laravel.relativePath + '/install-app');
                    } else if (step == 6) {
                        history.push(window.Laravel.relativePath + '/getting-started');
                    } else {
                        if (route) {
                            history.push(window.Laravel.relativePath + route);
                        }
                    }
                    this.setState({step: data.step});
                }
            })
    }

    render() {
        const {
            showToast,
            isLoading,
            isDirty,
            searchActive,
            searchText,
            userMenuOpen,
            showMobileNavigation,
            nameFieldValue,
            emailFieldValue,
            modalActive,
            storeName,
        } = this.state;


        const toastMarkup = showToast ? (
            <Toast
                onDismiss={this.toggleState('showToast')}
                content="Changes saved"
            />
        ) : null;


        const contextualSaveBarMarkup = isDirty ? (
            <ContextualSaveBar
                message="Unsaved changes"
                saveAction={{
                    onAction: this.handleSave,
                }}
                discardAction={{
                    onAction: this.handleDiscard,
                }}
            />
        ) : null;

        const userMenuMarkup = (
            <TopBar.UserMenu
                detail={window.Laravel.shopOrigin}
                initials="B"
            />
        );

        const searchResultsMarkup = (
            <Card>
                <ActionList
                    items={[
                        {content: 'Shopify help center'},
                        {content: 'Community forums'},
                    ]}
                />
            </Card>
        );

        const searchFieldMarkup = (
            <TopBar.SearchField
                onChange={this.handleSearchFieldChange}
                value={searchText}
                placeholder="Search"
            />
        );

        const topBarMarkup = (
            <TopBar
                showNavigationToggle={true}
                userMenu={userMenuMarkup}
                onSearchResultsDismiss={this.handleSearchResultsDismiss}
                onNavigationToggle={this.toggleState('showMobileNavigation')}
            />
        );
        const navigationMarkup = (
            <nav className="Polaris-Navigation">
                <div className="Polaris-Navigation__UserMenu"></div>
                <div className="Polaris-Navigation__PrimaryNavigation Polaris-Scrollable Polaris-Scrollable--vertical"
                     data-polaris-scrollable="true">
                    <ul className="Polaris-Navigation__Section">
                        <li className="Polaris-Navigation__ListItem">
                            <div className="Polaris-Navigation__ItemWrapper">
                                <a className="Polaris-Navigation__Item"
                                    tabIndex="0"
                                    onClick={() => window.open('https://' + Laravel.shopOrigin + '/admin', "_blank")}
                                    data-polaris-unstyled="true">
                                    <div className="Polaris-Navigation__Icon">
                                        <span className="Polaris-Icon">
                                            <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                                                <path d="M17 9H5.414l3.293-3.293a.999.999 0 1 0-1.414-1.414l-5 5a.999.999 0 0 0 0 1.414l5 5a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L5.414 11H17a1 1 0 1 0 0-2" fillRule="evenodd"/>
                                            </svg>
                                        </span>
                                    </div>
                                    <span className="Polaris-Navigation__Text">Back to Shopify</span>
                                </a>
                            </div>
                        </li>
                    </ul>
                    <ul className="Polaris-Navigation__Section Polaris-Navigation__Section--withSeparator">
                        <li className="Polaris-Navigation__SectionHeading"><span
                            className="Polaris-Navigation__Text">Booking</span></li>
                        <li className="Polaris-Navigation__ListItem" onClick={() => this.handleRouter("/dashboard")} >
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg
                                    viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false"
                                    aria-hidden="true"><path
                                    d="M19.664 8.252l-9-8a1 1 0 0 0-1.328 0L8 1.44V1a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5.773L.336 8.252a1.001 1.001 0 0 0 1.328 1.496L2 9.449V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.449l.336.299a.997.997 0 0 0 1.411-.083 1.001 1.001 0 0 0-.083-1.413zM16 18h-2v-5a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v5H4V7.671l6-5.333 6 5.333V18zm-8 0v-4h4v4H8zM4 2h2v1.218L4 4.996V2z"
                                    fillRule="evenodd"/></svg></span></div>
                                <span className="Polaris-Navigation__Text">Dashboard</span></button>
                        </li>
                        <li className="Polaris-Navigation__ListItem" onClick={() => this.handleRouter("/calendar")}>
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg
                                    viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false"
                                    aria-hidden="true"><path fillRule="evenodd"
                                                             d="M19 2h-3V1a1 1 0 1 0-2 0v1H6V1a1 1 0 1 0-2 0v1H1a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 18h16V8H2v10zM2 6h16V4H2v2zm4 4a1 1 0 1 0 0 2 1 1 0 1 0 0-2m0 4a1 1 0 1 0 0 2 1 1 0 1 0 0-2m4 0a1 1 0 1 0 0 2 1 1 0 1 0 0-2m0-4a1 1 0 1 0 0 2 1 1 0 1 0 0-2m4 0a1 1 0 1 0 0 2 1 1 0 1 0 0-2"/></svg></span>
                                </div>
                                <span className="Polaris-Navigation__Text">Calendar</span></button>
                        </li>
                        <li className="Polaris-Navigation__ListItem" onClick={() => this.handleRouter("/products")}>
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg
                                    viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false"
                                    aria-hidden="true"><path
                                    d="M19 0a1 1 0 0 1 1 1v9c0 .265-.105.52-.293.707l-9 9a.997.997 0 0 1-1.414 0l-9-9a.999.999 0 0 1 0-1.414l9-9C9.48.106 9.735 0 10 0h9zm-9 17.586L11.586 16 4 8.414 2.414 10 10 17.586zm8-8V2h-7.586l-5 5L13 14.586l5-5zM15 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg></span>
                                </div>
                                <span className="Polaris-Navigation__Text">Products</span></button>
                        </li>
                        <li className="Polaris-Navigation__ListItem" onClick={() => this.handleRouter("/blackouts")}>
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg
                                    viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false"
                                    aria-hidden="true"><path
                                    d="M2 10c0-1.846.635-3.543 1.688-4.897l11.209 11.209A7.954 7.954 0 0 1 10 18c-4.411 0-8-3.589-8-8m14.312 4.897L5.103 3.688A7.954 7.954 0 0 1 10 2c4.411 0 8 3.589 8 8a7.952 7.952 0 0 1-1.688 4.897M0 10c0 5.514 4.486 10 10 10s10-4.486 10-10S15.514 0 10 0 0 4.486 0 10"/></svg></span>
                                </div>
                                <span className="Polaris-Navigation__Text">Blackouts</span></button>
                        </li>
                        <li className="Polaris-Navigation__ListItem" onClick={() => this.handleRouter("/locations")}>
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg
                                    viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false"
                                    aria-hidden="true"><path
                                    d="M10 0C5.589 0 2 3.589 2 8c0 7.495 7.197 11.694 7.504 11.869a.996.996 0 0 0 .992 0C10.803 19.694 18 15.495 18 8c0-4.412-3.589-8-8-8m-.001 17.813C8.478 16.782 4 13.296 4 8c0-3.31 2.691-6 6-6s6 2.69 6 6c0 5.276-4.482 8.778-6.001 9.813M10 10c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2m0-6C7.794 4 6 5.794 6 8s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4"/></svg></span>
                                </div>
                                <span className="Polaris-Navigation__Text">Locations</span></button>
                        </li>
                        <li className="Polaris-Navigation__ListItem" onClick={() => this.handleRouter("/forms")}>
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg
                                    viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false"
                                    aria-hidden="true"><path
                                    d="M17 18a1 1 0 1 1 0 2h-2c-.768 0-1.469-.29-2-.766A2.987 2.987 0 0 1 11 20H9a1 1 0 1 1 0-2h2a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H9a1 1 0 1 1 0-2h2c.768 0 1.469.29 2 .766A2.987 2.987 0 0 1 15 0h2a1 1 0 1 1 0 2h-2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2zm-7-3a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H2v8h7a1 1 0 0 1 1 1zm9-11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h1V6h-1a1 1 0 1 1 0-2h2zM9 9a1 1 0 1 1 0 2 1 1 0 1 1 0-2zm-5 1a1 1 0 1 1 2 0 1 1 0 1 1-2 0z"/></svg></span>
                                </div>
                                <span className="Polaris-Navigation__Text">Extra Fields</span></button>
                        </li>
                    </ul>
                    <ul className="Polaris-Navigation__Section Polaris-Navigation__Section--withSeparator">
                        <li className="Polaris-Navigation__SectionHeading"><span
                            className="Polaris-Navigation__Text">Resources</span></li>
                        <li className="Polaris-Navigation__ListItem" onClick={() => this.handleRouter("/resources/employees")}>
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg
                                    viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false"
                                    aria-hidden="true"><path
                                    d="M10 0c5.514 0 10 4.486 10 10 0 5.513-4.486 10-10 10S0 15.513 0 10C0 4.486 4.486 0 10 0zm5.603 15.7A7.97 7.97 0 0 0 18 10c0-4.41-3.589-8-8-8s-8 3.59-8 8c0 2.23.919 4.248 2.396 5.7C5.801 14.842 7.744 14 10 14c2.257 0 4.199.841 5.603 1.7zm-9.454 1.31a7.965 7.965 0 0 0 7.702-.002C12.782 16.458 11.464 16 10 16c-1.463 0-2.782.457-3.851 1.01zM10 4c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4zm0 6c1.103 0 2-.897 2-2s-.897-2-2-2-2 .897-2 2 .897 2 2 2z"/></svg></span>
                                </div>
                                <span className="Polaris-Navigation__Text">Employees</span></button>
                        </li>
                    </ul>
                    <ul className="Polaris-Navigation__Section Polaris-Navigation__Section--withSeparator">
                        <li className="Polaris-Navigation__SectionHeading"><span
                            className="Polaris-Navigation__Text">Settings</span></li>
                        <li className="Polaris-Navigation__ListItem" onClick={() => this.handleRouter("/settings/mail")}>
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg
                                    viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false"
                                    aria-hidden="true"><path
                                    d="M2 16V5.414l7.293 7.293a.997.997 0 0 0 1.414 0L18 5.414V16H2zM16.586 4L10 10.586 3.414 4h13.172zM19 2H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/></svg></span>
                                </div>
                                <span className="Polaris-Navigation__Text">Mail</span></button>
                        </li>
                        <li className="Polaris-Navigation__ListItem" onClick={() => this.handleRouter("/settings/theme")}>
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg
                                    viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false"
                                    aria-hidden="true"><path
                                    d="M17 13a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3a1 1 0 1 1 2 0v2h12v-2a1 1 0 0 1 1-1zm0-11a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V4H4v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1h14zm.555 7.168a1.001 1.001 0 0 1 0 1.664l-3 2a1 1 0 0 1-1.109-1.664L15.198 10l-1.752-1.168a1 1 0 1 1 1.109-1.664l3 2zM6.832 7.445a1 1 0 0 1-.277 1.387L4.803 10l1.752 1.168a1 1 0 1 1-1.11 1.664l-3-2a1.001 1.001 0 0 1 0-1.664l3-2a1 1 0 0 1 1.387.277zM9 14.001a1 1 0 0 1-.948-1.317l2-6a1 1 0 0 1 1.896.633l-2 6A.999.999 0 0 1 9 14z"
                                    fillRule="evenodd"/></svg></span></div>
                                <span className="Polaris-Navigation__Text">Theme Integrate</span></button>
                        </li>

                        {/* }<li className="Polaris-Navigation__ListItem" onClick={() => this.handleRouter("/settings/pricing")}>
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg
                                    viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false"
                                    aria-hidden="true"><path
                                    d="M17 0a1 1 0 1 0 0 2h1v15.132l-1.445-.964a.997.997 0 0 0-1.11 0L13 17.798l-2.445-1.63a.997.997 0 0 0-1.11 0L7 17.798l-2.445-1.63a.997.997 0 0 0-1.11 0L2 17.132V2h1a1 1 0 1 0 0-2H1a1 1 0 0 0-1 1v18a1 1 0 0 0 1.555.832L4 18.202l2.445 1.63a.997.997 0 0 0 1.11 0L10 18.202l2.445 1.63a.997.997 0 0 0 1.11 0L16 18.202l2.445 1.63a1.006 1.006 0 0 0 1.027.05A1 1 0 0 0 20 19V1a1 1 0 0 0-1-1h-2zm-6.977 9c-.026-.001-.649-.04-1.316-.707a.999.999 0 1 0-1.414 1.414A4.491 4.491 0 0 0 9 10.8v.2a1 1 0 1 0 2 0v-.185A2.995 2.995 0 0 0 13 8c0-2.281-1.727-2.712-2.758-2.97C9.127 4.751 9 4.646 9 4c0-.552.448-1 .976-1 .026.001.65.04 1.317.707a.999.999 0 1 0 1.414-1.414A4.506 4.506 0 0 0 11 1.2V1a1 1 0 1 0-2 0v.185A2.993 2.993 0 0 0 7 4c0 2.281 1.726 2.712 2.757 2.97C10.872 7.249 11 7.354 11 8c0 .552-.449 1-.977 1"/></svg></span>
                                </div>
                                <span className="Polaris-Navigation__Text">Pricing</span></button>
                        </li>
                        */}
                        <li className="Polaris-Navigation__ListItem" onClick={() => this.handleRouter("/settings/general")}>
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg
                                    viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false"
                                    aria-hidden="true"><path
                                    d="M19.492 11.897l-1.56-.88a7.8 7.8 0 0 0 0-2.035l1.56-.879a1.001 1.001 0 0 0 .37-1.38L17.815 3.26a1.001 1.001 0 0 0-1.353-.362l-1.491.841A8.078 8.078 0 0 0 13 2.586V1a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1.586a8.053 8.053 0 0 0-1.97 1.152l-1.492-.84a1 1 0 0 0-1.352.361L.139 6.723a1.001 1.001 0 0 0 .37 1.38l1.559.88A7.829 7.829 0 0 0 2 10c0 .335.023.675.068 1.017l-1.56.88a.998.998 0 0 0-.37 1.38l2.048 3.464a.999.999 0 0 0 1.352.362l1.492-.842A7.99 7.99 0 0 0 7 17.413V19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.587a8.014 8.014 0 0 0 1.97-1.152l1.492.842a1 1 0 0 0 1.353-.362l2.047-3.464a1.002 1.002 0 0 0-.37-1.38m-3.643-3.219c.1.448.15.893.15 1.322a6.1 6.1 0 0 1-.15 1.322 1 1 0 0 0 .484 1.09l1.287.725-1.03 1.742-1.252-.707a1 1 0 0 0-1.183.15 6.023 6.023 0 0 1-2.44 1.425 1 1 0 0 0-.715.96V18H9v-1.294a1 1 0 0 0-.714-.959 6.01 6.01 0 0 1-2.44-1.425 1.001 1.001 0 0 0-1.184-.15l-1.252.707-1.03-1.742 1.287-.726a.999.999 0 0 0 .485-1.089A6.043 6.043 0 0 1 4 10c0-.429.05-.874.152-1.322a1 1 0 0 0-.485-1.09L2.38 6.862 3.41 5.12l1.252.707a1 1 0 0 0 1.184-.149 6.012 6.012 0 0 1 2.44-1.426A1 1 0 0 0 9 3.294V2h2v1.294a1 1 0 0 0 .715.958c.905.27 1.749.762 2.44 1.426a1 1 0 0 0 1.183.15l1.253-.708 1.029 1.742-1.287.726a1 1 0 0 0-.484 1.09M9.999 6c-2.205 0-4 1.794-4 4s1.795 4 4 4c2.207 0 4-1.794 4-4s-1.793-4-4-4m0 6c-1.102 0-2-.897-2-2s.898-2 2-2c1.104 0 2 .897 2 2s-.896 2-2 2"/></svg></span>
                                </div>
                                <span className="Polaris-Navigation__Text">General Settings</span></button>
                        </li>
                    </ul>
                    <ul className="Polaris-Navigation__Section Polaris-Navigation__Section--withSeparator">
                        <li className="Polaris-Navigation__SectionHeading">
                            <span className="Polaris-Navigation__Text">Help Center</span>
                        </li>
                        <li className="Polaris-Navigation__ListItem" onClick={() => this.handleRouter("/contact")}>
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon">
                                    <span className="Polaris-Icon">
                                        <span className="p_2-hnq" style={{color: 'rgb(145, 158, 171)'}}>
                                            <svg aria-hidden="true"
                                                focusable="false"
                                                data-prefix="fas"
                                                data-icon="file-signature"
                                                className="svg-inline--fa fa-file-signature fa-w-18"
                                                role="img"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 576 512">
                                                <path fill="currentColor" d="M218.17 424.14c-2.95-5.92-8.09-6.52-10.17-6.52s-7.22.59-10.02 6.19l-7.67 15.34c-6.37 12.78-25.03 11.37-29.48-2.09L144 386.59l-10.61 31.88c-5.89 17.66-22.38 29.53-41 29.53H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h12.39c4.83 0 9.11-3.08 10.64-7.66l18.19-54.64c3.3-9.81 12.44-16.41 22.78-16.41s19.48 6.59 22.77 16.41l13.88 41.64c19.75-16.19 54.06-9.7 66 14.16 1.89 3.78 5.49 5.95 9.36 6.26v-82.12l128-127.09V160H248c-13.2 0-24-10.8-24-24V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24v-40l-128-.11c-16.12-.31-30.58-9.28-37.83-23.75zM384 121.9c0-6.3-2.5-12.4-7-16.9L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1zm-96 225.06V416h68.99l161.68-162.78-67.88-67.88L288 346.96zm280.54-179.63l-31.87-31.87c-9.94-9.94-26.07-9.94-36.01 0l-27.25 27.25 67.88 67.88 27.25-27.25c9.95-9.94 9.95-26.07 0-36.01z"/>
                                            </svg>
                                        </span>
                                    </span>
                                </div>
                                <span className="Polaris-Navigation__Text">Contact us</span>
                            </button>
                        </li>
                        <li className="Polaris-Navigation__ListItem">
                            <button type="button" className="Polaris-Navigation__Item">
                                <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg
                                    viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false"
                                    aria-hidden="true"><path
                                    d="M17.707 4.293l-4-4A.997.997 0 0 0 13 0H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a.997.997 0 0 0-.293-.707zM16 18H4V2h8.586L16 5.414V18zm-3-5H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2m-7-3a1 1 0 0 0 1 1h6a1 1 0 0 0 0-2H7a1 1 0 0 0-1 1m1-3h1a1 1 0 0 0 0-2H7a1 1 0 0 0 0 2"/></svg></span>
                                </div>
                                <span className="Polaris-Navigation__Text">
                                    <a href="https://tipo.io/index.php/kbtopic/tipo-booking/" target="_blank" style={{textDecoration: 'none', color: 'inherit'}}>
                                        Documentation
                                    </a>
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

        );

        const loadingMarkup = isLoading ? <Loading/> : null;

        const actualPageMarkup = (
            <Switch>
                <Route exact path='/' component={Dashboard} />
                <Route exact path={window.Laravel.relativePath + '/products'} component={Product}/>
                <Route exact path={window.Laravel.relativePath + '/blackouts'} component={Blackout}/>
                <Route exact path={window.Laravel.relativePath + '/locations'} component={Location}/>
                <Route exact path={window.Laravel.relativePath + '/forms'} component={FormField}/>
                <Route exact path={window.Laravel.relativePath + '/resources/employees'} component={Employees}/>
                {/*<Route exact path='/resources/other' component={Resource} />*/}
                <Route exact path={window.Laravel.relativePath + '/calendar'} component={Calendar}/>
                <Route exact path={window.Laravel.relativePath + '/settings/mail'} component={Mail}/>
                <Route exact path={window.Laravel.relativePath + '/settings/theme'} component={Theme}/>
                <Route exact path={window.Laravel.relativePath + '/settings/pricing'} component={Pricing}/>
                <Route exact path={window.Laravel.relativePath + '/sync'} component={Sync}/>
                <Route exact path={window.Laravel.relativePath + '/install-app'} component={InstallApp}/>
                <Route exact path={window.Laravel.relativePath + '/settings/general'} component={General}/>
                <Route exact path={window.Laravel.relativePath + '/dashboard'} component={Dashboard}/>
                <Route exact path={window.Laravel.relativePath + '/index'} component={Dashboard}/>
                <Route exact path={window.Laravel.relativePath + '/contact'} component={Contact}/>
                <Route exact path={window.Laravel.relativePath + '/getting-started'} component={GettingStarted}/>
                <Route component={NotFound} />
            </Switch>
        );

        const loadingPageMarkup = (
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

        const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

        const modalMarkup = (
            <Modal
                open={modalActive}
                onClose={this.toggleState('modalActive')}
                title="Contact support"
                primaryAction={{
                    content: 'Send',
                    onAction: this.toggleState('modalActive'),
                }}
            >
                <Modal.Section>
                    <FormLayout>
                        <TextField
                            label="Subject"
                            value={this.state.supportSubject}
                            onChange={this.handleSubjectChange}
                        />
                        <TextField
                            label="Message"
                            value={this.state.supportMessage}
                            onChange={this.handleMessageChange}
                            multiline
                        />
                    </FormLayout>
                </Modal.Section>
            </Modal>
        );

        const theme = {
            colors: {
                topBar: {
                    color: '#f9fafb',
                    background: '#1c2260',
                    backgroundDarker: '#00084b',
                    backgroundLighter: '#43467f'
                },
            },
            logo: {
                width: 124,
                topBarSource:
                    window.Laravel.url + '/images/logo.png',
                contextualSaveBarSource:
                    window.Laravel.url + '/images/logo.png',
                url: 'https://apps.shopify.com/tipo-appointment-booking',
                accessibilityLabel: 'Booking'
            },
        };

        return (
            <AppProvider theme={theme}>
                <Frame
                    topBar={topBarMarkup}
                    navigation={navigationMarkup}
                    showMobileNavigation={showMobileNavigation}
                    onNavigationDismiss={this.toggleState('showMobileNavigation')}
                >
                    {contextualSaveBarMarkup}
                    {loadingMarkup}
                    {pageMarkup}
                    {toastMarkup}
                    {modalMarkup}
                </Frame>
            </AppProvider>
        );
    }

    toggleState = (key) => {
        return () => {
            this.setState((prevState) => ({[key]: !prevState[key]}));
        };
    };

    handleSearchFieldChange = (value) => {
        this.setState({searchText: value});
        if (value.length > 0) {
            this.setState({searchActive: true});
        } else {
            this.setState({searchActive: false});
        }
    };

    handleSearchResultsDismiss = () => {
        this.setState(() => {
            return {
                searchActive: false,
                searchText: '',
            };
        });
    };

    handleEmailFieldChange = (emailFieldValue) => {
        this.setState({emailFieldValue});
        if (emailFieldValue != '') {
            this.setState({isDirty: true});
        }
    };

    handleNameFieldChange = (nameFieldValue) => {
        this.setState({nameFieldValue});
        if (nameFieldValue != '') {
            this.setState({isDirty: true});
        }
    };

    handleSave = () => {
        this.defaultState.nameFieldValue = this.state.nameFieldValue;
        this.defaultState.emailFieldValue = this.state.emailFieldValue;

        this.setState({
            isDirty: false,
            showToast: true,
            storeName: this.defaultState.nameFieldValue,
        });
    };

    handleDiscard = () => {
        this.setState({
            emailFieldValue: this.defaultState.emailFieldValue,
            nameFieldValue: this.defaultState.nameFieldValue,
            isDirty: false,
        });
    };

    handleSubjectChange = (supportSubject) => {
        this.setState({supportSubject});
    };

    handleMessageChange = (supportMessage) => {
        this.setState({supportMessage});
    };
}

export default App;
