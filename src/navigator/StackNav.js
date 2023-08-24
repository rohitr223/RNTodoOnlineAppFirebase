import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// screens
import Splash from '../screens/Splash';
import SignIn from '../screens/SignIn';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

const StackNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNav;
