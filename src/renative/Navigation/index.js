import React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import { Icon, Api } from '../index';

const createSideMenuNavigator = require('react-navigation-side-menu').createSideMenuNavigator;

let _currentNavigation;

const getNavigation = () => _currentNavigation;

const handleNavigationChange = (n) => {
    console.log('LDKJLKD', n);
};

const shouldUse = (menu) => {
    if (menu && menu.isVisibleIn.includes(Api.platform)) {
        console.log('YEEES');
        return true;
    }
    return false;
};

const createFilteredStackNavigator = (componentMap, rootRoute, rootScreen, rootNavOptions, allStacks, filter) => {
    const stacks = {};
    stacks[rootRoute] = {
        screen: componentMap[rootScreen.screen],
        navigationOptions: Object.assign({}, rootNavOptions, rootScreen.navigationOptions),
    };

    console.log('SLKJSJSL', stacks[rootRoute]);

    for (stackKey in allStacks.screens) {
        if (filter.includes(`stacks.${stackKey}`)) {
            stacks[stackKey] = {
                screen: componentMap[allStacks.screens[stackKey].screen],
                navigationOptions: Object.assign({}, allStacks.navigationOptions, allStacks.screens[stackKey].navigationOptions),
            };
        }
    }
    console.log('SAAAAAA', stacks);
    return createStackNavigator(stacks);
};

const createApp = (c, componentMap) => {
    const root = c.root;
    let rootNav;
    let stackNav;

    const roots = {};
    for (rootKey in root.screens) {
        const rootConfig = root.screens[rootKey];
        roots[rootKey] = {
            screen: createFilteredStackNavigator(componentMap, rootKey, rootConfig, root.navigationOptions, c.stacks, rootConfig.stacks),
            navigationOptions: Object.assign(root.navigationOptions, rootConfig.navigationOptions),
        };
    }

    if (root.menus) {
        // ROOT CONTENT IS WRAPPED IN MENU
        if (shouldUse(root.menus.drawerMenu)) {
            rootNav = createDrawerNavigator(roots, {
                contentComponent: componentMap[root.menus.drawerMenu.component],
                ...root.menus.drawerMenu.options,
            });
        } else if (shouldUse(root.menus.sideMenu)) {
            rootNav = createSideMenuNavigator(roots, {
                tabBarComponent: componentMap[root.menus.sideMenu.component],
                tabBarOptions: {
                    style: {
                        width: root.menus.sideMenu.options.menuWidth || 250
                    }
                },
                navigationOptions: {
                    tabStyle: {
                        width: 100,
                        backgroundColor: 'red'
                    }
                },
            });
        }
    } else {
        // ROOT CONTENT HAS NO MENU
    }

    const Navigator = createAppContainer(rootNav);

    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#222222' }}>
            <Navigator
                ref={(nav) => {
                    _currentNavigation = nav._navigation;
                }}
                onNavigationStateChange={handleNavigationChange}
                uriPrefix="/app"
            />
        </View>
    );
};

export { createApp, getNavigation };
