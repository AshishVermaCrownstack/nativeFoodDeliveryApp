import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React, {FC} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {COLORS, icons} from '../constants';
import {Home} from '../screens';

import {isIphoneX} from 'react-native-iphone-x-helper';

const Tab = createBottomTabNavigator();

const TabBarCustomButton: FC<{
  accessibilityState?: any | undefined;
  onPress?: any | undefined;
}> = ({children, accessibilityState, onPress}): JSX.Element => {
  if (accessibilityState.selected) {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <View style={{position: 'absolute', flexDirection: 'row', top: 0}}>
          <View style={{flex: 1, backgroundColor: COLORS.white}} />
          <Svg width={70} height={60} viewBox="0 0 75 61">
            <Path
              d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
              fill={COLORS.white}
            />
          </Svg>
          <View style={{flex: 1, backgroundColor: COLORS.white}} />
        </View>
        <TouchableOpacity
          style={{
            top: -22.5,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            width: 50,
            height: 50,
            borderRadius: 100,
          }}
          onPress={onPress}>
          {children}
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={{flex: 1, backgroundColor: COLORS.white, height: 60}}
        activeOpacity={1}
        onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }
};

const CustomTabBar: FC<{props: any}> = (props): JSX.Element => {
  if (isIphoneX()) {
    return (
      <View>
        <BottomTabBar {...props.props} />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: COLORS.white,
            height: 30,
            width: '100%',
          }}
        />
      </View>
    );
  } else {
    return <BottomTabBar {...props.props} />;
  }
};

const TabNavigation: FC = (): JSX.Element => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
      tabBar={props => <CustomTabBar props={props} />}>
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={icons.cutlery}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? COLORS.primary : COLORS.secondary,
              }}
            />
          ),
          tabBarButton: props => {
            return <TabBarCustomButton {...props} />;
          },
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={icons.search}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? COLORS.primary : COLORS.secondary,
              }}
            />
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />,
        }}
        name="Search"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={icons.like}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? COLORS.primary : COLORS.secondary,
              }}
            />
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />,
        }}
        name="Like"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={icons.user}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? COLORS.primary : COLORS.secondary,
              }}
            />
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />,
        }}
        name="User"
        component={Home}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
