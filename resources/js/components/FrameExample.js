import React, {useState, Component } from 'react'
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
    FormsMajorMonotone,
    OrdersMajorTwotone,
    ConversationMinor
} from "@shopify/polaris-icons";
import {BrowserRouter,Route, Link, Switch} from 'react-router-dom'
import history from '../history';
import Setting from './Setting';
import Landing from './Landing';
import Dashboard from './Dashboard';

export default class FrameExample extends Component{
    defaultState = {
        emailFieldValue: 'dharma@jadedpixel.com',
        nameFieldValue: 'Jaded Pixel',
    };

    constructor(props){
        super(props);
        this.state = {
            nameFieldValue: this.defaultState.nameFieldValue,
            emailFieldValue: this.defaultState.emailFieldValue,
            storeName: this.defaultState.nameFieldValue,
            isLoading: false,
            isDirty: false,
            showMobileNavigation: false,
            modalActive: false,
            searchActive: false
        };
        this.handleRouter = this.handleRouter.bind(this);
    }

    handleRouter = (route) => {
        this.props.history.push(route);
    };

    render(){
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

        const userMenuActions = [
            {
                items: [{content: 'Community forums'}],
            },
        ];

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

        const userMenuMarkup = (
            <TopBar.UserMenu
                actions={userMenuActions}
                name="Dharma"
                detail={storeName}
                initials="D"
            />
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
                searchResultsVisible={searchActive}
                searchField={searchFieldMarkup}
                onNavigationToggle={this.toggleState('showMobileNavigation')}
            />
        );

        // const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

        // const loadingPageMarkup = (
        //     <SkeletonPage>
        //         <Layout>
        //             <Layout.Section>
        //                 <Card sectioned>
        //                     <TextContainer>
        //                         <SkeletonDisplayText size="small"/>
        //                         <SkeletonBodyText lines={9}/>
        //                     </TextContainer>
        //                 </Card>
        //             </Layout.Section>
        //         </Layout>
        //     </SkeletonPage>
        // );

        const pageMarkup = (
            <Switch>
                <Route path={window.Laravel.relativePath + '/dashboard'} component={Dashboard} />
                <Route path={window.Laravel.relativePath + '/wl_view'} component={Landing}/>
                <Route path={window.Laravel.relativePath + '/wl_setting'} component={Setting}/>
            </Switch>
        );

        const navigationMarkup =(
            <Navigation location="/">
                <Navigation.Section
                items={[
                    {
                    label: 'Back to Shopify',
                    icon: ArrowLeftMinor,
                    },
                ]}
                />
                <Navigation.Section
                separator
                title="Jaded Pixel App"
                items={[
                    {
                        label: 'Dashboard',
                        icon: HomeMajorMonotone,
                        onClick: () => this.handleRouter(window.Laravel.relativePath + '/dashboard'),
                    },
                    {
                        label: 'Wishlist',
                        icon: OrdersMajorTwotone,
                        onClick: () => this.handleRouter(window.Laravel.relativePath + '/wl_view'),
                    },
                    {
                        label: 'Setting',
                        icon: OrdersMajorTwotone,
                        onClick: () => this.handleRouter(window.Laravel.relativePath + '/wl_setting'),
                    }
                ]}
                action={{
                    icon: ConversationMinor,
                    accessibilityLabel: 'Contact support',
                    onClick: this.toggleState('modalActive')
                }}
                />
            </Navigation>
        )

        const loadingMarkup = isLoading ? <Loading/> : null;

        const theme = {
            colors: {
                topBar: {
                    color: '#f9fafb',
                    background: '#1c2260',
                    backgroundDarker: '#00084b',
                    backgroundLighter: '#43467f'
                }
            },
            logo: {
              width: 124,
              topBarSource:
                'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999',
              url: 'http://jadedpixel.com',
              accessibilityLabel: 'Jaded Pixel',
            },
        };

        return(
            <AppProvider theme={theme}
            >
                <Frame
                    topBar={topBarMarkup}
                    navigation={navigationMarkup}
                    showMobileNavigation={showMobileNavigation}
                    onNavigationDismiss={this.toggleState('showMobileNavigation')}
                >
                    {loadingMarkup}
                    {pageMarkup}
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
    };
}
